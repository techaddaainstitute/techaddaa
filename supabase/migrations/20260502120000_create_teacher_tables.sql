-- =============================================
-- Migration: Create Teacher and Teacher Sessions Tables
-- =============================================

-- =============================================
-- 1. Teacher Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.teacher (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  joining_date DATE,
  salary NUMERIC(12, 2) DEFAULT 0,
  designation TEXT DEFAULT 'teacher',
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admin_user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.teacher ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'teacher'
      AND policyname = 'Teachers can view own record'
  ) THEN
    EXECUTE '
      CREATE POLICY "Teachers can view own record" ON public.teacher
      FOR SELECT USING (email = auth.jwt() ->> ''email'')
    ';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'teacher'
      AND policyname = 'Teachers can update own record'
  ) THEN
    EXECUTE '
      CREATE POLICY "Teachers can update own record" ON public.teacher
      FOR UPDATE USING (email = auth.jwt() ->> ''email'')
    ';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'teacher'
      AND policyname = 'Admins can manage teachers'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admins can manage teachers" ON public.teacher
      FOR ALL USING (
        EXISTS (
          SELECT 1
          FROM public.admin_user au
          WHERE au.email = auth.jwt() ->> ''email''
            AND au.is_active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.admin_user au
          WHERE au.email = auth.jwt() ->> ''email''
            AND au.is_active = true
        )
      )
    ';
  END IF;
END
$$;

-- =============================================
-- 2. Teacher Sessions Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.teacher_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teacher(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.teacher_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'teacher_sessions'
      AND policyname = 'Teachers can view own sessions'
  ) THEN
    EXECUTE '
      CREATE POLICY "Teachers can view own sessions" ON public.teacher_sessions
      FOR SELECT USING (
        teacher_id IN (
          SELECT id
          FROM public.teacher
          WHERE email = auth.jwt() ->> ''email''
            AND is_active = true
        )
      )
    ';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'teacher_sessions'
      AND policyname = 'Admins can manage teacher sessions'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admins can manage teacher sessions" ON public.teacher_sessions
      FOR ALL USING (
        EXISTS (
          SELECT 1
          FROM public.admin_user au
          WHERE au.email = auth.jwt() ->> ''email''
            AND au.is_active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.admin_user au
          WHERE au.email = auth.jwt() ->> ''email''
            AND au.is_active = true
        )
      )
    ';
  END IF;
END
$$;

-- =============================================
-- 3. Teacher Helper Functions
-- =============================================
CREATE OR REPLACE FUNCTION public.update_teacher_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_teacher_updated_at_trigger'
  ) THEN
    CREATE TRIGGER update_teacher_updated_at_trigger
      BEFORE UPDATE ON public.teacher
      FOR EACH ROW
      EXECUTE FUNCTION public.update_teacher_updated_at();
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.create_teacher(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_phone_number TEXT DEFAULT NULL,
  p_joining_date DATE DEFAULT NULL,
  p_salary NUMERIC DEFAULT 0,
  p_designation TEXT DEFAULT 'teacher',
  p_address TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_teacher_id UUID;
  v_password_hash TEXT;
BEGIN
  v_password_hash := crypt(p_password, gen_salt('bf'));

  INSERT INTO public.teacher (
    email,
    password_hash,
    full_name,
    phone_number,
    joining_date,
    salary,
    designation,
    address,
    created_by
  ) VALUES (
    p_email,
    v_password_hash,
    p_full_name,
    p_phone_number,
    p_joining_date,
    p_salary,
    p_designation,
    p_address,
    p_created_by
  )
  RETURNING id INTO v_teacher_id;

  RETURN v_teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.verify_teacher_password(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  teacher_id UUID,
  email TEXT,
  full_name TEXT,
  phone_number TEXT,
  joining_date DATE,
  salary NUMERIC,
  designation TEXT,
  address TEXT,
  is_active BOOLEAN,
  last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.email,
    t.full_name,
    t.phone_number,
    t.joining_date,
    t.salary,
    t.designation,
    t.address,
    t.is_active,
    t.last_login
  FROM public.teacher t
  WHERE t.email = p_email
    AND t.password_hash = crypt(p_password, t.password_hash)
    AND t.is_active = true
    AND (t.locked_until IS NULL OR t.locked_until < NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_teacher_last_login(p_teacher_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.teacher
  SET last_login = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL
  WHERE id = p_teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_teacher_failed_login(p_email TEXT)
RETURNS VOID AS $$
DECLARE
  v_attempts INTEGER;
BEGIN
  UPDATE public.teacher
  SET failed_login_attempts = failed_login_attempts + 1
  WHERE email = p_email
  RETURNING failed_login_attempts INTO v_attempts;

  IF v_attempts >= 5 THEN
    UPDATE public.teacher
    SET locked_until = NOW() + INTERVAL '30 minutes'
    WHERE email = p_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_teacher_email ON public.teacher(email);
CREATE INDEX IF NOT EXISTS idx_teacher_active ON public.teacher(is_active);
CREATE INDEX IF NOT EXISTS idx_teacher_joining_date ON public.teacher(joining_date);
CREATE INDEX IF NOT EXISTS idx_teacher_last_login ON public.teacher(last_login);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_token ON public.teacher_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_teacher_id ON public.teacher_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_expires ON public.teacher_sessions(expires_at);
