import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ClientEmailRequest {
  clientId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    if (!resend) {
      throw new Error("Resend API key not configured");
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { clientId }: ClientEmailRequest = await req.json();

    // Fetch client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new Error('Client not found');
    }

    console.log('Sending welcome email to client:', client.name);

    const emailResponse = await resend.emails.send({
      from: "Accounting Services <noreply@resend.dev>",
      to: [client.email],
      cc: [client.contact_person !== client.email ? client.contact_person : ''].filter(Boolean),
      subject: `Welcome to Our Accounting Services - ${client.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Welcome to Our Accounting Services
          </h1>
          
          <p>Dear ${client.contact_person},</p>
          
          <p>Thank you for choosing our accounting services for <strong>${client.name}</strong>. We're excited to work with you and help manage your business finances.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Client Information</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Company:</strong> ${client.name}</li>
              <li style="margin: 8px 0;"><strong>Contact:</strong> ${client.contact_person}</li>
              <li style="margin: 8px 0;"><strong>Email:</strong> ${client.email}</li>
              ${client.phone ? `<li style="margin: 8px 0;"><strong>Phone:</strong> ${client.phone}</li>` : ''}
              ${client.business_type ? `<li style="margin: 8px 0;"><strong>Business Type:</strong> ${client.business_type}</li>` : ''}
            </ul>
          </div>
          
          <h3 style="color: #333;">Next Steps</h3>
          <ol>
            <li>Our team will reach out within 24 hours to schedule an onboarding call</li>
            <li>We'll discuss your specific accounting needs and requirements</li>
            <li>You'll receive access to our client portal for document sharing</li>
            <li>We'll begin setting up your accounting systems and processes</li>
          </ol>
          
          <p>If you have any immediate questions, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              The Accounting Services Team<br>
              <a href="mailto:support@example.com" style="color: #0066cc;">support@example.com</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Client welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-client-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);