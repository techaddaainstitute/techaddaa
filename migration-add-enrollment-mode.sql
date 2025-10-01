-- =============================================
-- Migration: Add enrollment_mode and related columns to course_enrollments
-- =============================================

-- Add enrollment_mode column
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS enrollment_mode TEXT DEFAULT 'online' 
CHECK (enrollment_mode IN ('online', 'offline'));

-- Add price_paid column
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS price_paid DECIMAL(10,2);

-- Add progress_percentage column (separate from progress for clarity)
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Add completed_lessons column
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS completed_lessons INTEGER DEFAULT 0;

-- Add updated_at column
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updated_at trigger for course_enrollments
DROP TRIGGER IF EXISTS handle_updated_at ON public.course_enrollments;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update existing records to have default values
UPDATE public.course_enrollments 
SET 
  enrollment_mode = 'online',
  progress_percentage = COALESCE(progress, 0),
  completed_lessons = 0,
  updated_at = NOW()
WHERE enrollment_mode IS NULL;