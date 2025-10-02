-- Migration: Fix fees table foreign key constraints
-- This script drops the existing fees table and recreates it with correct references

-- Drop existing fees table if it exists (this will remove all data)
DROP TABLE IF EXISTS public.fees CASCADE;

-- Recreate fees table with correct foreign key constraints
CREATE TABLE public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
    
    -- Payment details
    total_amount DECIMAL(10,2) NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    installment_number INTEGER NOT NULL DEFAULT 1,
    total_installments INTEGER NOT NULL DEFAULT 1,
    
    -- Payment status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_type VARCHAR(20) NOT NULL DEFAULT 'full' CHECK (payment_type IN ('full', 'emi')),
    
    -- Due dates
    due_date DATE NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    
    -- Course information (denormalized for easier queries)
    course_name VARCHAR(255) NOT NULL,
    course_mode VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (course_mode IN ('online', 'offline')),
    
    -- Payment tracking
    payment_method VARCHAR(50), -- 'card', 'upi', 'bank_transfer', etc.
    transaction_id VARCHAR(100),
    payment_gateway_response JSONB,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_course_installment UNIQUE (user_id, course_id, installment_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fees_user_id ON public.fees(user_id);
CREATE INDEX IF NOT EXISTS idx_fees_course_id ON public.fees(course_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON public.fees(status);
CREATE INDEX IF NOT EXISTS idx_fees_due_date ON public.fees(due_date);
CREATE INDEX IF NOT EXISTS idx_fees_payment_type ON public.fees(payment_type);
CREATE INDEX IF NOT EXISTS idx_fees_enrollment_id ON public.fees(enrollment_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_fees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_fees_updated_at
    BEFORE UPDATE ON public.fees
    FOR EACH ROW
    EXECUTE FUNCTION update_fees_updated_at();

-- Enable Row Level Security
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own fees" ON public.fees;
DROP POLICY IF EXISTS "Users can insert own fees" ON public.fees;
DROP POLICY IF EXISTS "Users can update own fees" ON public.fees;

-- Create RLS policies
CREATE POLICY "Users can view own fees" ON public.fees
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fees" ON public.fees
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fees" ON public.fees
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.fees TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.fees IS 'Stores fee records for course enrollments with support for full payment and EMI options';
COMMENT ON COLUMN public.fees.total_amount IS 'Total course fee amount';
COMMENT ON COLUMN public.fees.installment_amount IS 'Amount for this specific installment';
COMMENT ON COLUMN public.fees.installment_number IS 'Current installment number (1 for full payment)';
COMMENT ON COLUMN public.fees.total_installments IS 'Total number of installments (1 for full payment)';
COMMENT ON COLUMN public.fees.status IS 'Payment status: pending, paid, overdue, cancelled';
COMMENT ON COLUMN public.fees.payment_type IS 'Payment type: full or emi';

-- Verify the table was created successfully
SELECT 'Fees table created successfully!' as status;

-- Query to verify table structure (alternative to \d command)
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'fees'
ORDER BY ordinal_position;