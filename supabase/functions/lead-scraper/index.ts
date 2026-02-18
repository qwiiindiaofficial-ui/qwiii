import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScrapedLead {
  name: string;
  company_name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  business_type?: string;
  industry?: string;
  google_place_id?: string;
  latitude?: number;
  longitude?: number;
  google_rating?: number;
  google_reviews_count?: number;
  formatted_address?: string;
}

const indianCities: Record<string, { lat: number; lng: number; state: string; radius: number }> = {
  Mumbai: { lat: 19.0760, lng: 72.8777, state: "Maharashtra", radius: 30000 },
  Delhi: { lat: 28.7041, lng: 77.1025, state: "Delhi", radius: 35000 },
  Bangalore: { lat: 12.9716, lng: 77.5946, state: "Karnataka", radius: 30000 },
  Pune: { lat: 18.5204, lng: 73.8567, state: "Maharashtra", radius: 25000 },
  Hyderabad: { lat: 17.3850, lng: 78.4867, state: "Telangana", radius: 30000 },
  Chennai: { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu", radius: 30000 },
  Kolkata: { lat: 22.5726, lng: 88.3639, state: "West Bengal", radius: 30000 },
  Jaipur: { lat: 26.9124, lng: 75.7873, state: "Rajasthan", radius: 20000 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, state: "Gujarat", radius: 25000 },
  Lucknow: { lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh", radius: 20000 },
  Surat: { lat: 21.1702, lng: 72.8311, state: "Gujarat", radius: 20000 },
  Nagpur: { lat: 21.1458, lng: 79.0882, state: "Maharashtra", radius: 20000 },
  Indore: { lat: 22.7196, lng: 75.8577, state: "Madhya Pradesh", radius: 20000 },
  Bhopal: { lat: 23.2599, lng: 77.4126, state: "Madhya Pradesh", radius: 20000 },
  Chandigarh: { lat: 30.7333, lng: 76.7794, state: "Chandigarh", radius: 15000 },
  Gurgaon: { lat: 28.4595, lng: 77.0266, state: "Haryana", radius: 20000 },
  Noida: { lat: 28.5355, lng: 77.3910, state: "Uttar Pradesh", radius: 20000 },
  Ghaziabad: { lat: 28.6692, lng: 77.4538, state: "Uttar Pradesh", radius: 15000 },
  Faridabad: { lat: 28.4089, lng: 77.3178, state: "Haryana", radius: 15000 },
  Vishakhapatnam: { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", radius: 20000 },
};

const industrySearchKeywords: Record<string, string[]> = {
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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  throw new Error("Max retries exceeded");
}

async function getPlaceDetails(placeId: string, apiKey: string): Promise<any> {
  const fields = [
    "place_id",
    "name",
    "formatted_address",
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "rating",
    "user_ratings_total",
    "geometry",
    "types",
    "business_status",
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

  return retryWithBackoff(async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Place Details API error: ${response.status}`);
    const data = await response.json();
    if (data.status !== "OK") throw new Error(`Place Details API status: ${data.status}`);
    return data.result;
  });
}

async function fetchAllPagesFromTextSearch(
  query: string,
  cityData: { lat: number; lng: number; radius: number },
  apiKey: string,
  maxResults: number,
  seenPlaceIds: Set<string>
): Promise<any[]> {
  const allResults: any[] = [];
  let pageToken: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 3;

  do {
    const urlParts = [
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      `?query=${encodeURIComponent(query)}`,
      `&location=${cityData.lat},${cityData.lng}`,
      `&radius=${cityData.radius}`,
      `&key=${apiKey}`,
    ];

    if (pageToken) {
      urlParts.push(`&pagetoken=${pageToken}`);
      await sleep(2000);
    }

    const searchUrl = urlParts.join("");

    const data = await retryWithBackoff(async () => {
      const response = await fetch(searchUrl);
      if (!response.ok) throw new Error(`Text Search API error: ${response.status}`);
      const json = await response.json();
      if (json.status === "ZERO_RESULTS") return { results: [] };
      if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
        throw new Error(`Text Search API status: ${json.status} - ${json.error_message || ""}`);
      }
      return json;
    });

    if (data.results) {
      for (const place of data.results) {
        if (!seenPlaceIds.has(place.place_id) && place.business_status === "OPERATIONAL") {
          seenPlaceIds.add(place.place_id);
          allResults.push(place);
          if (allResults.length >= maxResults) break;
        }
      }
    }

    pageToken = data.next_page_token;
    pageCount++;

    if (allResults.length >= maxResults) break;

  } while (pageToken && pageCount < maxPages);

  return allResults;
}

async function searchPlacesForIndustry(
  industry: string,
  location: string,
  apiKey: string,
  limit: number,
  district?: string,
  districtLat?: number,
  districtLng?: number,
  districtRadius?: number,
  keywordIndex?: number
): Promise<{ leads: ScrapedLead[]; keywordUsed: string }> {
  const cityData = indianCities[location] || indianCities.Mumbai;
  const keywords = industrySearchKeywords[industry.toLowerCase()] || industrySearchKeywords.default;

  const effectiveCityData = (districtLat !== undefined && districtLng !== undefined)
    ? { lat: districtLat, lng: districtLng, radius: districtRadius ?? 5000, state: cityData.state }
    : cityData;

  const startKeywordIdx = (keywordIndex !== undefined && keywordIndex >= 0 && keywordIndex < keywords.length)
    ? keywordIndex
    : 0;

  const orderedKeywords = [
    ...keywords.slice(startKeywordIdx),
    ...keywords.slice(0, startKeywordIdx),
  ];

  const keywordUsed = orderedKeywords[0];

  const leads: ScrapedLead[] = [];
  const seenPlaceIds = new Set<string>();
  const candidatePlaces: any[] = [];

  const locationLabel = district ? `${district}, ${location}` : location;

  for (const keyword of orderedKeywords) {
    if (candidatePlaces.length >= limit * 4) break;

    const query = `${keyword} in ${locationLabel}`;
    console.log(`Searching: "${query}"`);

    try {
      const places = await fetchAllPagesFromTextSearch(
        query,
        effectiveCityData,
        apiKey,
        limit * 4 - candidatePlaces.length,
        seenPlaceIds
      );

      candidatePlaces.push(...places);
      console.log(`Keyword "${keyword}": found ${places.length} places (total candidates: ${candidatePlaces.length})`);

      await sleep(300);
    } catch (err) {
      console.error(`Text search failed for "${keyword}":`, err.message);
      continue;
    }
  }

  console.log(`Total candidates: ${candidatePlaces.length}, fetching details for up to ${limit} with phone...`);

  for (const place of candidatePlaces) {
    if (leads.length >= limit) break;

    try {
      await sleep(150);

      const details = await getPlaceDetails(place.place_id, apiKey);
      const phone = details.formatted_phone_number || details.international_phone_number;

      if (!phone) {
        console.log(`Skipping ${place.name} - no phone number`);
        continue;
      }

      const lead: ScrapedLead = {
        name: details.name || place.name,
        company_name: details.name || place.name,
        phone,
        website: details.website,
        address: details.formatted_address,
        formatted_address: details.formatted_address,
        city: location,
        state: cityData.state,
        business_type: place.types?.[0] || industry,
        industry,
        google_place_id: place.place_id,
        latitude: details.geometry?.location?.lat || place.geometry?.location?.lat,
        longitude: details.geometry?.location?.lng || place.geometry?.location?.lng,
        google_rating: details.rating,
        google_reviews_count: details.user_ratings_total || 0,
      };

      leads.push(lead);
      console.log(`Added: ${lead.company_name} (${lead.phone})`);

    } catch (detailError) {
      console.error(`Error getting details for ${place.name}:`, detailError.message);
      continue;
    }
  }

  return { leads, keywordUsed };
}

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

    const googleMapsApiKey = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "google_maps_api_key")
      .maybeSingle();

    if (!googleMapsApiKey?.data?.value) {
      return new Response(
        JSON.stringify({
          error: "Google Maps API key not configured",
          message: "Please add google_maps_api_key in app_settings table",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = googleMapsApiKey.data.value;

    const { industry, location, limit = 20, district, district_lat, district_lng, district_radius, keyword_index } = await req.json();

    if (!industry) {
      return new Response(
        JSON.stringify({
          error: "Industry is required",
          message: "Please provide an industry type",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const targetCity = location || "Mumbai";
    const targetLimit = Math.min(Number(limit), 60);

    console.log(`Searching ${targetLimit} leads for ${industry} in ${district ? `${district}, ` : ""}${targetCity} (keyword_index=${keyword_index ?? 0})...`);

    const { leads, keywordUsed } = await searchPlacesForIndustry(
      industry,
      targetCity,
      apiKey,
      targetLimit,
      district,
      district_lat,
      district_lng,
      district_radius,
      keyword_index
    );

    if (leads.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          leads: [],
          count: 0,
          industry,
          location: targetCity,
          district: district ?? null,
          keyword_used: keywordUsed,
          message: "No businesses with phone numbers found. Try a different city or industry.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        leads,
        count: leads.length,
        api_calls: leads.length * 2,
        industry,
        location: targetCity,
        district: district ?? null,
        keyword_used: keywordUsed,
        source: "Google Places API",
        message: `Found ${leads.length} verified businesses with real phone numbers from Google Maps.`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Lead scraper error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to scrape leads",
        message: error.message,
        details: "There was an error accessing Google Places API. Please check your API key and try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
