-- =============================================
-- TechAddaa Institute - Supabase Database Schema
-- =============================================

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- =============================================
-- 1. User Profiles Table
-- =============================================
-- This extends the default auth.users table with additional profile information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. Courses Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.user_profiles(id),
  price DECIMAL(10,2) DEFAULT 0,
  duration TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active courses
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

-- Policy: Only instructors and admins can manage courses
CREATE POLICY "Instructors can manage own courses" ON public.courses
  FOR ALL USING (
    auth.uid() = instructor_id OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

-- =============================================
-- 3. Course Enrollments Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_mode TEXT DEFAULT 'online' CHECK (enrollment_mode IN ('online', 'offline')),
  price_paid DECIMAL(10,2),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_lessons INTEGER DEFAULT 0,
  grade TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on course_enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can enroll themselves
CREATE POLICY "Users can enroll themselves" ON public.course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own enrollment progress
CREATE POLICY "Users can update own enrollment" ON public.course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 4. Certificates Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade TEXT,
  instructor_name TEXT,
  course_name TEXT NOT NULL,
  course_duration TEXT,
  completion_date TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  is_valid BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only system can create certificates (through functions)
CREATE POLICY "System can create certificates" ON public.certificates
  FOR INSERT WITH CHECK (true);

-- =============================================
-- 5. Certificate Downloads Log Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.certificate_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  download_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on certificate_downloads
ALTER TABLE public.certificate_downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own download history
CREATE POLICY "Users can view own downloads" ON public.certificate_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 6. Functions and Triggers
-- =============================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS handle_updated_at ON public.user_profiles;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.courses;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.course_enrollments;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create certificate when course is completed
CREATE OR REPLACE FUNCTION public.create_certificate(
  p_user_id UUID,
  p_course_id UUID,
  p_enrollment_id UUID,
  p_grade TEXT DEFAULT 'A'
)
RETURNS UUID AS $$
DECLARE
  v_certificate_id UUID;
  v_course_record RECORD;
  v_user_record RECORD;
  v_instructor_name TEXT;
BEGIN
  -- Get course details
  SELECT * INTO v_course_record FROM public.courses WHERE id = p_course_id;
  
  -- Get user details
  SELECT * INTO v_user_record FROM public.user_profiles WHERE id = p_user_id;
  
  -- Get instructor name
  SELECT full_name INTO v_instructor_name 
  FROM public.user_profiles 
  WHERE id = v_course_record.instructor_id;
  
  -- Create certificate
  INSERT INTO public.certificates (
    user_id,
    course_id,
    enrollment_id,
    certificate_number,
    grade,
    instructor_name,
    course_name,
    course_duration,
    completion_date
  ) VALUES (
    p_user_id,
    p_course_id,
    p_enrollment_id,
    public.generate_certificate_number(),
    p_grade,
    COALESCE(v_instructor_name, 'TechAddaa Institute'),
    v_course_record.title,
    v_course_record.duration,
    NOW()
  ) RETURNING id INTO v_certificate_id;
  
  RETURN v_certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. Sample Data (Optional)
-- =============================================

-- Insert sample courses (you can modify or remove this)
INSERT INTO public.courses (title, description, price, duration, level, category, image_url) VALUES
('React.js Fundamentals', 'Learn the basics of React.js development', 99.99, '8 weeks', 'beginner', 'Web Development', '/images/react-course.jpg'),
('Advanced JavaScript', 'Master advanced JavaScript concepts', 149.99, '12 weeks', 'advanced', 'Programming', '/images/js-course.jpg'),
('Python for Data Science', 'Learn Python programming for data analysis', 199.99, '16 weeks', 'intermediate', 'Data Science', '/images/python-course.jpg'),
('UI/UX Design Principles', 'Master the fundamentals of user interface design', 129.99, '10 weeks', 'beginner', 'Design', '/images/design-course.jpg')
ON CONFLICT DO NOTHING;

-- =============================================
-- 8. Indexes for Performance
-- =============================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.course_enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON public.certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificate_downloads_user ON public.certificate_downloads(user_id);

-- =============================================
-- Instructions for Setup:
-- =============================================
-- 1. Go to your Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Run the script to create all tables, policies, and functions
-- 5. The database will be ready for your React application
-- =============================================