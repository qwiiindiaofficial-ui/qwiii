import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { secret_key } = await req.json();
    
    // Simple security check - require a secret key
    if (secret_key !== "QWII_SEED_2024") {
      return new Response(JSON.stringify({ error: "Invalid secret key" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === "admin@qwii.test");
    
    if (adminExists) {
      return new Response(JSON.stringify({ message: "Admin user already exists" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@qwii.test",
      password: "Admin@123",
      email_confirm: true,
      user_metadata: {
        full_name: "Test Admin",
      },
    });

    if (createError) {
      console.error("Create user error:", createError);
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Created admin user:", newUser.user.id);

    // Create admin role with master access
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role: "admin",
        is_master: true,
        allowed_pages: [
          "/", "/admin", "/system-status", "/alerts", 
          "/sales-forecast", "/demand-prediction", "/recommendations", 
          "/chatbot", "/design-generator", "/b2b-agent",
          "/clients", "/client-orders", "/invoices", "/quotations", 
          "/agreements", "/digital-signatures",
          "/production", "/inventory", "/supply-chain", "/quality",
          "/analytics", "/performance", "/reports", "/realtime",
          "/buyers", "/markets", "/notifications", "/settings"
        ],
      });

    if (roleError) {
      console.error("Role insert error:", roleError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin user created successfully",
        credentials: {
          email: "admin@qwii.test",
          password: "Admin@123"
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
