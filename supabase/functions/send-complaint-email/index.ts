import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { complaint, verdict, driverName } = await req.json();

    if (!complaint || typeof complaint !== "string") {
      return new Response(JSON.stringify({ error: "Missing complaint text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("complaint_email")
      .eq("id", 1)
      .maybeSingle();

    if (settingsError || !settings?.complaint_email) {
      console.error("Settings error:", settingsError);
      return new Response(
        JSON.stringify({ error: "No complaint_email configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formBody = new URLSearchParams();
    formBody.append("name", "F1 Complaint Box");
    formBody.append("_subject", `New complaint from ${driverName || "Driver"}`);
    formBody.append("_template", "table");
    formBody.append("Driver", driverName || "Aastha");
    formBody.append("Complaint", complaint);
    formBody.append("Verdict", verdict || "Pending");
    formBody.append("Submitted_At", new Date().toISOString());

    const emailResponse = await fetch(
      `https://formsubmit.co/ajax/${settings.complaint_email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: formBody,
      }
    );

    const responseText = await emailResponse.text();
    console.log("FormSubmit response:", { status: emailResponse.status, body: responseText });

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Email send failed", detail: responseText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, sent_to: settings.complaint_email }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-complaint-email error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});