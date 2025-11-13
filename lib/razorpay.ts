import Razorpay from 'razorpay';

// Initialize Razorpay instance for server-side operations
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const RAZORPAY_PLANS = {
  SPRINT_MONTHLY: {
    id: 'sprint_monthly',
    name: 'Job Sprint Monthly',
    amount: 2900, // ₹29 in paise (Razorpay uses paise)
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    features: [
      'Unlimited resume analysis',
      'Interview Gym - unlimited practice',
      'Job Description Decoder',
      'Application Tracker',
      'AI feedback on all answers',
      'Audio response analysis',
      'Progress dashboard',
    ],
  },
  SPRINT_QUARTERLY: {
    id: 'sprint_quarterly',
    name: 'Job Sprint Quarterly',
    amount: 7900, // ₹79 in paise (Save ₹8)
    currency: 'INR',
    period: 'monthly',
    interval: 3,
    features: [
      'All Monthly features',
      'Save ₹8 per month',
      'Priority support',
    ],
  },
  PRO_MONTHLY: {
    id: 'pro_monthly',
    name: 'Job Sprint Pro',
    amount: 4900, // ₹49 in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    features: [
      'All Sprint features',
      'Mock interview sessions',
      'Salary negotiation simulator',
      'Career coaching calls',
      'Premium support',
    ],
    badge: 'Coming Soon',
  },
};

// Pricing for US market (if needed)
export const RAZORPAY_PLANS_USD = {
  SPRINT_MONTHLY: {
    id: 'sprint_monthly_usd',
    name: 'Job Sprint Monthly',
    amount: 2900, // $29 in cents
    currency: 'USD',
    period: 'monthly',
    interval: 1,
  },
};

export interface CreateSubscriptionParams {
  planId: string;
  customerId?: string;
  totalCount?: number;
  customerNotify?: boolean;
  notes?: Record<string, string>;
}

export async function createSubscription(params: CreateSubscriptionParams) {
  const plan = RAZORPAY_PLANS[params.planId as keyof typeof RAZORPAY_PLANS];

  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  // Create subscription
  const subscription = await razorpay.subscriptions.create({
    plan_id: params.planId,
    total_count: params.totalCount || 12, // 12 months default
    quantity: 1,
    customer_notify: params.customerNotify ?? 1,
    notes: params.notes,
  });

  return subscription;
}

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createOrder(params: CreateOrderParams) {
  const order = await razorpay.orders.create({
    amount: params.amount,
    currency: params.currency || 'INR',
    receipt: params.receipt || `receipt_${Date.now()}`,
    notes: params.notes,
  });

  return order;
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const crypto = require('crypto');

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const crypto = require('crypto');

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

// Helper to get subscription status
export async function getSubscription(subscriptionId: string) {
  return await razorpay.subscriptions.fetch(subscriptionId);
}

// Helper to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return await razorpay.subscriptions.cancel(subscriptionId);
}

// Helper to get payment details
export async function getPayment(paymentId: string) {
  return await razorpay.payments.fetch(paymentId);
}
