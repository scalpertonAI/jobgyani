import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { orderId, paymentId, signature, plan } = body;

    if (!orderId || !paymentId || !signature || !plan) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order status
    await supabase
      .from('payment_orders')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        status: 'completed',
        paid_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', orderId);

    // Update user subscription
    const subscriptionTier = plan.includes('pro') ? 'pro' : 'sprint';

    await supabase
      .from('profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_status: 'active',
        razorpay_payment_id: paymentId,
      })
      .eq('id', user.id);

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
