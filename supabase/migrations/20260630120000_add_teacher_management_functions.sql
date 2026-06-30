-- =============================================
-- Migration: Add Teacher Management Helper Functions
-- =============================================

CREATE OR REPLACE FUNCTION public.create_teacher_session(
  p_teacher_id UUID,
  p_session_token TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO public.teacher_sessions (
    teacher_id,
    session_token,
    expires_at,
    user_agent
  ) VALUES (
    p_teacher_id,
    p_session_token,
    p_expires_at,
    p_user_agent
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.validate_teacher_session(
  p_session_token TEXT
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
  last_login TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
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
    t.last_login,
    ts.expires_at
  FROM public.teacher_sessions ts
  INNER JOIN public.teacher t ON t.id = ts.teacher_id
  WHERE ts.session_token = p_session_token
    AND ts.expires_at > NOW()
    AND t.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.delete_teacher_session(
  p_session_token TEXT
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.teacher_sessions
  WHERE session_token = p_session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_all_teachers()
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  phone_number TEXT,
  joining_date DATE,
  salary NUMERIC,
  designation TEXT,
  address TEXT,
  is_active BOOLEAN,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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
    t.last_login,
    t.created_at,
    t.updated_at
  FROM public.teacher t
  ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_teacher_profile(
  p_teacher_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_phone_number TEXT DEFAULT NULL,
  p_joining_date DATE DEFAULT NULL,
  p_salary NUMERIC DEFAULT 0,
  p_designation TEXT DEFAULT 'teacher',
  p_address TEXT DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT true,
  p_password TEXT DEFAULT NULL
)
RETURNS UUID AS $$
BEGIN
  UPDATE public.teacher
  SET
    email = p_email,
    full_name = p_full_name,
    phone_number = p_phone_number,
    joining_date = p_joining_date,
    salary = COALESCE(p_salary, 0),
    designation = COALESCE(NULLIF(p_designation, ''), 'teacher'),
    address = p_address,
    is_active = COALESCE(p_is_active, true),
    password_hash = CASE
      WHEN p_password IS NOT NULL AND NULLIF(p_password, '') IS NOT NULL
        THEN crypt(p_password, gen_salt('bf'))
      ELSE password_hash
    END,
    password_changed_at = CASE
      WHEN p_password IS NOT NULL AND NULLIF(p_password, '') IS NOT NULL
        THEN NOW()
      ELSE password_changed_at
    END
  WHERE id = p_teacher_id;

  RETURN p_teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.delete_teacher_record(
  p_teacher_id UUID
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.teacher
  WHERE id = p_teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
