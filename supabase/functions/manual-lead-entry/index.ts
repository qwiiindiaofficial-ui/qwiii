import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { leads } = await req.json();

    const processedLeads = [];
    let groqCalls = 0;
    let geminiCalls = 0;

    for (const leadInput of leads) {
      const enrichmentResponse = await fetch(`${supabaseUrl}/functions/v1/lead-enrichment`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead: leadInput,
        }),
      });

      let enrichedData = {
        potential_sticker_needs: ["Product labels", "Branding stickers"],
        estimated_order_value: 15000,
        suggested_pitch: "Custom stickers for your business",
        ai_insights: "Potential customer based on industry",
      };

      if (enrichmentResponse.ok) {
        const enrichmentResult = await enrichmentResponse.json();
        enrichedData = enrichmentResult.enriched_data || enrichedData;
        groqCalls += enrichmentResult.api_calls || 0;
      }

      const leadWithEnrichment = {
        ...leadInput,
        ...enrichedData,
      };

      const scoringResponse = await fetch(`${supabaseUrl}/functions/v1/lead-scoring`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead: leadWithEnrichment,
        }),
      });

      let scoringData = {
        score: 50,
        priority: "warm",
        confidence_level: "medium",
        scoring_rationale: "Default scoring applied",
      };

      if (scoringResponse.ok) {
        const scoringResult = await scoringResponse.json();
        scoringData = scoringResult.scoring || scoringData;
        geminiCalls += scoringResult.api_calls || 0;
      }

      const finalLead = {
        ...leadInput,
        potential_sticker_needs: enrichedData.potential_sticker_needs,
        estimated_order_value: enrichedData.estimated_order_value,
        suggested_pitch: enrichedData.suggested_pitch,
        ai_insights: enrichedData.ai_insights,
        score: scoringData.score,
        priority: scoringData.priority,
        confidence_level: scoringData.confidence_level,
        source: "manual_entry",
        status: "new",
      };

      const insertResult = await supabase
        .from("leads")
        .insert(finalLead)
        .select()
        .single();

      if (insertResult.data) {
        processedLeads.push(insertResult.data);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        leads_processed: processedLeads.length,
        leads: processedLeads,
        api_usage: {
          groq: groqCalls,
          gemini: geminiCalls,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Manual lead entry error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process leads",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
