import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

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
    console.log("Received complaint submission:", { complaint, verdict, driverName });

    if (!complaint || typeof complaint !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing complaint text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Read the recipient email from app_settings
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("complaint_email")
      .eq("id", 1)
      .maybeSingle();

    console.log("app_settings lookup:", { settings, settingsError });

    if (settingsError || !settings?.complaint_email) {
      return new Response(
        JSON.stringify({ error: "No complaint_email configured in app_settings" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const recipientEmail = settings.complaint_email;
    console.log("Sending to FormSubmit for recipient:", recipientEmail);

    // Send email via FormSubmit.co (no signup, no API key needed)
    const formData = new FormData();
    formData.append("name", "F1 Complaint Box");
    formData.append("_subject", `New complaint from ${driverName || "Driver"}`);
    formData.append("_template", "table");
    formData.append("Driver", driverName || "Aastha");
    formData.append("Complaint", complaint);
    formData.append("Verdict", verdict || "Pending");
    formData.append("Submitted_At", new Date().toISOString());

    const emailResponse = await fetch(
      `https://formsubmit.co/ajax/${recipientEmail}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const emailResponseText = await emailResponse.text();
    console.log("FormSubmit response:", {
      status: emailResponse.status,
      ok: emailResponse.ok,
      body: emailResponseText,
    });

    if (!emailResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Email send failed", detail: emailResponseText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, sent_to: recipientEmail, formsubmit_response: emailResponseText }),
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