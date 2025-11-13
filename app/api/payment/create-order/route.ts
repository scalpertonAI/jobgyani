import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { razorpay } from '@/lib/razorpay';

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
    const { plan, amount } = body;

    if (!plan || !amount) {
      return NextResponse.json(
        { error: 'Plan and amount are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan: plan,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Save order to database
    await supabase.from('payment_orders').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: amount,
      currency: 'INR',
      plan: plan,
      status: 'created',
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
