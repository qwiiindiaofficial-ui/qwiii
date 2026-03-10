import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPPORTUNITY_TYPES = [
  "seasonal_demand",
  "untapped_region",
  "product_gap",
  "buyer_reengagement",
  "export_window",
  "competitor_weakness",
];

const INDIAN_FESTIVALS_2026 = [
  { name: "Holi", date: "2026-03-23", products: ["Dress Material", "Lehengas", "Sarees"] },
  { name: "Eid ul-Fitr", date: "2026-04-02", products: ["Sarees", "Dress Material"] },
  { name: "Navratri/Garba", date: "2026-10-02", products: ["Lehengas", "Sarees", "Chaniya Choli"] },
  { name: "Dussehra", date: "2026-10-11", products: ["Sarees", "Dress Material"] },
  { name: "Diwali", date: "2026-10-29", products: ["Sarees", "Lehengas", "Dress Material", "Kurtas"] },
  { name: "Navratri", date: "2026-03-22", products: ["Lehengas", "Sarees"] },
  { name: "Durga Puja", date: "2026-10-09", products: ["Sarees", "Dress Material"] },
  { name: "Christmas & New Year", date: "2026-12-25", products: ["Dress Material", "Kurtas"] },
  { name: "Ugadi/Gudi Padwa", date: "2026-03-19", products: ["Sarees", "Dress Material"] },
  { name: "Onam", date: "2026-08-26", products: ["Sarees", "Kerala Kasavu"] },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUpcomingFestivals(withinDays = 120) {
  return INDIAN_FESTIVALS_2026
    .map((f) => ({ ...f, daysUntil: getDaysUntil(f.date) }))
    .filter((f) => f.daysUntil > 0 && f.daysUntil <= withinDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jwt = authHeader.replace(/^Bearer\s+/i, "");

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token", detail: authError?.message }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const geminiKeyResult = await serviceClient
      .from("app_settings")
      .select("value")
      .eq("key", "gemini_api_key")
      .maybeSingle();

    const apiKey = geminiKeyResult?.data?.value;

    const upcomingFestivals = getUpcomingFestivals(120);

    const businessContext = {
      regions: [
        { name: "North India", revenue: 4500000, growth: 18.5, buyers: 85, marketShare: 32 },
        { name: "South India", revenue: 3800000, growth: 22.3, buyers: 72, marketShare: 27 },
        { name: "West India", revenue: 3200000, growth: 15.2, buyers: 68, marketShare: 23 },
        { name: "East India", revenue: 2100000, growth: 28.7, buyers: 45, marketShare: 15 },
        { name: "Export (UAE/USA/UK)", revenue: 1800000, growth: 35.4, buyers: 18, marketShare: 3 },
      ],
      products: ["Sarees", "Dress Material", "Lehengas", "Kurtas"],
      totalRevenue: 15400000,
      totalBuyers: 384,
      competitors: [
        { name: "Brand A", share: 28, weakness: "Premium Pricing" },
        { name: "Brand B", share: 22, weakness: "Limited Range" },
        { name: "Brand C", share: 15, weakness: "Quality Issues" },
      ],
      expansionCities: ["Indore", "Chandigarh", "Kochi", "Surat", "Nagpur", "Coimbatore"],
      currentDate: new Date().toISOString().split("T")[0],
      upcomingFestivals: upcomingFestivals.slice(0, 5),
    };

    let opportunities: Array<{
      type: string;
      priority: string;
      title: string;
      description: string;
      estimated_impact: string;
      action_label: string;
      action_type: string;
      action_payload: Record<string, unknown>;
      timeline_days: number;
    }> = [];

    if (apiKey) {
      const prompt = `You are an AI business intelligence advisor for an Indian textile/apparel manufacturing business.
Analyze the following business data and generate 6-8 highly specific, actionable market opportunities for the business owner.

Business Context:
${JSON.stringify(businessContext, null, 2)}

Generate opportunities in these categories (use each type at least once):
1. seasonal_demand - Based on upcoming festivals, generate demand forecasts for specific products
2. untapped_region - Identify underperforming regions with high growth potential
3. product_gap - Market trends suggesting a product category to focus on
4. buyer_reengagement - Strategy to re-engage inactive buyers in specific regions
5. export_window - International market opportunities (UAE Ramadan buying season, USA festive gifting, etc.)
6. competitor_weakness - Specific competitor weakness to capitalize on

For each opportunity, respond with a JSON array. Each item must have these exact fields:
- type: one of the 6 types above
- priority: "high", "medium", or "low"
- title: catchy 6-10 word headline in English (specific, not generic)
- description: 2-3 sentences explaining the opportunity with specific numbers/data from the context
- estimated_impact: specific revenue estimate like "₹8-12L additional/month" or "15% market share gain"
- action_label: short CTA text like "Plan Expansion", "Contact Buyers", "Boost Stock"
- action_type: one of: expand, contact_buyers, view_region, boost_stock, view_competitors
- action_payload: JSON object with relevant data (e.g. {"region": "East India"} or {"festival": "Diwali", "product": "Lehengas"})
- timeline_days: number of days within which to act (7, 14, 21, 30, 45, 60, 90)

Make insights highly specific to Indian textile business. Mention festival names, city names, product names.
Respond ONLY with a valid JSON array, no markdown, no explanation.`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 2000 },
          }),
        }
      );

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          try {
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) {
              opportunities = parsed;
            }
          } catch {
            const match = content.match(/\[[\s\S]*\]/);
            if (match) {
              try {
                opportunities = JSON.parse(match[0]);
              } catch {
                // fall through to static generation
              }
            }
          }
        }
      }
    }

    if (opportunities.length === 0) {
      const festivals = upcomingFestivals;
      opportunities = [
        {
          type: "seasonal_demand",
          priority: "high",
          title: festivals[0]
            ? `${festivals[0].name} Season: Stock Up on ${festivals[0].products[0]}`
            : "Festival Season Demand Surge Coming",
          description: festivals[0]
            ? `${festivals[0].name} is ${festivals[0].daysUntil} days away. Historically, ${festivals[0].products.join(" and ")} sales spike 3-4x during this period. Your North India and West India buyers typically place large orders 3-4 weeks before the festival.`
            : "Major festive season is approaching. Plan inventory and reach out to buyers early to secure bulk orders.",
          estimated_impact: "₹10-15L additional revenue",
          action_label: "Boost Stock",
          action_type: "boost_stock",
          action_payload: { festival: festivals[0]?.name, product: festivals[0]?.products[0] },
          timeline_days: festivals[0] ? Math.min(festivals[0].daysUntil - 14, 30) : 30,
        },
        {
          type: "untapped_region",
          priority: "high",
          title: "East India Growing at 28.7% - Expand Now",
          description:
            "East India (Kolkata, Patna, Guwahati) is your fastest growing region at 28.7% YoY but contributes only 15% of revenue. With only 45 buyers vs 85 in North India, there is a large untapped buyer pool. Adding 20 more dealers here could add ₹8-12L/month.",
          estimated_impact: "₹8-12L/month additional",
          action_label: "Plan Expansion",
          action_type: "expand",
          action_payload: { region: "East India", cities: ["Kolkata", "Patna", "Guwahati"] },
          timeline_days: 45,
        },
        {
          type: "export_window",
          priority: "high",
          title: "UAE Ramadan Pre-Order Window Opens Soon",
          description:
            "The UAE market's pre-Ramadan buying season starts 60-90 days before Ramadan. Your export revenue is growing at 35.4% YoY but represents only 3% of total revenue. Targeting UAE-based ethnic wear retailers now can significantly boost this segment.",
          estimated_impact: "₹5-8L/month export revenue",
          action_label: "Contact Buyers",
          action_type: "contact_buyers",
          action_payload: { region: "Export", country: "UAE" },
          timeline_days: 21,
        },
        {
          type: "competitor_weakness",
          priority: "medium",
          title: "Brand A's Premium Pricing is Losing Customers",
          description:
            "Brand A holds 28% market share but is known for premium pricing that excludes mid-tier buyers. Positioning your quality products at 10-15% lower price points in their strongholds (Delhi, Jaipur) could capture 2-3% market share.",
          estimated_impact: "2-3% market share gain",
          action_label: "View Competitors",
          action_type: "view_competitors",
          action_payload: { competitor: "Brand A", strategy: "price_positioning" },
          timeline_days: 60,
        },
        {
          type: "buyer_reengagement",
          priority: "medium",
          title: "Re-engage South India Buyers Before Season",
          description:
            "South India is your second largest market at ₹38L/month. With Onam and other South Indian festivals approaching, now is the ideal time to reach out to inactive buyers in Chennai, Bangalore, and Hyderabad with new collection previews and seasonal offers.",
          estimated_impact: "₹4-6L reactivated revenue",
          action_label: "Contact Buyers",
          action_type: "contact_buyers",
          action_payload: { region: "South India", trigger: "seasonal" },
          timeline_days: 30,
        },
        {
          type: "product_gap",
          priority: "medium",
          title: "Online Channel at 15% - Huge Growth Opportunity",
          description:
            "Your online channel contributes only 15% of revenue vs industry average of 35% for apparel businesses. D2C platforms like Meesho, Flipkart Fashion, and Nykaa Fashion are seeing strong demand for ethnic wear. Building an online presence could double online revenue within 6 months.",
          estimated_impact: "₹15-20L/month new channel",
          action_label: "View Analytics",
          action_type: "view_region",
          action_payload: { channel: "online", platforms: ["Meesho", "Flipkart", "Nykaa"] },
          timeline_days: 90,
        },
      ];
    }

    await serviceClient
      .from("market_opportunities")
      .update({ status: "dismissed" })
      .eq("user_id", user.id)
      .eq("status", "new");

    const toInsert = opportunities.map((opp) => ({
      user_id: user.id,
      type: opp.type,
      priority: opp.priority,
      title: opp.title,
      description: opp.description,
      estimated_impact: opp.estimated_impact,
      action_label: opp.action_label,
      action_type: opp.action_type,
      action_payload: opp.action_payload,
      timeline_days: opp.timeline_days,
      status: "new",
      expires_at: new Date(Date.now() + opp.timeline_days * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const { error: insertError } = await serviceClient
      .from("market_opportunities")
      .insert(toInsert);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, count: toInsert.length, ai_powered: !!apiKey }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-market-opportunities error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate opportunities", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
