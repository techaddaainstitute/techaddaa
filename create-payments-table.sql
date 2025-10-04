-- =============================================
-- Create Payments Table Migration
-- =============================================
-- This table is required by PaymentDatasource.js for payment processing

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Payment status and type
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50), -- 'instamojo', 'razorpay', 'card', 'upi', 'bank_transfer', etc.
  payment_type VARCHAR(20) NOT NULL DEFAULT 'course_fee' CHECK (payment_type IN ('course_fee', 'installment', 'late_fee', 'refund')),
  
  -- Gateway specific fields
  gateway_payment_id VARCHAR(255), -- Payment ID from payment gateway
  gateway_order_id VARCHAR(255),   -- Order ID from payment gateway
  gateway_transaction_id VARCHAR(255), -- Transaction ID from payment gateway
  gateway_response JSONB,          -- Full response from payment gateway
  
  -- Instamojo specific fields
  instamojo_payment_id VARCHAR(255),
  instamojo_payment_request_id VARCHAR(255),
  instamojo_longurl TEXT,
  instamojo_shorturl TEXT,
  
  -- Payment metadata
  description TEXT,
  buyer_name VARCHAR(255),
  buyer_email VARCHAR(255),
  buyer_phone VARCHAR(20),
  
  -- Timestamps
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional tracking
  ip_address INET,
  user_agent TEXT,
  
  -- Constraints
  CONSTRAINT unique_gateway_payment_id UNIQUE (gateway_payment_id),
  CONSTRAINT unique_instamojo_payment_id UNIQUE (instamojo_payment_id)
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON public.payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER handle_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON public.payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON public.payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_instamojo_payment_id ON public.payments(instamojo_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments(payment_date);

-- =============================================
-- Instructions:
-- =============================================
-- 1. Copy this SQL script
-- 2. Go to your Supabase dashboard
-- 3. Navigate to SQL Editor
-- 4. Paste and run this script
-- 5. The payments table will be created with proper RLS policies
-- =============================================