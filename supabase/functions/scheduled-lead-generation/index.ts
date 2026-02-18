import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizePhone(phone: string): string {
  if (!phone) return "";
  return phone.replace(/[^0-9+]/g, '');
}

async function checkForDuplicate(supabase: any, lead: any, userId: string): Promise<boolean> {
  const normalizedPhone = normalizePhone(lead.phone || "");

  const checks = [];

  if (lead.google_place_id) {
    checks.push(
      supabase
        .from("leads")
        .select("id")
        .eq("user_id", userId)
        .eq("google_place_id", lead.google_place_id)
        .maybeSingle()
    );
  }

  if (normalizedPhone) {
    checks.push(
      supabase
        .from("leads")
        .select("id")
        .eq("user_id", userId)
        .eq("normalized_phone", normalizedPhone)
        .maybeSingle()
    );
  }

  if (lead.company_name) {
    checks.push(
      supabase
        .from("leads")
        .select("id")
        .eq("user_id", userId)
        .ilike("company_name", lead.company_name)
        .maybeSingle()
    );
  }

  const results = await Promise.all(checks);

  for (const result of results) {
    if (result.data) {
      return true;
    }
  }

  return false;
}

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    let userId: string;
    try {
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data: { user }, error: authError } = await userClient.auth.getUser(token);

      if (authError || !user) {
        console.error("Auth error:", authError);
        throw new Error("Invalid authentication token");
      }

      userId = user.id;
    } catch (error) {
      console.error("Token validation error:", error);
      throw new Error("Invalid authentication token");
    }

    const { targetIndustry, targetLocation, limit = 20 } = await req.json().catch(() => ({}));

    const logEntry = await supabase
      .from("lead_generation_logs")
      .insert({
        user_id: userId,
        status: "running",
        target_industry: targetIndustry,
        target_location: targetLocation,
      })
      .select()
      .single();

    const logId = logEntry.data?.id ?? null;

    let industry = targetIndustry;
    let location = targetLocation;
    let sourceId: string | null = null;

    if (!industry || !location) {
      const dayOfWeek = new Date().getDay();

      let leadSource;
      if (targetIndustry) {
        leadSource = await supabase
          .from("lead_sources")
          .select("*")
          .eq("user_id", userId)
          .eq("industry_name", targetIndustry)
          .eq("is_active", true)
          .maybeSingle();
      } else {
        leadSource = await supabase
          .from("lead_sources")
          .select("*")
          .eq("user_id", userId)
          .eq("day_of_week", dayOfWeek)
          .eq("is_active", true)
          .maybeSingle();

        if (!leadSource.data) {
          leadSource = await supabase
            .from("lead_sources")
            .select("*")
            .eq("user_id", userId)
            .eq("is_active", true)
            .order("priority", { ascending: false })
            .limit(1)
            .maybeSingle();
        }
      }

      if (leadSource.data) {
        const source = leadSource.data;
        sourceId = source.id;
        industry = industry || source.industry_name;
        const locations = source.target_locations || ["Mumbai"];
        location = location || locations[Math.floor(Math.random() * locations.length)];
      }
    }

    if (!industry || !location) {
      throw new Error("Please provide industry and location, or configure lead sources in settings.");
    }

    const industryKeywords: Record<string, string[]> = {
      retail: ["retail store", "supermarket", "department store", "shopping store", "general store"],
      restaurant: ["restaurant", "dhaba", "food restaurant", "dining restaurant"],
      education: ["school", "college", "coaching institute", "training institute", "academy"],
      healthcare: ["hospital", "clinic", "medical center", "nursing home", "diagnostic center"],
      salon: ["beauty salon", "hair salon", "spa", "parlour"],
      gym: ["gym", "fitness center", "health club", "workout center"],
      hotel: ["hotel", "resort", "guest house", "lodge"],
      cafe: ["cafe", "coffee shop", "bakery", "tea shop"],
      textile: ["textile shop", "clothing store", "garment shop", "fabric store", "boutique"],
      manufacturing: ["factory", "manufacturing unit", "production unit", "workshop"],
      events: ["event management", "wedding planner", "event venue", "banquet hall"],
      "e-commerce": ["online store", "ecommerce business", "delivery service"],
      pharmacy: ["pharmacy", "medical store", "chemist", "drug store"],
      automobile: ["car showroom", "automobile dealer", "auto parts", "garage", "car service"],
      electronics: ["electronics store", "mobile shop", "computer store", "gadget shop"],
      real_estate: ["real estate agency", "property dealer", "builders", "construction company"],
      logistics: ["courier service", "logistics company", "transport company", "delivery company"],
      printing: ["printing press", "print shop", "digital printing", "offset printing"],
      food_processing: ["food processing", "food manufacturer", "snack manufacturer", "bakery"],
      packaging: ["packaging company", "box manufacturer", "packaging supplier"],
      default: ["business", "company", "shop", "store", "enterprise"],
    };

    const industryKeywordList = industryKeywords[industry.toLowerCase()] || industryKeywords.default;
    const totalKeywords = industryKeywordList.length;

    const { data: districts } = await supabase
      .from("city_districts")
      .select("id, district_name, lat, lng, search_radius")
      .eq("city", location)
      .order("display_order", { ascending: true });

    const totalDistricts = districts?.length ?? 0;

    const { data: searchState } = await supabase
      .from("lead_search_state")
      .select("*")
      .eq("user_id", userId)
      .eq("city", location)
      .eq("industry", industry)
      .maybeSingle();

    const lastDistrictIndex = searchState?.last_district_index ?? -1;
    const lastKeywordIndex = searchState?.last_keyword_index ?? -1;

    const nextDistrictIndex = totalDistricts > 0 ? (lastDistrictIndex + 1) % totalDistricts : -1;
    const nextKeywordIndex = (lastKeywordIndex + 1) % totalKeywords;

    const activeDistrict = totalDistricts > 0 ? districts![nextDistrictIndex] : null;
    const activeKeyword = industryKeywordList[nextKeywordIndex];

    console.log(`Generating leads for ${industry} in ${activeDistrict ? `${activeDistrict.district_name}, ` : ""}${location} | keyword: "${activeKeyword}"`);

    const scraperBody: Record<string, unknown> = {
      industry,
      location,
      limit,
      keyword_index: nextKeywordIndex,
    };

    if (activeDistrict) {
      scraperBody.district = activeDistrict.district_name;
      scraperBody.district_lat = activeDistrict.lat;
      scraperBody.district_lng = activeDistrict.lng;
      scraperBody.district_radius = activeDistrict.search_radius;
    }

    const scraperResponse = await fetch(`${supabaseUrl}/functions/v1/lead-scraper`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scraperBody),
    });

    if (!scraperResponse.ok) {
      const errorData = await scraperResponse.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(`Scraper failed: ${errorData.message || scraperResponse.status}`);
    }

    const scraperData = await scraperResponse.json();
    const scrapedLeads = scraperData.leads || [];
    const keywordUsed = scraperData.keyword_used || activeKeyword;
    const districtUsed = activeDistrict?.district_name ?? null;

    let googleMapsCallsTotal = scraperData.api_calls || 0;
    let groqCallsTotal = 0;
    let geminiCallsTotal = 0;
    let successfulLeads = 0;
    let skippedDuplicates = 0;
    let failedLeads = 0;

    console.log(`Scraped ${scrapedLeads.length} leads from Google Maps`);

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const write = (chunk: string) => writer.write(encoder.encode(chunk));

    EdgeRuntime.waitUntil((async () => {
      try {
        await write(sseEvent("start", {
          total: scrapedLeads.length,
          industry,
          location,
        }));

        for (let i = 0; i < scrapedLeads.length; i++) {
          const scrapedLead = scrapedLeads[i];
          try {
            const isDuplicate = await checkForDuplicate(supabase, scrapedLead, userId);

            if (isDuplicate) {
              console.log(`Skipping duplicate lead: ${scrapedLead.company_name}`);
              skippedDuplicates++;
              await write(sseEvent("progress", {
                current: i + 1,
                total: scrapedLeads.length,
                skipped: true,
                company_name: scrapedLead.company_name,
              }));
              continue;
            }

            await sleep(500);

            const enrichmentResponse = await fetch(`${supabaseUrl}/functions/v1/lead-enrichment`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ lead: scrapedLead }),
            });

            let enrichedData = {
              potential_sticker_needs: ["Product labels", "Branding stickers"],
              estimated_order_value: 15000,
              suggested_pitch: "Custom stickers for your business",
              ai_insights: "Potential customer based on industry",
            };

            if (enrichmentResponse.ok) {
              const enrichmentResult = await enrichmentResponse.json();
              if (enrichmentResult.success && enrichmentResult.enriched_data) {
                enrichedData = enrichmentResult.enriched_data;
                groqCallsTotal += enrichmentResult.api_calls || 0;
              }
            } else {
              console.warn(`Enrichment failed for ${scrapedLead.company_name}, using defaults`);
            }

            const leadWithEnrichment = { ...scrapedLead, ...enrichedData, industry };

            await sleep(500);

            const scoringResponse = await fetch(`${supabaseUrl}/functions/v1/lead-scoring`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ lead: leadWithEnrichment }),
            });

            let scoringData = {
              score: 50,
              priority: "warm",
              confidence_level: "medium",
              scoring_rationale: "Default scoring applied",
            };

            if (scoringResponse.ok) {
              const scoringResult = await scoringResponse.json();
              if (scoringResult.success && scoringResult.scoring) {
                scoringData = scoringResult.scoring;
                geminiCallsTotal += scoringResult.api_calls || 0;
              }
            } else {
              console.warn(`Scoring failed for ${scrapedLead.company_name}, using defaults`);
            }

            const finalLead = {
              user_id: userId,
              company_name: scrapedLead.company_name,
              name: scrapedLead.name,
              industry,
              phone: scrapedLead.phone,
              email: scrapedLead.email,
              website: scrapedLead.website,
              address: scrapedLead.address,
              city: scrapedLead.city || location,
              state: scrapedLead.state,
              latitude: scrapedLead.latitude,
              longitude: scrapedLead.longitude,
              google_place_id: scrapedLead.google_place_id,
              google_rating: scrapedLead.google_rating,
              google_reviews_count: scrapedLead.google_reviews_count,
              business_type: scrapedLead.business_type,
              potential_sticker_needs: enrichedData.potential_sticker_needs,
              estimated_order_value: enrichedData.estimated_order_value,
              suggested_pitch: enrichedData.suggested_pitch,
              ai_insights: enrichedData.ai_insights,
              score: scoringData.score,
              priority: scoringData.priority,
              confidence_level: scoringData.confidence_level,
              source: "google_maps",
              search_query: `${industry} in ${location}`,
              status: "new",
            };

            const insertResult = await supabase
              .from("leads")
              .insert(finalLead)
              .select()
              .single();

            if (insertResult.error) {
              console.error(`Failed to insert lead ${scrapedLead.company_name}:`, insertResult.error);
              failedLeads++;
              await write(sseEvent("progress", {
                current: i + 1,
                total: scrapedLeads.length,
                failed: true,
                company_name: scrapedLead.company_name,
              }));
            } else if (insertResult.data) {
              successfulLeads++;
              console.log(`Successfully saved lead: ${scrapedLead.company_name}`);
              await write(sseEvent("lead", {
                current: i + 1,
                total: scrapedLeads.length,
                lead: insertResult.data,
              }));
            }

          } catch (error) {
            console.error(`Error processing lead ${scrapedLead.company_name}:`, error);
            failedLeads++;
            await write(sseEvent("progress", {
              current: i + 1,
              total: scrapedLeads.length,
              failed: true,
              company_name: scrapedLead.company_name,
            }));
          }
        }

        if (sourceId) {
          await supabase
            .from("lead_sources")
            .update({
              total_leads_generated: successfulLeads,
              last_used_date: new Date().toISOString(),
            })
            .eq("id", sourceId);
        }

        if (totalDistricts > 0 || totalKeywords > 0) {
          await supabase
            .from("lead_search_state")
            .upsert({
              user_id: userId,
              city: location,
              industry,
              last_district_index: nextDistrictIndex,
              last_keyword_index: nextKeywordIndex,
              total_districts: totalDistricts,
              updated_at: new Date().toISOString(),
            }, { onConflict: "user_id,city,industry" });
        }

        const durationSeconds = (Date.now() - startTime) / 1000;
        const successRate = scrapedLeads.length > 0 ? (successfulLeads / scrapedLeads.length) * 100 : 0;

        if (logId) {
          await supabase
            .from("lead_generation_logs")
            .update({
              status: "completed",
              leads_generated: successfulLeads,
              search_query: `${industry} in ${districtUsed ? `${districtUsed}, ` : ""}${location}`,
              district_used: districtUsed,
              keyword_used: keywordUsed,
              google_maps_calls: googleMapsCallsTotal,
              groq_calls: groqCallsTotal,
              gemini_calls: geminiCallsTotal,
              duration_seconds: durationSeconds,
              success_rate: successRate,
            })
            .eq("id", logId);
        }

        await write(sseEvent("done", {
          leads_generated: successfulLeads,
          skipped_duplicates: skippedDuplicates,
          failed_leads: failedLeads,
          total_processed: scrapedLeads.length,
          duration_seconds: durationSeconds,
        }));

      } catch (streamError) {
        console.error("Stream processing error:", streamError);
        await write(sseEvent("error", { message: streamError.message }));
      } finally {
        await writer.close();
      }
    })());

    return new Response(readable, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Scheduled lead generation error:", error);

    const durationSeconds = (Date.now() - startTime) / 1000;

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to generate leads",
        message: error.message,
        duration_seconds: durationSeconds,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
