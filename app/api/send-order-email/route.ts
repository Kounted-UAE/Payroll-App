import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  orderId: string;
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

    const { orderId }: OrderEmailRequest = await req.json();

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('order_intakes')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    console.log('Sending order summary email for order:', order.reference_id || order.id);

    // Extract lead capture data for email recipient
    const leadData = order.order_data?.step8 || {};
    const recipientEmail = leadData.email || 'noreply@example.com';
    const recipientName = leadData.name || 'Valued Customer';

    // Generate order summary
    const generateOrderSummary = (orderData: any) => {
      let summary = '<h3>Order Summary</h3><ul>';
      
      // Client Profile
      if (orderData.step1) {
        summary += `<li><strong>Client:</strong> ${orderData.step1.selectedClient?.name || orderData.step1.newClient?.name || 'New Client'}</li>`;
        summary += `<li><strong>Entity Type:</strong> ${orderData.step1.entityType || 'Not specified'}</li>`;
        summary += `<li><strong>Jurisdiction:</strong> ${orderData.step1.jurisdiction || 'Not specified'}</li>`;
      }
      
      // Accounting
      if (orderData.step2) {
        summary += `<li><strong>Monthly Transactions:</strong> ${orderData.step2.transactionVolume || 'Not specified'}</li>`;
        summary += `<li><strong>VAT Registered:</strong> ${orderData.step2.vatRegistered ? 'Yes' : 'No'}</li>`;
      }
      
      // Payroll
      if (orderData.step3?.employeeCount > 0) {
        summary += `<li><strong>Employees:</strong> ${orderData.step3.employeeCount}</li>`;
        summary += `<li><strong>WPS Integration:</strong> ${orderData.step3.wpsIntegration ? 'Yes' : 'No'}</li>`;
      }
      
      // Service Tier
      if (orderData.step6) {
        summary += `<li><strong>Service Tier:</strong> ${orderData.step6.selectedTier || 'Not selected'}</li>`;
      }
      
      summary += '</ul>';
      return summary;
    };

    const emailResponse = await resend.emails.send({
      from: "Order Management <orders@resend.dev>",
      to: [recipientEmail],
      subject: `Order Summary - ${order.reference_id || `#${order.id.slice(0, 8)}`}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Order Summary
          </h1>
          
          <p>Dear ${recipientName},</p>
          
          <p>Thank you for your service order. Below is a summary of your configuration:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Reference ID:</strong> ${order.reference_id || order.id}</li>
              <li style="margin: 8px 0;"><strong>Status:</strong> ${order.status}</li>
              <li style="margin: 8px 0;"><strong>Created:</strong> ${new Date(order.created_at).toLocaleDateString()}</li>
              ${order.estimated_monthly_cost ? `<li style="margin: 8px 0;"><strong>Estimated Monthly Cost:</strong> AED ${order.estimated_monthly_cost}</li>` : ''}
              ${order.estimated_annual_cost ? `<li style="margin: 8px 0;"><strong>Estimated Annual Cost:</strong> AED ${order.estimated_annual_cost}</li>` : ''}
            </ul>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${generateOrderSummary(order.order_data)}
          </div>
          
          <h3 style="color: #333;">Next Steps</h3>
          <ol>
            <li>Our team will review your order within 24 hours</li>
            <li>We'll contact you to schedule a consultation call</li>
            <li>We'll provide a detailed proposal and contract</li>
            <li>Upon approval, we'll begin onboarding your services</li>
          </ol>
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              The Order Management Team<br>
              <a href="mailto:orders@example.com" style="color: #0066cc;">orders@example.com</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Order summary email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
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