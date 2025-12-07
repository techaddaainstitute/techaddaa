--
-- PostgreSQL database dump
--

\restrict CotfyMSI1QLZ0GhwxzgBf30lPddBs0N7hph2sg0a8xIqJaHnLhuRuPOGD12hGZw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: create_admin_user(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text DEFAULT NULL::text, p_role text DEFAULT 'admin'::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_admin_id UUID;
  v_password_hash TEXT;
BEGIN
  -- Hash the password using crypt
  v_password_hash := crypt(p_password, gen_salt('bf'));
  
  -- Insert the admin user
  INSERT INTO public.admin_user (
    email, password_hash, full_name, phone_number, role
  ) VALUES (
    p_email, v_password_hash, p_full_name, p_phone_number, p_role
  ) RETURNING id INTO v_admin_id;
  
  RETURN v_admin_id;
END;
$$;


ALTER FUNCTION public.create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text, p_role text) OWNER TO postgres;

--
-- Name: create_certificate(uuid, uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text DEFAULT 'A'::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION public.create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text) OWNER TO postgres;

--
-- Name: generate_certificate_number(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_certificate_number() RETURNS text
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$;


ALTER FUNCTION public.generate_certificate_number() OWNER TO postgres;

--
-- Name: handle_admin_failed_login(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_admin_failed_login(p_email text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempts INTEGER;
BEGIN
  -- Update failed login attempts
  UPDATE public.admin_user 
  SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
      updated_at = NOW()
  WHERE email = p_email
  RETURNING failed_login_attempts INTO v_attempts;
  
  -- Lock account after 5 failed attempts for 15 minutes
  IF v_attempts >= 5 THEN
    UPDATE public.admin_user 
    SET locked_until = NOW() + INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE email = p_email;
  END IF;
END;
$$;


ALTER FUNCTION public.handle_admin_failed_login(p_email text) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_updated_at() OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- Name: update_admin_last_login(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_admin_last_login(p_admin_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.admin_user 
  SET last_login = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL,
      updated_at = NOW()
  WHERE id = p_admin_id;
END;
$$;


ALTER FUNCTION public.update_admin_last_login(p_admin_id uuid) OWNER TO postgres;

--
-- Name: update_admin_user_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_admin_user_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_admin_user_updated_at() OWNER TO postgres;

--
-- Name: verify_admin_password(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verify_admin_password(p_email text, p_password text) RETURNS TABLE(admin_id uuid, email text, full_name text, role text, is_active boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_expected_hash TEXT;
BEGIN
  -- Generate the same hash for comparison (matching our admin creation)
  v_expected_hash := md5(p_password || p_email || 'techaddaa_salt');
  
  -- Return user info if password matches
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.role,
    au.is_active
  FROM public.admin_user au
  WHERE au.email = p_email 
    AND au.password_hash = v_expected_hash
    AND au.is_active = true;
END;
$$;


ALTER FUNCTION public.verify_admin_password(p_email text, p_password text) OWNER TO postgres;

--
-- Name: verify_admin_password_techaddaa(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verify_admin_password_techaddaa(p_email text, p_password text) RETURNS TABLE(admin_id uuid, email text, full_name text, role text, is_active boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_expected_hash TEXT;
BEGIN
  -- Generate the same hash for comparison
  v_expected_hash := md5(p_password || p_email || 'techaddaa_salt');
  
  -- Return user info if password matches
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.role,
    au.is_active
  FROM public.admin_user au
  WHERE au.email = p_email 
    AND au.password_hash = v_expected_hash
    AND au.is_active = true;
END;
$$;


ALTER FUNCTION public.verify_admin_password_techaddaa(p_email text, p_password text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id bigint NOT NULL,
    description character varying(255) NOT NULL,
    credit boolean DEFAULT false NOT NULL,
    txn_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    amount bigint DEFAULT '0'::bigint
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_id_seq OWNER TO postgres;

--
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- Name: admin_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_user_id uuid,
    session_token text NOT NULL,
    ip_address inet,
    user_agent text,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_activity timestamp with time zone DEFAULT now()
);


ALTER TABLE public.admin_sessions OWNER TO postgres;

--
-- Name: admin_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    phone_number text,
    role text DEFAULT 'admin'::text,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    password_changed_at timestamp with time zone DEFAULT now(),
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT admin_user_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'super_admin'::text])))
);


ALTER TABLE public.admin_user OWNER TO postgres;

--
-- Name: certificate_downloads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificate_downloads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    certificate_id uuid,
    phone_number text NOT NULL,
    date_of_birth date NOT NULL,
    download_date timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text
);


ALTER TABLE public.certificate_downloads OWNER TO postgres;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    course_id uuid,
    enrollment_id uuid,
    certificate_number text NOT NULL,
    issue_date timestamp with time zone DEFAULT now(),
    grade text,
    instructor_name text,
    course_name text NOT NULL,
    course_duration text,
    completion_date timestamp with time zone,
    certificate_url text,
    is_valid boolean DEFAULT true
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    course_id uuid,
    enrollment_mode text DEFAULT 'online'::text,
    price_paid numeric(10,2),
    enrollment_date timestamp with time zone DEFAULT now(),
    completion_date timestamp with time zone,
    progress numeric(5,2) DEFAULT 0,
    progress_percentage numeric(5,2) DEFAULT 0,
    completed_lessons integer DEFAULT 0,
    grade text,
    status text DEFAULT 'active'::text,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT course_enrollments_enrollment_mode_check CHECK ((enrollment_mode = ANY (ARRAY['online'::text, 'offline'::text]))),
    CONSTRAINT course_enrollments_progress_check CHECK (((progress >= (0)::numeric) AND (progress <= (100)::numeric))),
    CONSTRAINT course_enrollments_progress_percentage_check CHECK (((progress_percentage >= (0)::numeric) AND (progress_percentage <= (100)::numeric))),
    CONSTRAINT course_enrollments_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'dropped'::text])))
);


ALTER TABLE public.course_enrollments OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    instructor_id uuid,
    price numeric(10,2) DEFAULT 0,
    duration text,
    level text,
    category text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT courses_level_check CHECK ((level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_id uuid,
    total_amount numeric(10,2) NOT NULL,
    installment_amount numeric(10,2) NOT NULL,
    installment_number integer DEFAULT 1 NOT NULL,
    total_installments integer DEFAULT 1 NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    payment_type character varying(20) DEFAULT 'full'::character varying NOT NULL,
    due_date date NOT NULL,
    paid_date timestamp with time zone,
    course_name character varying(255) NOT NULL,
    course_mode character varying(20) DEFAULT 'online'::character varying NOT NULL,
    payment_method character varying(50),
    transaction_id character varying(100),
    payment_gateway_response jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fees_course_mode_check CHECK (((course_mode)::text = ANY ((ARRAY['online'::character varying, 'offline'::character varying])::text[]))),
    CONSTRAINT fees_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['full'::character varying, 'emi'::character varying])::text[]))),
    CONSTRAINT fees_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.fees OWNER TO postgres;

--
-- Name: otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otps (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    phone character varying NOT NULL,
    otp character varying
);


ALTER TABLE public.otps OWNER TO postgres;

--
-- Name: otps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.otps ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.otps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    course_id uuid,
    enrollment_id uuid,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'INR'::character varying,
    payment_status text NOT NULL,
    payment_method character varying(50),
    payment_type character varying(20) DEFAULT 'course_fee'::character varying NOT NULL,
    gateway_payment_id character varying(255),
    gateway_order_id character varying(255),
    gateway_transaction_id character varying(255),
    instamojo_payment_id character varying(255),
    instamojo_payment_request_id character varying(255),
    instamojo_longurl text,
    instamojo_shorturl text,
    buyer_name character varying(255),
    email character varying(255),
    phone character varying(20),
    payment_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    payment_request_id text,
    provider text DEFAULT 'instamojo'::text,
    purpose text,
    paid_at timestamp with time zone,
    verified_at timestamp with time zone,
    verified_source text,
    raw_webhook jsonb,
    raw_request jsonb,
    CONSTRAINT payments_payment_status_check CHECK ((payment_status = ANY (ARRAY[('pending'::character varying)::text, ('processing'::character varying)::text, ('completed'::character varying)::text, ('failed'::character varying)::text, ('cancelled'::character varying)::text, ('refunded'::character varying)::text]))),
    CONSTRAINT payments_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['course_fee'::character varying, 'installment'::character varying, 'late_fee'::character varying, 'refund'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    phone_number text NOT NULL,
    date_of_birth date,
    role text DEFAULT 'student'::text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_profiles_role_check CHECK ((role = ANY (ARRAY['student'::text, 'instructor'::text, 'admin'::text])))
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	f23c99ca-6689-46b4-b5c6-704b8cf401ed	{"action":"user_confirmation_requested","actor_id":"3968a14c-9edb-4959-8f83-23ce0d5a6b0c","actor_name":"Test User","actor_username":"test1759642812896@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:40:16.255076+00	
00000000-0000-0000-0000-000000000000	96a34bbf-0bbc-4362-80e0-d5a023f48e17	{"action":"user_confirmation_requested","actor_id":"9c2f1479-fc6c-4e38-8ffd-81dc26e2328d","actor_name":"Test User","actor_username":"test1759642836965@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:40:40.181818+00	
00000000-0000-0000-0000-000000000000	9f6d55f2-56d9-4239-9edf-e1a6d69ce563	{"action":"user_confirmation_requested","actor_id":"32c546de-b58c-4740-b173-52e4def3f2c4","actor_name":"Test User Updated","actor_username":"test1759642937647@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:42:20.858057+00	
00000000-0000-0000-0000-000000000000	b399650d-01c9-4428-8cd4-fbab189bc7cf	{"action":"user_confirmation_requested","actor_id":"e0c3776d-c60c-44e0-aa94-8bb408ddb814","actor_name":"Test User","actor_username":"valid.email@domain.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:51:25.788605+00	
00000000-0000-0000-0000-000000000000	97cc34a2-3b05-4849-bbdf-2661caf4a202	{"action":"user_confirmation_requested","actor_id":"60a7ac97-3d27-40e3-bca0-c93c75639abf","actor_name":"Test User","actor_username":"user.name@domain.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:01.713782+00	
00000000-0000-0000-0000-000000000000	72110054-9835-4a1f-b54c-3ea4301812a9	{"action":"user_confirmation_requested","actor_id":"5d2f3589-5599-4db1-9979-a5ab9aa50516","actor_name":"Test User","actor_username":"firstname.lastname@company.org","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:04.489652+00	
00000000-0000-0000-0000-000000000000	d1fcc56e-2eb9-41d1-9714-6dfe39d53fea	{"action":"user_confirmation_requested","actor_id":"3a8b289f-9645-49e3-a189-ce8e5660595c","actor_name":"Test User","actor_username":"test123@business.net","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:09.915387+00	
00000000-0000-0000-0000-000000000000	7a0f9387-e1a3-456c-b32b-3056765da6c9	{"action":"user_confirmation_requested","actor_id":"13e40586-c353-4714-9fbb-caf9dc7505c7","actor_name":"Test User","actor_username":"contact@service.biz","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:13.540285+00	
00000000-0000-0000-0000-000000000000	435fb5f3-4c62-4a8f-931a-94327ffd3bb2	{"action":"user_confirmation_requested","actor_id":"9003c560-fca1-45e4-ad08-11234632c343","actor_name":"Test User","actor_username":"hello@world.dev","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:16.277308+00	
00000000-0000-0000-0000-000000000000	8be53d1b-3761-4224-869c-5916dfd4441d	{"action":"user_confirmation_requested","actor_id":"a868db84-1a52-464b-8e87-8699bf266c2d","actor_name":"Test User","actor_username":"support@help.center","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:19.141936+00	
00000000-0000-0000-0000-000000000000	4576a71b-c081-48fd-89cd-00f3f8f8da8f	{"action":"user_confirmation_requested","actor_id":"d160fb6c-844a-4d9b-a6ab-a00e94b4008c","actor_name":"Test User","actor_username":"user123@domain123.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:22.317334+00	
00000000-0000-0000-0000-000000000000	72d28017-8be9-411f-9d77-89d7b71baa57	{"action":"user_confirmation_requested","actor_id":"3af474ad-f302-4d2d-9afa-c61665842e9c","actor_name":"Test User","actor_username":"test_user@my-domain.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:25.390818+00	
00000000-0000-0000-0000-000000000000	b55d5c63-d29e-4796-a46c-9e587c834d75	{"action":"user_confirmation_requested","actor_id":"11097247-5a0b-497d-8939-35d53c172f7a","actor_name":"Test User","actor_username":"email+tag@domain.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:28.456058+00	
00000000-0000-0000-0000-000000000000	f5675f18-74c7-4f08-b760-cb8b8c505bda	{"action":"user_confirmation_requested","actor_id":"3ba08a1a-e4eb-4e38-ba99-b52ee3756704","actor_name":"Test User","actor_username":"newuser@hotmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:33.612456+00	
00000000-0000-0000-0000-000000000000	30c122ae-bfff-49a8-a219-900d88480b29	{"action":"user_confirmation_requested","actor_id":"ed09e9b0-ef6c-4b9e-bfef-0d0080dab034","actor_name":"Test User","actor_username":"person@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 05:52:36.713294+00	
00000000-0000-0000-0000-000000000000	d0ccd67e-6a04-4e36-9b7f-dd766e8cba81	{"action":"user_confirmation_requested","actor_id":"9ae447d2-cef9-42d4-b202-366097a833df","actor_name":"sumukh","actor_username":"sumukhagar041@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-05 18:17:50.572279+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
3968a14c-9edb-4959-8f83-23ce0d5a6b0c	3968a14c-9edb-4959-8f83-23ce0d5a6b0c	{"sub": "3968a14c-9edb-4959-8f83-23ce0d5a6b0c", "email": "test1759642812896@gmail.com", "phone": "+913316500124", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:40:16.23542+00	2025-10-05 05:40:16.235474+00	2025-10-05 05:40:16.235474+00	e4bbfda9-18b8-42ab-bd43-a57d597bc479
9c2f1479-fc6c-4e38-8ffd-81dc26e2328d	9c2f1479-fc6c-4e38-8ffd-81dc26e2328d	{"sub": "9c2f1479-fc6c-4e38-8ffd-81dc26e2328d", "email": "test1759642836965@gmail.com", "phone": "+917293511391", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:40:40.169246+00	2025-10-05 05:40:40.169302+00	2025-10-05 05:40:40.169302+00	d0923cf2-4b25-4793-a9d5-e6d6bcc63fcf
32c546de-b58c-4740-b173-52e4def3f2c4	32c546de-b58c-4740-b173-52e4def3f2c4	{"sub": "32c546de-b58c-4740-b173-52e4def3f2c4", "email": "test1759642937647@gmail.com", "phone": "+914053290115", "full_name": "Test User Updated", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:42:20.850993+00	2025-10-05 05:42:20.851047+00	2025-10-05 05:42:20.851047+00	57d6d5fb-8be9-4762-a7fa-d33356ae0812
e0c3776d-c60c-44e0-aa94-8bb408ddb814	e0c3776d-c60c-44e0-aa94-8bb408ddb814	{"sub": "e0c3776d-c60c-44e0-aa94-8bb408ddb814", "email": "valid.email@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:51:25.786443+00	2025-10-05 05:51:25.786489+00	2025-10-05 05:51:25.786489+00	51263ba2-37dd-43ce-9d8f-b0db0d5a9c26
60a7ac97-3d27-40e3-bca0-c93c75639abf	60a7ac97-3d27-40e3-bca0-c93c75639abf	{"sub": "60a7ac97-3d27-40e3-bca0-c93c75639abf", "email": "user.name@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:01.711733+00	2025-10-05 05:52:01.711778+00	2025-10-05 05:52:01.711778+00	5781f7ba-c208-4534-b5da-6d6f0664e8a7
5d2f3589-5599-4db1-9979-a5ab9aa50516	5d2f3589-5599-4db1-9979-a5ab9aa50516	{"sub": "5d2f3589-5599-4db1-9979-a5ab9aa50516", "email": "firstname.lastname@company.org", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:04.487163+00	2025-10-05 05:52:04.487213+00	2025-10-05 05:52:04.487213+00	0d4fc245-8895-4f7f-87ef-63e4724fbb6b
3a8b289f-9645-49e3-a189-ce8e5660595c	3a8b289f-9645-49e3-a189-ce8e5660595c	{"sub": "3a8b289f-9645-49e3-a189-ce8e5660595c", "email": "test123@business.net", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:09.912104+00	2025-10-05 05:52:09.91215+00	2025-10-05 05:52:09.91215+00	7c831edc-98a6-492a-820f-5254496a0788
13e40586-c353-4714-9fbb-caf9dc7505c7	13e40586-c353-4714-9fbb-caf9dc7505c7	{"sub": "13e40586-c353-4714-9fbb-caf9dc7505c7", "email": "contact@service.biz", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:13.538391+00	2025-10-05 05:52:13.538437+00	2025-10-05 05:52:13.538437+00	0ae5cf08-c2ab-4715-8e81-184c242a418e
9003c560-fca1-45e4-ad08-11234632c343	9003c560-fca1-45e4-ad08-11234632c343	{"sub": "9003c560-fca1-45e4-ad08-11234632c343", "email": "hello@world.dev", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:16.275416+00	2025-10-05 05:52:16.275461+00	2025-10-05 05:52:16.275461+00	7784024e-374d-4eed-ba14-392a53fd00bf
a868db84-1a52-464b-8e87-8699bf266c2d	a868db84-1a52-464b-8e87-8699bf266c2d	{"sub": "a868db84-1a52-464b-8e87-8699bf266c2d", "email": "support@help.center", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:19.139272+00	2025-10-05 05:52:19.139317+00	2025-10-05 05:52:19.139317+00	3c40742b-1d8b-48ac-bf09-ad58dd0f4fee
d160fb6c-844a-4d9b-a6ab-a00e94b4008c	d160fb6c-844a-4d9b-a6ab-a00e94b4008c	{"sub": "d160fb6c-844a-4d9b-a6ab-a00e94b4008c", "email": "user123@domain123.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:22.315293+00	2025-10-05 05:52:22.315343+00	2025-10-05 05:52:22.315343+00	4a7ca61b-30c9-475d-90d1-a01c675ab70b
3af474ad-f302-4d2d-9afa-c61665842e9c	3af474ad-f302-4d2d-9afa-c61665842e9c	{"sub": "3af474ad-f302-4d2d-9afa-c61665842e9c", "email": "test_user@my-domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:25.388839+00	2025-10-05 05:52:25.388887+00	2025-10-05 05:52:25.388887+00	487cba9b-2c7e-4a2e-ac39-8b94cbd6aad6
11097247-5a0b-497d-8939-35d53c172f7a	11097247-5a0b-497d-8939-35d53c172f7a	{"sub": "11097247-5a0b-497d-8939-35d53c172f7a", "email": "email+tag@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:28.453585+00	2025-10-05 05:52:28.45363+00	2025-10-05 05:52:28.45363+00	86bc5d7a-2565-4a21-8975-a24400efb7b1
3ba08a1a-e4eb-4e38-ba99-b52ee3756704	3ba08a1a-e4eb-4e38-ba99-b52ee3756704	{"sub": "3ba08a1a-e4eb-4e38-ba99-b52ee3756704", "email": "newuser@hotmail.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:33.609006+00	2025-10-05 05:52:33.609065+00	2025-10-05 05:52:33.609065+00	7e79a0cf-4cc2-4e4e-b74f-c354dc10bb29
ed09e9b0-ef6c-4b9e-bfef-0d0080dab034	ed09e9b0-ef6c-4b9e-bfef-0d0080dab034	{"sub": "ed09e9b0-ef6c-4b9e-bfef-0d0080dab034", "email": "person@outlook.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	email	2025-10-05 05:52:36.70957+00	2025-10-05 05:52:36.709635+00	2025-10-05 05:52:36.709635+00	c629ae70-a1ff-4945-bc55-2fc1a4666dc3
9ae447d2-cef9-42d4-b202-366097a833df	9ae447d2-cef9-42d4-b202-366097a833df	{"sub": "9ae447d2-cef9-42d4-b202-366097a833df", "email": "sumukhagar041@gmail.com", "phone": "9808125085", "full_name": "sumukh", "email_verified": false, "phone_verified": false}	email	2025-10-05 18:17:50.558072+00	2025-10-05 18:17:50.558815+00	2025-10-05 18:17:50.558815+00	96f4fdb4-18cc-4adf-b907-464f1ecc7ccd
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
92721047-078c-43f3-8f83-faa388509c08	3968a14c-9edb-4959-8f83-23ce0d5a6b0c	confirmation_token	4c420ece9f5c987a21bbe3d43ac67ee329de13aed2e3d666889b8a0e	test1759642812896@gmail.com	2025-10-05 05:40:19.034286	2025-10-05 05:40:19.034286
127bece7-37ee-4fda-9da8-992d9832f81d	9c2f1479-fc6c-4e38-8ffd-81dc26e2328d	confirmation_token	3f67bbdd1eeb9018b3384912a7cb8b9d2782d0d3aa5a75561e59938b	test1759642836965@gmail.com	2025-10-05 05:40:42.809347	2025-10-05 05:40:42.809347
02d5a5fa-7bd4-48a3-b809-7d48652ea003	32c546de-b58c-4740-b173-52e4def3f2c4	confirmation_token	5bb47e486c9c51ff48be4d60a6ddee299eccac6cfede6215f91cf017	test1759642937647@gmail.com	2025-10-05 05:42:23.577803	2025-10-05 05:42:23.577803
b43b4d87-265d-4fab-bab1-d324f46aa0c7	e0c3776d-c60c-44e0-aa94-8bb408ddb814	confirmation_token	f2a874aee9ea843ea2685d9fa5dd42e923b84433e0857e20a70c5b85	valid.email@domain.com	2025-10-05 05:51:28.481595	2025-10-05 05:51:28.481595
e9b0ce9a-4ba4-47c7-8952-78b9beb5407b	60a7ac97-3d27-40e3-bca0-c93c75639abf	confirmation_token	05e80e352b6cd8724254b5b6598e8e18f54668dbb0d3775bd30da42e	user.name@domain.com	2025-10-05 05:52:04.328968	2025-10-05 05:52:04.328968
341d4a3e-35b8-4bf3-a2b5-8f55234954ad	5d2f3589-5599-4db1-9979-a5ab9aa50516	confirmation_token	8a51f1145f109c45f5219668c315907dd3cc1f8de656484239d8c1a4	firstname.lastname@company.org	2025-10-05 05:52:09.419729	2025-10-05 05:52:09.419729
4f736761-2458-4f02-9db9-323656d6b1ce	3a8b289f-9645-49e3-a189-ce8e5660595c	confirmation_token	76b3ea702b8357bd896c3ea3316b3226eb80de294697a5b55dca6b1d	test123@business.net	2025-10-05 05:52:12.478792	2025-10-05 05:52:12.478792
a324bfc2-b457-4591-8910-3f3fe16c462a	13e40586-c353-4714-9fbb-caf9dc7505c7	confirmation_token	0e554c631bbce4e4b9f34877a486a5eee2435ef9e386f679f56d0480	contact@service.biz	2025-10-05 05:52:16.120907	2025-10-05 05:52:16.120907
bd204e62-ec6b-4669-9d3e-e5f8ab344eb7	9003c560-fca1-45e4-ad08-11234632c343	confirmation_token	6e8090f5919d654c438a79686c58d35f2f0251278cab094ce12158fa	hello@world.dev	2025-10-05 05:52:18.90125	2025-10-05 05:52:18.90125
0b817deb-e1fe-43f2-a8c7-a865e08f0097	a868db84-1a52-464b-8e87-8699bf266c2d	confirmation_token	b40ddfbdb172e82ea1358fea43e35fc99148e0eed83510314bb05aa6	support@help.center	2025-10-05 05:52:21.779282	2025-10-05 05:52:21.779282
7dc67b90-35a6-45fa-b49e-3edf927cdcf9	d160fb6c-844a-4d9b-a6ab-a00e94b4008c	confirmation_token	30f9046e100e0b0dd95466062891c7a9a09c750df5abfed11b7e6660	user123@domain123.com	2025-10-05 05:52:24.935572	2025-10-05 05:52:24.935572
ca938fb3-2238-4190-9e97-d59c64d68073	3af474ad-f302-4d2d-9afa-c61665842e9c	confirmation_token	49e86390c0d7084d21177bc497668589c144566d0ca258581ad061bd	test_user@my-domain.com	2025-10-05 05:52:28.096372	2025-10-05 05:52:28.096372
a6ded3c0-dba8-4cc1-b783-6018f3bf51cf	11097247-5a0b-497d-8939-35d53c172f7a	confirmation_token	0110484fbddb8845b26484120fbfc6cee9830cafa8f0c540c2fe1dd7	email+tag@domain.com	2025-10-05 05:52:31.091182	2025-10-05 05:52:31.091182
677eb7dc-d795-4b70-8fa6-d3578d53798e	3ba08a1a-e4eb-4e38-ba99-b52ee3756704	confirmation_token	111c8d671ffc8c532cf9910ab34236b657380a80478cf8cbb361b0ae	newuser@hotmail.com	2025-10-05 05:52:36.224999	2025-10-05 05:52:36.224999
b18f396c-35fe-40c4-aba1-02a47bb61d9a	ed09e9b0-ef6c-4b9e-bfef-0d0080dab034	confirmation_token	74b6a3568b498cddd858ed7aff3fe70dedb3210ad9b87935196c3253	person@outlook.com	2025-10-05 05:52:39.535896	2025-10-05 05:52:39.535896
c8ef072a-45d6-41dd-a69c-33b8ad54a315	9ae447d2-cef9-42d4-b202-366097a833df	confirmation_token	4c19c92405763f2f3d5c0ad9fa89256f1ac020108922e0d0ec6aa1f2	sumukhagar041@gmail.com	2025-10-05 18:17:53.498397	2025-10-05 18:17:53.498397
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	e0c3776d-c60c-44e0-aa94-8bb408ddb814	authenticated	authenticated	valid.email@domain.com	$2a$10$k8/PjX6ioOSYs.fy.OOG1Oxa6Qi18b/krzaQ8hIEo6HTuWsuB6VqK	\N	\N	f2a874aee9ea843ea2685d9fa5dd42e923b84433e0857e20a70c5b85	2025-10-05 05:51:25.789134+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "e0c3776d-c60c-44e0-aa94-8bb408ddb814", "email": "valid.email@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:51:25.783753+00	2025-10-05 05:51:28.479678+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	32c546de-b58c-4740-b173-52e4def3f2c4	authenticated	authenticated	test1759642937647@gmail.com	$2a$10$0cz.KdkIc41VrasFXFv.de0qnP3WTg8sChXXGVchMpLWYsJ78Ji9e	\N	\N	5bb47e486c9c51ff48be4d60a6ddee299eccac6cfede6215f91cf017	2025-10-05 05:42:20.859605+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "32c546de-b58c-4740-b173-52e4def3f2c4", "email": "test1759642937647@gmail.com", "phone": "+914053290115", "full_name": "Test User Updated", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:42:20.831965+00	2025-10-05 05:42:23.575162+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3a8b289f-9645-49e3-a189-ce8e5660595c	authenticated	authenticated	test123@business.net	$2a$10$Z7bJ7iRhzYoLl61lX/Vla.VeWU8GMPUvK2mzGAu6HzA16.Y8stARO	\N	\N	76b3ea702b8357bd896c3ea3316b3226eb80de294697a5b55dca6b1d	2025-10-05 05:52:09.916143+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "3a8b289f-9645-49e3-a189-ce8e5660595c", "email": "test123@business.net", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:09.909772+00	2025-10-05 05:52:12.477859+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3968a14c-9edb-4959-8f83-23ce0d5a6b0c	authenticated	authenticated	test1759642812896@gmail.com	$2a$10$2p/xOUvEWgw27OsAI09Bme07XgrqSUmihw50A6APmAuPzeBqIEttK	\N	\N	4c420ece9f5c987a21bbe3d43ac67ee329de13aed2e3d666889b8a0e	2025-10-05 05:40:16.259735+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "3968a14c-9edb-4959-8f83-23ce0d5a6b0c", "email": "test1759642812896@gmail.com", "phone": "+913316500124", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:40:16.174842+00	2025-10-05 05:40:18.957913+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	60a7ac97-3d27-40e3-bca0-c93c75639abf	authenticated	authenticated	user.name@domain.com	$2a$10$uZBHLyz2x8bwrxpvLvW4I..ToKta22qCF9iRfyiNKv/T4G5zQK/8.	\N	\N	05e80e352b6cd8724254b5b6598e8e18f54668dbb0d3775bd30da42e	2025-10-05 05:52:01.714313+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "60a7ac97-3d27-40e3-bca0-c93c75639abf", "email": "user.name@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:01.709347+00	2025-10-05 05:52:04.328023+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9c2f1479-fc6c-4e38-8ffd-81dc26e2328d	authenticated	authenticated	test1759642836965@gmail.com	$2a$10$swKdjEu0HRRWepXHEFgeVuCnlW7TnBmn1NebvFlyqiBSO1cXSp5IO	\N	\N	3f67bbdd1eeb9018b3384912a7cb8b9d2782d0d3aa5a75561e59938b	2025-10-05 05:40:40.185654+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "9c2f1479-fc6c-4e38-8ffd-81dc26e2328d", "email": "test1759642836965@gmail.com", "phone": "+917293511391", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:40:40.132626+00	2025-10-05 05:40:42.80702+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	13e40586-c353-4714-9fbb-caf9dc7505c7	authenticated	authenticated	contact@service.biz	$2a$10$enBXAYM5Cu1/NLiL14bJE.kM6HhNnL.GMn2MArX4NPiygktfgdJIW	\N	\N	0e554c631bbce4e4b9f34877a486a5eee2435ef9e386f679f56d0480	2025-10-05 05:52:13.54107+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "13e40586-c353-4714-9fbb-caf9dc7505c7", "email": "contact@service.biz", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:13.536101+00	2025-10-05 05:52:16.11994+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	5d2f3589-5599-4db1-9979-a5ab9aa50516	authenticated	authenticated	firstname.lastname@company.org	$2a$10$anFHuwUIefMaPx4Nn3.uYe0qvs9J08jwqRjoW0GKPvicktmo.GSWC	\N	\N	8a51f1145f109c45f5219668c315907dd3cc1f8de656484239d8c1a4	2025-10-05 05:52:04.490277+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "5d2f3589-5599-4db1-9979-a5ab9aa50516", "email": "firstname.lastname@company.org", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:04.484176+00	2025-10-05 05:52:09.418062+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a868db84-1a52-464b-8e87-8699bf266c2d	authenticated	authenticated	support@help.center	$2a$10$lVuDvEGaYQ3yHFGxBZC1bea3uNCywt7K8CZrdTDsiQohcDhXjCZAq	\N	\N	b40ddfbdb172e82ea1358fea43e35fc99148e0eed83510314bb05aa6	2025-10-05 05:52:19.142541+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "a868db84-1a52-464b-8e87-8699bf266c2d", "email": "support@help.center", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:19.13691+00	2025-10-05 05:52:21.777854+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d160fb6c-844a-4d9b-a6ab-a00e94b4008c	authenticated	authenticated	user123@domain123.com	$2a$10$KoW7WsfIw0gteuQ56ZC5MuWCleqT7xSh0eB/N8lnO/k.Nqz9PpZny	\N	\N	30f9046e100e0b0dd95466062891c7a9a09c750df5abfed11b7e6660	2025-10-05 05:52:22.317814+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "d160fb6c-844a-4d9b-a6ab-a00e94b4008c", "email": "user123@domain123.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:22.313093+00	2025-10-05 05:52:24.934796+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9003c560-fca1-45e4-ad08-11234632c343	authenticated	authenticated	hello@world.dev	$2a$10$8lDXBNrfdEi3nO304zWF/uWHsUU4/I4f5AO1IUHhYj6H6tCxbZjAe	\N	\N	6e8090f5919d654c438a79686c58d35f2f0251278cab094ce12158fa	2025-10-05 05:52:16.278557+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "9003c560-fca1-45e4-ad08-11234632c343", "email": "hello@world.dev", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:16.273114+00	2025-10-05 05:52:18.900186+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3af474ad-f302-4d2d-9afa-c61665842e9c	authenticated	authenticated	test_user@my-domain.com	$2a$10$R5CsvwdZJV6dthMqJA85a.7P/HSpH10b5q0zShf4/AVa0RvjyT14i	\N	\N	49e86390c0d7084d21177bc497668589c144566d0ca258581ad061bd	2025-10-05 05:52:25.391382+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "3af474ad-f302-4d2d-9afa-c61665842e9c", "email": "test_user@my-domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:25.386425+00	2025-10-05 05:52:28.095641+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	11097247-5a0b-497d-8939-35d53c172f7a	authenticated	authenticated	email+tag@domain.com	$2a$10$n0gXQFwHP/GKvm/A3hNNZuZ/suymAf1GgJlt6/Jtg8FsxPPuXm9Qy	\N	\N	0110484fbddb8845b26484120fbfc6cee9830cafa8f0c540c2fe1dd7	2025-10-05 05:52:28.457507+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "11097247-5a0b-497d-8939-35d53c172f7a", "email": "email+tag@domain.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:28.451227+00	2025-10-05 05:52:31.084395+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3ba08a1a-e4eb-4e38-ba99-b52ee3756704	authenticated	authenticated	newuser@hotmail.com	$2a$10$w00D5z.Y3H1ddxRI4ywaGe5dFDVyx0R5XK0KrqsqkDoZnw9mAGJ3i	\N	\N	111c8d671ffc8c532cf9910ab34236b657380a80478cf8cbb361b0ae	2025-10-05 05:52:33.613806+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "3ba08a1a-e4eb-4e38-ba99-b52ee3756704", "email": "newuser@hotmail.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:33.603661+00	2025-10-05 05:52:36.218481+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9ae447d2-cef9-42d4-b202-366097a833df	authenticated	authenticated	sumukhagar041@gmail.com	$2a$10$AC5CYXnzSjB//QjXSIQETutrUGqmzCcx3lLBQaooVnN93NrgsCkG2	\N	\N	4c19c92405763f2f3d5c0ad9fa89256f1ac020108922e0d0ec6aa1f2	2025-10-05 18:17:50.580325+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "9ae447d2-cef9-42d4-b202-366097a833df", "email": "sumukhagar041@gmail.com", "phone": "9808125085", "full_name": "sumukh", "email_verified": false, "phone_verified": false}	\N	2025-10-05 18:17:50.475781+00	2025-10-05 18:17:53.482773+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ed09e9b0-ef6c-4b9e-bfef-0d0080dab034	authenticated	authenticated	person@outlook.com	$2a$10$1kwQbuTrEb1DGpqG2lU.ounjIymp0q4QSe7FiI8RW6tj0uJ0YBlEa	\N	\N	74b6a3568b498cddd858ed7aff3fe70dedb3210ad9b87935196c3253	2025-10-05 05:52:36.714652+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "ed09e9b0-ef6c-4b9e-bfef-0d0080dab034", "email": "person@outlook.com", "full_name": "Test User", "email_verified": false, "phone_verified": false}	\N	2025-10-05 05:52:36.697769+00	2025-10-05 05:52:39.398788+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, description, credit, txn_date, created_at, updated_at, amount) FROM stdin;
4	Account balance deduct	f	2025-11-20	2025-11-20 16:26:14.673658+00	2025-11-20 16:26:14.673658+00	48175
5	Manthan Dec Fee Paid	t	2025-12-04	2025-12-04 07:24:25.941992+00	2025-12-04 07:24:25.941992+00	1400
6	Wifi Charge	f	2025-12-04	2025-12-04 07:25:05.963989+00	2025-12-04 07:25:05.963989+00	471
7	Dec Rent 	f	2025-12-05	2025-12-04 08:34:44.541402+00	2025-12-04 08:34:44.541402+00	8600
\.


--
-- Data for Name: admin_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_sessions (id, admin_user_id, session_token, ip_address, user_agent, expires_at, created_at, last_activity) FROM stdin;
3472f95a-f56b-447f-b885-93181457ced9	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	d2d20c01930e0c13760801f8fc580b2e346872308c5abb12daeeb88c1a3be8b6	\N	\N	2025-10-05 03:22:22.053+00	2025-10-04 19:22:23.875965+00	2025-10-04 19:22:23.875965+00
3bde54b7-8530-4b89-ae08-8670c20d8f16	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	e0daf091091ea77793192e33932fd989f11a9cb710a2ce54eef8aa7534466d55	\N	\N	2025-10-05 03:22:58.968+00	2025-10-04 19:23:00.788685+00	2025-10-04 19:23:00.788685+00
bc4a58a7-5553-499c-8c89-8c524ec9de6d	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	22c4bffa7d5ef7ea63a8a2fd44469b9b50f735fb80d3b3a28f3834154f7c465c	\N	\N	2025-10-05 03:38:53.218+00	2025-10-04 19:38:55.035895+00	2025-10-04 19:38:55.035895+00
3d228d2c-2f81-41f5-9a35-64103edb60e6	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	3b868acc9231bbbe7a8bc8dbcea7a17279da52b1827efa49282cadb416d675ff	\N	\N	2025-10-05 12:31:41.1+00	2025-10-05 04:31:44.157136+00	2025-10-05 04:31:44.157136+00
df188810-fc40-44f8-a145-52890020945f	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	e115cb3651941943c1f5b8518c3d91bdd0082589441e5ed8cf0c708bc15c34d5	\N	\N	2025-10-17 02:56:14.775+00	2025-10-16 18:56:19.896917+00	2025-10-16 18:56:19.896917+00
7845dc37-784a-4d96-8641-10c03b460f4b	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	60c65be82a36029f300b06c95d50391a69da1a7a2f4908c437d4b4e080c26b64	\N	\N	2025-10-17 02:56:43.83+00	2025-10-16 18:56:48.884238+00	2025-10-16 18:56:48.884238+00
ea78a399-7097-482f-ac17-6f5a2faa7128	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	563c5002327474b15c412c38ed48bc7d7c173e6f079c6efcd8e170114de1abc0	\N	\N	2025-10-17 02:57:20.014+00	2025-10-16 18:57:25.086252+00	2025-10-16 18:57:25.086252+00
f08fb530-62bd-44ae-acc1-5d333578df7a	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	0ce5a8f682f21216d1cefbc4eedcc658d354d55e4e992c93e83f22bded12251b	\N	\N	2025-10-17 02:57:53.65+00	2025-10-16 18:57:58.757685+00	2025-10-16 18:57:58.757685+00
d9d060a4-9775-4d2e-9a45-a43be4734e97	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	40131cc8c3a15fc3017082313f73f4711c5c962acf30df05f4d8e35198a3e4e3	\N	\N	2025-10-17 03:02:05.213+00	2025-10-16 19:02:10.317181+00	2025-10-16 19:02:10.317181+00
653e1a96-5059-4416-8dc9-208a628556fd	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	075d4f1ce5565194c309ca33237718733c1b8059c6f166978d87cb0b31d804ff	\N	\N	2025-10-17 03:03:45.883+00	2025-10-16 19:03:50.951838+00	2025-10-16 19:03:50.951838+00
650b5e3d-2272-4481-ac6e-5af3fa23b3ae	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	8eec1847be6e1c53d2ad5a5371c7834c3e31b7b9ecd310f6d222862f71039f73	\N	\N	2025-10-17 03:04:18.577+00	2025-10-16 19:04:23.653297+00	2025-10-16 19:04:23.653297+00
976c7730-04a0-4cf9-a744-223b71bf254a	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	32ef0408a5e80f1c27dbf385281e51ad4f3fa35226c2ab0a0ed7323ea6ce7bb8	\N	\N	2025-10-17 03:06:35.307+00	2025-10-16 19:06:40.367291+00	2025-10-16 19:06:40.367291+00
a3a67cd2-4006-4006-938b-7fffae50abcd	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	319f30ef844419e732ba7096a4a42d700279c739c79694683c34de367ae8fbf6	\N	\N	2025-10-17 03:18:16.354+00	2025-10-16 19:18:21.402313+00	2025-10-16 19:18:21.402313+00
ab907eb3-37dd-443e-a546-0f36fce28f6a	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	523586720bda2c14419ece31cd077847d0b001d015ed14e608d4a4ed9b9ba56e	\N	\N	2025-10-17 03:18:36.765+00	2025-10-16 19:18:41.787189+00	2025-10-16 19:18:41.787189+00
02e08cab-da5a-4e4a-986e-929844e70620	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	d356aa6e1f2eb46a03743f7fc3c565a63e643ab131527a272a57d25e02aaa3c4	\N	\N	2025-10-17 12:44:10.039+00	2025-10-17 04:44:16.304804+00	2025-10-17 04:44:16.304804+00
6c350590-9d8d-4a22-af7a-f56a8c275ce5	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	b8f86fb0821cbfbb0bd7129569b0175bc12c7a29ec1a138af3ac49f619cec786	\N	\N	2025-10-28 21:21:59.786+00	2025-10-28 13:22:03.323412+00	2025-10-28 13:22:03.323412+00
64ee5c16-425f-490a-bdd3-bcdd964d6b5e	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	045fbbd357ae8b7fb5d41fa6e8c7676050a6b9efe4f0422e43d3e35988c52199	\N	\N	2025-10-28 21:37:27.294+00	2025-10-28 13:37:30.797381+00	2025-10-28 13:37:30.797381+00
86b81e67-978f-43f7-9f50-a6eb87231131	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	07716751013280646b39fe1b6f40c1dbfde62b9ae751dd726db04b5c3a83f2a1	\N	\N	2025-11-03 06:56:42.734+00	2025-11-03 11:08:13.956854+00	2025-11-03 11:08:13.956854+00
4ebb830e-f23b-4518-a1f5-01f4f7045e96	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	ad58b1adf081156cd86c982ac625112589172aa630360716a9a644078dff0d71	\N	\N	2025-11-03 19:28:09.598+00	2025-11-03 11:28:13.144525+00	2025-11-03 11:28:13.144525+00
fabe1e29-526c-446a-8725-191617a78ae6	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	3b0b11ebd317489bd74a2ead86a47023349708691a0fa8146ba5bafa99244f76	\N	\N	2025-11-03 19:54:26.295+00	2025-11-03 11:54:29.781385+00	2025-11-03 11:54:29.781385+00
72028aad-0a4e-4de5-9408-1b8ac33c1cca	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	f3b83d04d1c4ad2acc06c02019c484b7b44b65253bf61cf9b5de51b92261156d	\N	\N	2025-11-03 19:59:39.279+00	2025-11-03 11:59:42.638755+00	2025-11-03 11:59:42.638755+00
cbbfcf87-01f9-4d03-868b-b9fcc92f44be	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	263b307ccb292934f4c1e0c3a73cf9ce19b4fd8b1681ed428e526e044ec830d3	\N	\N	2025-11-03 20:01:33.718+00	2025-11-03 12:01:37.077344+00	2025-11-03 12:01:37.077344+00
d57eac2b-b9ed-4077-89d1-97efed281fff	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	2312db3755591d3e115b66dd3333d5676f50ab58817696494e140fbda93b0b19	\N	\N	2025-11-04 13:20:48.73+00	2025-11-04 05:20:52.184522+00	2025-11-04 05:20:52.184522+00
404eb654-71ec-4b6b-9a05-8875b524d0ff	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	68af16a633590c9d6831c5bd0a383c012e18a94160576702803bf9615b6482bf	\N	\N	2025-11-04 19:25:36.289+00	2025-11-04 11:25:37.452158+00	2025-11-04 11:25:37.452158+00
808021da-014d-4dea-b01f-36e5d5c7589a	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	983689e4c47e74a0b9ba6304ce65ff098530a40db2fc6a7bac5fa34e4c1b8445	\N	\N	2025-11-11 19:36:27.307+00	2025-11-11 11:36:31.310209+00	2025-11-11 11:36:31.310209+00
4cc823da-f006-499b-8522-3464e7ab2235	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	79275f102f8cbe10ae11c80b72e1e36534a1157cfaa75542da6ed8a26a612a6e	\N	\N	2025-11-12 19:49:43.285+00	2025-11-12 11:49:47.953306+00	2025-11-12 11:49:47.953306+00
0d0adfe3-310d-4a6f-998c-bb2360cc4985	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	de6662d0b6fa5ea236a59a8983e0ab3dbdb07a188a8335e44bd7b8b1dcd65e75	\N	\N	2025-11-15 20:18:09.566+00	2025-11-15 12:18:10.646202+00	2025-11-15 12:18:10.646202+00
ff1bae2d-dcc0-458b-a6b1-fd9ffee998db	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	ccfd95a9179f99abcb50b8b6b94a5375b8a50eb98bc3b4ac2578cb02e4917be7	\N	\N	2025-11-15 20:50:31.126+00	2025-11-15 12:50:34.5001+00	2025-11-15 12:50:34.5001+00
b9e996ec-ae74-4724-8358-b17bd2d985c1	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	4179ba8cb93a0f1f9f8836133b7413f7f1bc3c1c2c7144dd34d6015487d2558b	\N	\N	2025-11-16 00:04:37.078+00	2025-11-15 16:04:41.388521+00	2025-11-15 16:04:41.388521+00
6e843a67-c639-4805-ae49-217fdefb4aa7	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	32e98c58a5a64c63f0355d6dab1ec4ca0c1cea47c0eb0bd40c8d9eb7d93519f0	\N	\N	2025-11-17 18:40:45.903+00	2025-11-17 10:40:49.450372+00	2025-11-17 10:40:49.450372+00
03c02074-cac0-4a3b-a441-2d28c12f2fe0	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	6004281579559dd51a722635bb2fde9ccca8a1deb88f7463c73bdb14afd4d887	\N	\N	2025-11-18 15:00:04.373+00	2025-11-18 07:00:07.680588+00	2025-11-18 07:00:07.680588+00
6d3245e3-90c6-4ab5-848b-8937b834e961	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	60a11b588bc5a256fbc026c2bbce1e2db023680d52c17526c209bd6a8f724fdd	\N	\N	2025-11-18 15:41:48.55+00	2025-11-18 07:41:52.18828+00	2025-11-18 07:41:52.18828+00
e3e4e18c-cf63-4eca-9a02-00eb841ac453	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	bfea303236977d8c4ccdd44a389675b73c6accba3119133def4c6788d89af4a5	\N	\N	2025-11-18 07:50:09.065+00	2025-11-18 12:01:59.083964+00	2025-11-18 12:01:59.083964+00
ca91ea2d-45a5-4bcc-8185-81f7baa416e5	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	d9175b5f9e944cfbcbf1d66632b344c35c2bd42e3dd38dccf1ec46fc6c2c2321	\N	\N	2025-11-19 17:47:59.617+00	2025-11-19 09:48:03.127884+00	2025-11-19 09:48:03.127884+00
801c3217-a619-415f-afa2-ca44cae6232d	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	dc47f1419300314f5d5664fb561bb8daa149147d0831ed28a6af7c6bd53f0541	\N	\N	2025-11-20 21:00:02.539+00	2025-11-20 13:00:07.53492+00	2025-11-20 13:00:07.53492+00
be3b229d-0f94-4e7a-ac10-4ff37313fc22	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	cc752f065a8d5524ac914e4a37b2ec435c73b20fd786f02eb65f1aa0676fb355	\N	\N	2025-11-27 20:00:18.278+00	2025-11-27 12:00:21.207249+00	2025-11-27 12:00:21.207249+00
5dedd239-5474-4168-a589-95d14ae9f62a	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	1b2db4abdad5804f6c17039860b53deb2c2762cc063abf32e6219e2510710268	\N	\N	2025-12-02 13:44:48.319+00	2025-12-02 05:44:53.1912+00	2025-12-02 05:44:53.1912+00
c882a1bf-5cbf-4716-a6cd-eb112cf96e0c	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	d3a1bcd8d90b68e81c9fd2d20aee920501c72be3b16d4c47b553261fbf6eac96	\N	\N	2025-12-04 15:21:15.156+00	2025-12-04 07:21:18.661934+00	2025-12-04 07:21:18.661934+00
2ac77fea-9898-44f0-9da6-b47def4931f6	f00b3f9a-c181-4a37-bc4a-55b843a9c34c	5f108b9be756a78d974bc0d2934d08da5461c718afe11be9586ac617a1383d40	\N	\N	2025-12-05 21:36:37.009+00	2025-12-05 13:36:40.608081+00	2025-12-05 13:36:40.608081+00
\.


--
-- Data for Name: admin_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_user (id, email, password_hash, full_name, phone_number, role, is_active, last_login, password_changed_at, failed_login_attempts, locked_until, created_by, created_at, updated_at) FROM stdin;
f00b3f9a-c181-4a37-bc4a-55b843a9c34c	techaddaainstitute@gmail.com	078dc1ca5f4d841c92affa6bc3ee21cc	TechAddaa Institute Administrator	+91-7579944452	super_admin	t	2025-12-05 13:36:40.388543+00	2025-10-04 19:14:01.586319+00	0	\N	\N	2025-10-04 19:14:01.586319+00	2025-12-05 13:36:40.388543+00
\.


--
-- Data for Name: certificate_downloads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificate_downloads (id, user_id, certificate_id, phone_number, date_of_birth, download_date, ip_address, user_agent) FROM stdin;
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, user_id, course_id, enrollment_id, certificate_number, issue_date, grade, instructor_name, course_name, course_duration, completion_date, certificate_url, is_valid) FROM stdin;
\.


--
-- Data for Name: course_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_enrollments (id, user_id, course_id, enrollment_mode, price_paid, enrollment_date, completion_date, progress, progress_percentage, completed_lessons, grade, status, updated_at) FROM stdin;
23aec8d8-8188-4fd9-ae13-98496d42e8c9	\N	576b0e74-61d0-4272-96ca-ef55fb887f31	online	9800.00	2025-10-12 11:28:15.785+00	\N	0.00	0.00	0	\N	active	2025-10-12 11:28:15.785+00
6cc720fb-526c-40cb-899c-6278645804b4	\N	75c19337-d027-40ca-946a-092a5eefbc3b	online	19800.00	2025-10-12 11:31:32.073+00	\N	0.00	0.00	0	\N	active	2025-10-12 11:31:32.074+00
0215dd93-e5d8-409d-ad4f-d8cb63f2e796	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	online	6000.00	2025-11-02 23:03:00.91+00	\N	0.00	0.00	0	\N	active	2025-11-03 11:14:32.292032+00
c8e109c9-d905-4852-8a05-dc550a4fe791	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3500.00	2025-11-02 23:27:58.521+00	\N	0.00	0.00	0	\N	active	2025-11-03 11:39:29.71992+00
c6219956-f195-4c56-b6b7-662ba3c5d7d6	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	2400.00	2025-11-02 23:36:20.636+00	\N	0.00	0.00	0	\N	active	2025-11-03 11:47:51.814621+00
4fc6e212-7bc0-4ba5-ab7c-e76782e192be	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3000.00	2025-11-02 23:42:03.072+00	\N	0.00	0.00	0	\N	active	2025-11-03 11:53:34.249811+00
8ef53a5a-6a9f-465c-a42c-c136589e8330	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3000.00	2025-11-02 23:43:52.151+00	\N	0.00	0.00	0	\N	active	2025-11-03 11:55:23.334395+00
4cdb468f-ebe9-46f5-9b54-8b586e89909a	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3300.00	2025-11-03 00:23:56.152+00	\N	0.00	0.00	0	\N	active	2025-11-03 12:35:27.429207+00
f07872d5-9c82-4ec7-9837-2976068833dd	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	offline	6000.00	2025-11-03 12:38:19.66+00	\N	0.00	0.00	0	\N	active	2025-11-03 12:38:22.889992+00
ae50ce1f-0975-41a5-8818-b1a626a876ae	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	4800.00	2025-11-04 11:28:16.397+00	\N	0.00	0.00	0	\N	active	2025-11-04 11:28:17.588158+00
615544b6-9aad-401e-897a-407dabb550b5	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3000.00	2025-11-04 11:33:53.562+00	\N	0.00	0.00	0	\N	active	2025-11-04 11:33:54.697045+00
21a7c2ab-c851-4e4d-8783-ae74f1959ead	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3000.00	2025-11-04 11:37:15.408+00	\N	0.00	0.00	0	\N	active	2025-11-04 11:37:16.538817+00
c622d203-869f-4973-a724-9b0c165fa12d	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	offline	12000.00	2025-11-15 14:10:50.29+00	\N	0.00	0.00	0	\N	active	2025-11-15 14:10:53.418403+00
222f148e-8059-463d-a7a4-7dfe50b3f4d9	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3600.00	2025-11-15 14:42:50.499+00	\N	0.00	0.00	0	\N	active	2025-11-15 14:42:53.518282+00
21c59ba0-1833-446e-9ecd-7af0096ee505	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3600.00	2025-11-15 14:46:42.215+00	\N	0.00	0.00	0	\N	active	2025-11-15 14:46:45.224262+00
af5e88a1-5478-4431-96f8-bee820c18b20	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	offline	6000.00	2025-11-17 14:45:19.886+00	\N	0.00	0.00	0	\N	active	2025-11-17 14:45:23.451015+00
ad60b216-2f14-4e75-a6a9-b84183259c13	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	offline	10000.00	2025-11-18 07:03:52.375+00	\N	0.00	0.00	0	\N	active	2025-11-18 07:03:55.679596+00
6b8e9c91-a788-40e1-bc41-01f346c84dd8	d867bb56-15ec-4b60-87b1-85ea1374fe01	de1ce660-f2cb-4ddb-88dd-2de3329d985f	offline	4000.00	2025-11-18 09:33:57.625+00	\N	0.00	0.00	0	\N	active	2025-11-18 09:33:57.625+00
e659507d-22bf-426a-aba5-16e4dc407410	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	7200.00	2025-11-18 00:02:26.822+00	\N	0.00	0.00	0	\N	active	2025-11-18 12:14:16.865199+00
d8607c6f-3165-476b-9a42-dbd63b8e398a	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	offline	3600.00	2025-11-18 00:14:38.013+00	\N	0.00	0.00	0	\N	active	2025-11-18 12:26:28.029471+00
eb3c7e86-8d3a-4316-beb7-437e92a2ee08	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	offline	6000.00	2025-11-19 14:21:27.961+00	\N	0.00	0.00	0	\N	active	2025-11-19 14:21:31.602791+00
eecec5da-d62f-40be-8cb1-ec813f40c240	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	offline	12000.00	2025-12-05 13:39:34.194+00	\N	0.00	0.00	0	\N	active	2025-12-05 13:39:37.763964+00
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, instructor_id, price, duration, level, category, image_url, is_active, created_at, updated_at) FROM stdin;
2d179b9c-4e82-436e-a818-d8873634e185	Website Development Diploma	Learn the fundamentals of website development with HTML, CSS, and JavaScript.	\N	4800.00	3 Months	beginner	web	https://images.unsplash.com/photo-1529101091764-c3526daf38fe	t	2025-10-04 19:02:31.493617+00	2025-10-04 19:02:31.493617+00
47dfca81-2daf-4388-baa4-eec8923392b4	Website Development Advance Diploma	Advanced website development with modern frameworks and tools.	\N	7800.00	5 Months	advanced	web	https://images.unsplash.com/photo-1581090700227-4c4f50b6b3d3	t	2025-10-04 19:02:31.705659+00	2025-10-04 19:02:31.705659+00
24176d8b-13a8-4619-95b8-a80ed4027927	Digital Marketing Diploma	Master SEO, social media marketing, and digital strategies.	\N	11800.00	5 Months	intermediate	marketing	https://images.unsplash.com/photo-1508830524289-0adcbe822b40	t	2025-10-04 19:02:31.868621+00	2025-10-04 19:02:31.868621+00
069fd2f5-9752-4a3f-8df1-5bc275258810	Computer Basic	Get started with basic computer knowledge and essential applications.	\N	3000.00	3 Months	beginner	computer	https://images.unsplash.com/photo-1517336714731-489689fd1ca8	t	2025-10-04 19:02:32.032695+00	2025-10-04 19:02:32.032695+00
b6824f04-91ad-4fdd-819f-53c7f418d364	Computer Advance	Advance your computer skills with operating systems and office automation.	\N	4000.00	6 Months	advanced	computer	https://images.unsplash.com/photo-1518770660439-4636190af475	t	2025-10-04 19:02:32.199256+00	2025-10-04 19:02:32.199256+00
f037a696-c3d5-4361-88f6-2197346f9356	Computer Master	Comprehensive mastery of computer operations and applications.	\N	6000.00	12 Months	advanced	computer	https://images.unsplash.com/photo-1555949963-aa79dcee981c	t	2025-10-04 19:02:32.374564+00	2025-10-04 19:02:32.374564+00
84c520b3-b3e0-470f-94fa-cf32b90961a7	Graphic Design	Learn to design with modern tools and creative skills.	\N	4800.00	3 Months	beginner	design	https://images.unsplash.com/photo-1508923567004-3a6b8004f3d3	t	2025-10-04 19:02:32.551416+00	2025-10-04 19:02:32.551416+00
a86e3d7e-ada6-4924-a4d9-1fdf3a14eccc	Java Core	Learn the fundamentals of Java programming language.	\N	4800.00	3 Months	intermediate	programming	https://images.unsplash.com/photo-1581091215367-59ab6a7c9f1d	t	2025-10-04 19:02:32.715277+00	2025-10-04 19:02:32.715277+00
755b3a85-20b9-41e1-8773-4f232e1f8de5	Python Core	Learn the core concepts of Python programming for beginners.	\N	4800.00	3 Months	intermediate	programming	https://images.unsplash.com/photo-1584697964190-ef9a7c8f1f6f	t	2025-10-04 19:02:32.895473+00	2025-10-04 19:02:32.895473+00
63aee007-ad84-47c8-8047-f4398d75c3f5	C Language	Understand the basics of programming with the C language.	\N	4800.00	3 Months	beginner	programming	https://images.unsplash.com/photo-1518770660439-4636190af475	t	2025-10-04 19:02:33.066453+00	2025-10-04 19:02:33.066453+00
cf587025-df3e-4203-95fa-3089b8e1780b	C++ Core	Learn object-oriented programming concepts with C++.	\N	4800.00	3 Months	intermediate	programming	https://images.unsplash.com/photo-1581090700227-4c4f50b6b3d3	t	2025-10-04 19:02:33.234423+00	2025-10-04 19:02:33.234423+00
1ba1dc8e-0e45-44d0-b506-ccf5d02453c6	MySQL	Learn relational databases and SQL queries with MySQL.	\N	4800.00	3 Months	beginner	database	https://images.unsplash.com/photo-1517433456452-f9633a875f6f	t	2025-10-04 19:02:33.416872+00	2025-10-04 19:02:33.416872+00
58b61174-2d80-4c0a-a6e1-06f5e556aa69	PHP	Master PHP programming for dynamic website development.	\N	4800.00	3 Months	beginner	web	https://images.unsplash.com/photo-1590608897129-79da98d159e9	t	2025-10-04 19:02:33.580693+00	2025-10-04 19:02:33.580693+00
ba57caed-a34c-47cf-a5bc-e3632440543a	Data Structure & Algo - C & C++	Learn essential data structures and algorithms using C/C++.	\N	5800.00	4 Months	intermediate	programming	https://images.unsplash.com/photo-1504639725590-34d0984388bd	t	2025-10-04 19:02:33.747453+00	2025-10-04 19:02:33.747453+00
d242db74-221d-4f65-9973-b049b54cf406	Data Structure & Algo - Java	Understand data structures and algorithms using Java.	\N	5800.00	4 Months	intermediate	programming	https://images.unsplash.com/photo-1526378722484-c1f0a04c1d9d	t	2025-10-04 19:02:33.920989+00	2025-10-04 19:02:33.920989+00
1a5d1413-6876-44ca-9b50-0df99bcb7d90	Django Python	Build powerful web applications with Django and Python.	\N	5800.00	4 Months	intermediate	web	https://images.unsplash.com/photo-1584697964364-5b99d2a4160d	t	2025-10-04 19:02:34.087437+00	2025-10-04 19:02:34.087437+00
de1ce660-f2cb-4ddb-88dd-2de3329d985f	Spring Boot Java	Learn backend development with Java Spring Boot framework.	\N	5800.00	4 Months	intermediate	web	https://images.unsplash.com/photo-1555066931-4365d14bab8c	t	2025-10-04 19:02:34.247887+00	2025-10-04 19:02:34.247887+00
bff5ea6e-11fd-4b5c-8fb7-669030ed268e	Java Advance	Deep dive into advanced Java concepts and frameworks.	\N	5800.00	4 Months	advanced	programming	https://images.unsplash.com/photo-1618477461857-9ed94c1c4a7a	t	2025-10-04 19:02:34.42275+00	2025-10-04 19:02:34.42275+00
2943995e-dc7c-44d7-b763-b4f201179b48	Python Advance	Master advanced Python features for real-world projects.	\N	5800.00	4 Months	advanced	programming	https://images.unsplash.com/photo-1581091870622-7c24b2d37e1d	t	2025-10-04 19:02:34.584395+00	2025-10-04 19:02:34.584395+00
3a663eb3-c280-4ce4-b689-f1d4872f2605	C++ Advance	Advanced concepts in C++ for efficient programming.	\N	5800.00	4 Months	advanced	programming	https://images.unsplash.com/photo-1580894894513-75834d77f7b6	t	2025-10-04 19:02:34.753011+00	2025-10-04 19:02:34.753011+00
576b0e74-61d0-4272-96ca-ef55fb887f31	Data Science	Analyze and visualize data using modern tools.	\N	9800.00	6 Months	intermediate	data	https://images.unsplash.com/photo-1555949963-ff9fe0c870eb	t	2025-10-04 19:02:34.9147+00	2025-10-04 19:02:34.9147+00
4f23c316-5052-477f-8a40-68af7650cace	Tally Basic	Learn accounting fundamentals with Tally software.	\N	6000.00	3 Months	beginner	finance	https://images.unsplash.com/photo-1588776814546-ec9f6b5af618	t	2025-10-04 19:02:35.080051+00	2025-10-04 19:02:35.080051+00
2a7631b2-a0a2-421d-983c-b7215d4dfa9b	Tally Advance + GST	Advanced Tally skills with GST compliance.	\N	6800.00	4 Months	advanced	finance	https://images.unsplash.com/photo-1631865813044-628a6e6c7f2c	t	2025-10-04 19:02:35.245755+00	2025-10-04 19:02:35.245755+00
702aedd5-45ed-4255-96f7-67f662ed9d4a	Excel Basic	Get started with Excel for data entry and calculations.	\N	2000.00	2 Months	beginner	productivity	https://images.unsplash.com/photo-1554224155-6726b3ff858f	t	2025-10-04 19:02:35.418077+00	2025-10-04 19:02:35.418077+00
e8f83a42-bf1c-4085-b929-2933cc3881ad	Excel Advance	Master advanced Excel features for data analysis.	\N	3200.00	3 Months	advanced	productivity	https://images.unsplash.com/photo-1551288049-bebda4e38f71	t	2025-10-04 19:02:35.583997+00	2025-10-04 19:02:35.583997+00
dcbcffa6-814b-40b2-a848-14f85215f787	Scratch Programming	Learn block-based programming using Scratch, designed for kids.	\N	6800.00	3 Months	beginner	kids	https://images.unsplash.com/photo-1627556704302-624fc54c53a6	t	2025-10-04 19:02:35.749316+00	2025-10-04 19:02:35.749316+00
beaa44b8-4118-478d-938e-8cd8d7569696	AutoCAD	Learn 2D and 3D design using AutoCAD software.	\N	6800.00	3 Months	beginner	design	https://images.unsplash.com/photo-1624953587687-df6a1f1f2e8b	t	2025-10-04 19:02:35.921007+00	2025-10-04 19:02:35.921007+00
163869b1-95c7-4038-b45f-474f455e1718	Computer Hardware	Understand computer hardware, assembly, and troubleshooting.	\N	7800.00	3 Months	beginner	hardware	https://images.unsplash.com/photo-1581090700020-2d87919b1d5d	t	2025-10-04 19:02:36.100888+00	2025-10-04 19:02:36.100888+00
0e66c118-f9f4-4301-b1f2-be52b1c9c098	Robotics for Age (8-14)	Introduce young minds to robotics and STEM concepts.	\N	11800.00	3 Months	beginner	robotics	https://images.unsplash.com/photo-1581090700227-4c4f50b6b3d3	t	2025-10-04 19:02:36.265628+00	2025-10-04 19:02:36.265628+00
75c19337-d027-40ca-946a-092a5eefbc3b	Robotics for Age (14+)	Learn advanced robotics with hardware and coding.	\N	19800.00	5 Months	intermediate	robotics	https://images.unsplash.com/photo-1581091215367-59ab6a7c9f1d	t	2025-10-04 19:02:36.425452+00	2025-10-04 19:02:36.425452+00
ac7e9c32-1ec0-46e5-b855-44de6b08115b	CCC	Course on Computer Concepts – a basic government-certified IT course.	\N	8000.00	5 Months	intermediate	computer	https://images.unsplash.com/photo-1547658719-da2b51169166	t	2025-10-04 19:02:36.600865+00	2025-10-04 19:02:36.600865+00
04161c03-edcb-4e7e-87fe-9ea0c84df942	O-Level	Government recognized IT certification with in-depth computer concepts.	\N	12000.00	12 Months	advanced	computer	https://images.unsplash.com/photo-1519389950473-47ba0277781c	t	2025-10-04 19:02:36.764938+00	2025-10-04 19:02:36.764938+00
50646736-2f01-4192-bf44-98de68734016	Flutter Mobile App Development	Flutter full mobile app development course for IOS and Android Both. With Concept of Firebase, Supa base, Camera, Bluetooth Notification Working and so on.	\N	15000.00	5 Months	advanced	mobile	https://unsplash.com/photos/space-gray-iphone-x-9e9PD9blAto	t	2025-11-15 14:09:14.126514+00	2025-11-15 14:09:14.126514+00
\.


--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fees (id, user_id, course_id, enrollment_id, total_amount, installment_amount, installment_number, total_installments, status, payment_type, due_date, paid_date, course_name, course_mode, payment_method, transaction_id, payment_gateway_response, notes, created_at, updated_at) FROM stdin;
191c805a-4c02-44a0-802d-bf3df6e4241b	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	4	6	paid	emi	2025-10-10	2025-11-03 00:24:06.427+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-03 00:23:56.493+00	2025-11-04 05:22:48.89235+00
9df2253d-3f27-4627-b5eb-42fb9f688222	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	3	6	paid	emi	2025-09-10	2025-11-03 00:24:05.563+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-03 00:23:56.493+00	2025-11-04 05:23:01.378301+00
6432c04d-76d8-4e4a-9d08-1ddb6d02cccc	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	2	6	paid	emi	2025-08-10	2025-11-03 00:24:04.826+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-03 00:23:56.493+00	2025-11-04 05:23:22.626775+00
d621be14-f509-4e42-8e0b-c0759efd4b05	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	1	6	paid	emi	2025-07-10	2025-11-03 00:24:03.922+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-03 00:23:56.493+00	2025-11-04 05:23:35.592322+00
68d86b15-fdcf-464b-b16f-ec689aaed098	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	1	7	paid	emi	2025-05-31	2025-11-02 23:28:12.519+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-02 23:27:59.015+00	2025-11-03 11:44:36.587433+00
6f15e8f3-87ed-4c00-b14a-98626e085115	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	4	6	pending	emi	2025-10-15	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-04 11:28:16.694+00	2025-11-04 11:28:16.694+00
e42894e7-604c-473e-ba38-6efdc715efc7	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	5	6	pending	emi	2025-11-15	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-04 11:28:16.694+00	2025-11-04 11:28:16.694+00
0ff90196-6629-44e9-b83a-b0c092113f6c	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	6	6	pending	emi	2025-12-15	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-04 11:28:16.694+00	2025-11-04 11:28:16.694+00
cf638b7c-c8cd-44c0-a3d1-17afc30dae4c	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	5	6	pending	emi	2026-01-16	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-04 11:33:53.791+00	2025-11-04 11:33:53.791+00
63926fd6-cbea-45af-9b96-1a246d84f4cc	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	6	6	pending	emi	2026-02-16	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-04 11:33:53.791+00	2025-11-04 11:33:53.791+00
d3eb44e1-fadb-4f85-88c8-5497bcae1d76	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	2	6	pending	emi	2025-12-02	\N	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-02 23:43:52.332+00	2025-11-02 23:43:52.332+00
28d039fb-a4eb-41c8-bb26-ab2d7367cf9f	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	3	6	pending	emi	2026-01-02	\N	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-02 23:43:52.332+00	2025-11-02 23:43:52.332+00
65086eef-a6c2-4cec-ab27-923a4ca7cdd7	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	4	6	pending	emi	2026-02-02	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-02 23:43:52.332+00	2025-11-02 23:43:52.332+00
e0ffe1b6-d0a3-4881-b1d2-1f948fd3c82a	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	5	6	pending	emi	2026-03-02	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-02 23:43:52.332+00	2025-11-02 23:43:52.332+00
051b3c30-b08c-468a-90f9-47a8e9d10b0f	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	6	6	pending	emi	2026-04-02	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-02 23:43:52.332+00	2025-11-02 23:43:52.332+00
b961933a-ad1f-446e-b18f-c0ed8fb7db17	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	5	6	pending	emi	2025-11-20	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-02 23:36:20.818+00	2025-11-03 12:14:32.415024+00
26b05038-edd5-4a8a-81f8-4acb7383ec48	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	6	6	pending	emi	2025-12-20	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-02 23:36:20.818+00	2025-11-03 12:14:46.209563+00
2da57800-eeef-4f23-a560-2ff9e9c8ed43	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	7	7	pending	emi	2025-12-05	\N	Computer Advance	offline	\N	\N	\N	EMI 7 of 7	2025-11-02 23:27:59.015+00	2025-11-03 12:15:43.413765+00
b53bfa83-fd82-40fe-a2d7-ab2cd143ed55	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	6	6	pending	emi	2025-11-15	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-04 11:37:15.601+00	2025-11-04 11:37:15.601+00
893de191-cbb5-4658-9eca-f33d1a4dbd0f	8611f73c-4a4d-457b-88eb-94198c2a577a	b6824f04-91ad-4fdd-819f-53c7f418d364	8ef53a5a-6a9f-465c-a42c-c136589e8330	3000.00	500.00	1	6	paid	emi	2025-11-02	2025-11-12 11:51:42.528+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-02 23:43:52.332+00	2025-11-12 11:51:47.358131+00
0976b9ac-5baa-4744-a2d8-36665b15f43d	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	3	6	paid	emi	2025-10-02	2025-11-02 23:38:25.609+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-02 23:36:20.818+00	2025-11-12 11:56:12.131041+00
2b0822f0-37a0-42f3-b3c1-0e3a32817ae0	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	4	6	paid	emi	2025-11-02	2025-11-02 23:38:26.425+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-02 23:36:20.818+00	2025-11-12 11:56:27.782289+00
247a49b8-0942-44c6-bd6d-9b5f1757b945	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	2	6	paid	emi	2025-09-02	2025-11-02 23:38:24.769+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-02 23:36:20.818+00	2025-11-12 11:56:55.345031+00
cf8b83d1-edb7-451f-a0ea-5be39770e54d	b16d3257-8404-4fc3-8c2b-8be3e3ea7995	b6824f04-91ad-4fdd-819f-53c7f418d364	c6219956-f195-4c56-b6b7-662ba3c5d7d6	2400.00	400.00	1	6	paid	emi	2025-08-02	2025-11-02 23:38:23.138+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-02 23:36:20.818+00	2025-11-12 11:57:03.961948+00
53247260-3373-4174-b3dd-b9a282d2c842	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	1	6	paid	emi	2025-06-15	2025-11-12 12:04:50.592+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-04 11:37:15.6+00	2025-11-12 12:04:55.529072+00
65190f76-dfc7-4806-8bd8-793aba391969	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	2	6	paid	emi	2025-07-15	2025-11-12 12:04:51.776+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-04 11:37:15.6+00	2025-11-12 12:04:56.595519+00
b426430a-c233-4408-9430-9126ec0ddfc5	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	3	6	paid	emi	2025-08-15	2025-11-12 12:04:52.723+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-04 11:37:15.601+00	2025-11-12 12:04:57.334136+00
82ca05bb-ceca-4df2-86a8-5400c2c18b46	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	4	6	paid	emi	2025-09-15	2025-11-12 12:04:54.034+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-04 11:37:15.601+00	2025-11-12 12:04:58.653658+00
a4ca1617-faba-49f1-8b58-6d40de93e77c	8e993d95-2cab-492b-b3a7-24adbfb75d06	b6824f04-91ad-4fdd-819f-53c7f418d364	21a7c2ab-c851-4e4d-8783-ae74f1959ead	3000.00	500.00	5	6	paid	emi	2025-10-15	2025-11-12 12:06:46.506+00	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-04 11:37:15.601+00	2025-11-12 12:06:51.482472+00
53d03d20-d2df-465b-ae28-743259470057	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	1	6	paid	emi	2025-07-15	2025-11-12 12:23:01.409+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-04 11:28:16.694+00	2025-11-12 12:23:06.544827+00
da5c7a4d-5ff1-4a1d-9577-aae3d253d965	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	2	6	paid	emi	2025-08-15	2025-11-12 12:23:06.003+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-04 11:28:16.694+00	2025-11-12 12:23:10.645305+00
1b5eed7f-dd4a-49be-810f-6cf1720cb43e	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	2	7	paid	emi	2025-06-30	2025-11-02 23:28:14.084+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 7	2025-11-02 23:27:59.015+00	2025-11-12 12:26:27.049902+00
f0a5c372-8db3-41c5-8171-3cc434e22f14	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	3	7	paid	emi	2025-07-30	2025-11-02 23:28:15.176+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 7	2025-11-02 23:27:59.015+00	2025-11-12 12:26:51.645397+00
8b137010-a2c2-44b1-a867-8ed2983092df	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	4	7	paid	emi	2025-08-30	2025-11-02 23:28:19.666+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 7	2025-11-02 23:27:59.015+00	2025-11-12 12:27:55.751857+00
563ebc24-2eaa-4bfb-a3c1-74afbbca6ba2	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	5	7	paid	emi	2025-09-30	2025-11-02 23:28:21.057+00	Computer Advance	offline	\N	\N	\N	EMI 5 of 7	2025-11-02 23:27:59.015+00	2025-11-12 12:28:07.334768+00
6f3397b6-b704-4614-b9c6-2a44f46d51bc	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	2	6	paid	emi	2025-06-06	2025-11-15 14:11:02.603+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 2 of 6	2025-11-15 14:10:50.531+00	2025-11-15 14:11:05.722904+00
4dbbbb81-2c85-4cfe-b356-9daed669ba33	52bf5577-0464-4c44-a6e4-40b9ab2c5536	b6824f04-91ad-4fdd-819f-53c7f418d364	ae50ce1f-0975-41a5-8818-b1a626a876ae	4800.00	800.00	3	6	pending	emi	2025-09-15	2025-11-15 14:22:15.874+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-04 11:28:16.694+00	2025-11-15 14:24:11.277984+00
ef9b7838-dd2d-4be4-a0b2-70f97d842d59	d867bb56-15ec-4b60-87b1-85ea1374fe01	de1ce660-f2cb-4ddb-88dd-2de3329d985f	6b8e9c91-a788-40e1-bc41-01f346c84dd8	4000.00	2000.00	2	2	pending	emi	2025-12-18	\N	Spring Boot Java	offline	\N	\N	\N	\N	2025-11-18 09:33:57.768+00	2025-11-18 09:33:57.768+00
b1a8e85a-9c76-45a9-91db-1803a7e2e85f	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	5	6	pending	emi	2025-10-18	\N	Python Core	offline	\N	\N	\N	EMI 5 of 6	2025-11-19 14:21:28.264+00	2025-11-19 14:21:28.264+00
8e0924a5-23bd-4660-a935-eb3a37fb46ed	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	6	6	pending	emi	2025-11-18	\N	Python Core	offline	\N	\N	\N	EMI 6 of 6	2025-11-19 14:21:28.264+00	2025-11-19 14:21:28.264+00
f08c7b9c-95b5-495d-96ca-fea8f3fbd6a1	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	1	6	paid	emi	2025-06-18	2025-11-19 14:21:56.852+00	Python Core	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-19 14:21:28.264+00	2025-11-19 14:22:00.532381+00
899e3d8d-4ef0-44f6-9858-1b3123b80264	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	3	6	paid	emi	2025-08-18	2025-11-19 14:21:59.112+00	Python Core	offline	\N	\N	\N	EMI 3 of 6	2025-11-19 14:21:28.264+00	2025-11-19 14:22:02.779535+00
c8b0ad66-8ad0-42de-b3f6-7a0ac8987f64	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	2	6	paid	emi	2025-07-18	2025-11-19 14:22:39.08+00	Python Core	offline	\N	\N	\N	EMI 2 of 6	2025-11-19 14:21:28.264+00	2025-11-19 14:22:42.718165+00
65d0b3bc-80cd-4b1a-bf95-effa7a42fa9b	d7dd69b8-326d-48af-9f3e-e107d13a06f9	755b3a85-20b9-41e1-8773-4f232e1f8de5	eb3c7e86-8d3a-4316-beb7-437e92a2ee08	6000.00	1000.00	4	6	paid	emi	2025-09-18	2025-11-19 14:22:56.28+00	Python Core	offline	\N	\N	\N	EMI 4 of 6	2025-11-19 14:21:28.264+00	2025-11-19 14:22:59.92047+00
3146e9e5-2413-417a-a308-b0fe4c5da175	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	10	12	pending	emi	2025-10-20	\N	Computer Master	offline	\N	\N	\N	EMI 10 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:19.968+00
165026a2-2d18-4fb5-818f-015a40c00e18	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	11	12	pending	emi	2025-11-20	\N	Computer Master	offline	\N	\N	\N	EMI 11 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:19.968+00
c32d8a47-3207-460f-9a04-c29f8d5ea40d	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	12	12	pending	emi	2025-12-20	\N	Computer Master	offline	\N	\N	\N	EMI 12 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:19.968+00
f2ee2145-ef6b-4f6e-a64e-73255bd5c89d	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	1	12	paid	emi	2025-01-20	2025-11-03 12:38:26.991+00	Computer Master	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-03 12:38:19.968+00	2025-11-03 12:38:30.350402+00
b843f2bb-2759-42ac-87a0-d1f37bfb8681	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	2	12	paid	emi	2025-02-20	2025-11-03 12:38:27.722+00	Computer Master	offline	\N	\N	\N	EMI 2 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:31.090305+00
d1f8181e-e93b-4c48-a367-95526c718811	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	3	12	paid	emi	2025-03-20	2025-11-03 12:38:28.429+00	Computer Master	offline	\N	\N	\N	EMI 3 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:31.92611+00
d99a50d4-31b1-4df8-9587-6df75dfc527d	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	4	12	paid	emi	2025-04-20	2025-11-03 12:38:29.05+00	Computer Master	offline	\N	\N	\N	EMI 4 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:32.565117+00
3b3f1cdd-5d0d-44da-b977-ae931c952444	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	5	12	paid	emi	2025-05-20	2025-11-03 12:38:29.799+00	Computer Master	offline	\N	\N	\N	EMI 5 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:33.239607+00
fefb8123-67a7-4ae8-9582-07de69913ba7	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	6	12	paid	emi	2025-06-20	2025-11-03 12:38:30.466+00	Computer Master	offline	\N	\N	\N	EMI 6 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:33.840702+00
8b8dec4c-93f3-47fd-a70f-3f7ad31397fb	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	7	12	paid	emi	2025-07-20	2025-11-03 12:38:33.701+00	Computer Master	offline	\N	\N	\N	EMI 7 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:37.178277+00
b72f061a-87e0-4b8a-b3c9-da49a04fa288	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	8	12	paid	emi	2025-08-20	2025-11-03 12:38:34.354+00	Computer Master	offline	\N	\N	\N	EMI 8 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:37.76567+00
4989e366-a989-4fb6-bf57-89aced30f5ff	db3606a5-8e71-4796-94f5-444feff4425b	f037a696-c3d5-4361-88f6-2197346f9356	f07872d5-9c82-4ec7-9837-2976068833dd	6000.00	500.00	9	12	paid	emi	2025-09-20	2025-11-03 12:38:36.517+00	Computer Master	offline	\N	\N	\N	EMI 9 of 12	2025-11-03 12:38:19.968+00	2025-11-03 12:38:39.790366+00
d6007b12-7452-4400-95a0-54f0d0193c00	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	6	6	pending	emi	2025-12-10	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-03 00:23:56.493+00	2025-11-04 05:22:38.463388+00
401b05b4-81c8-4f5f-a197-0553cc3a0316	a76081b4-96dd-4178-901b-e1f4b1c99b55	b6824f04-91ad-4fdd-819f-53c7f418d364	4cdb468f-ebe9-46f5-9b54-8b586e89909a	3300.00	550.00	5	6	paid	emi	2025-11-10	2025-12-04 07:21:54.785+00	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-03 00:23:56.493+00	2025-12-04 07:21:58.625299+00
014e34d2-112c-4c49-b739-6b56ab790261	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	3	6	paid	emi	2025-11-05	2025-12-05 13:44:12.306+00	Tally Advance + GST	online	\N	\N	\N	EMI 3 of 6	2025-11-02 23:03:02.448+00	2025-12-05 13:44:16.708132+00
04fdcb1d-66bb-44f8-bb35-346903bb1f29	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	3	6	pending	emi	2025-11-16	\N	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-04 11:33:53.791+00	2025-11-04 11:33:53.791+00
cd965586-b41b-409d-afff-fd096d5b7277	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	4	6	pending	emi	2025-12-16	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-04 11:33:53.791+00	2025-11-04 11:33:53.791+00
5510caac-d14f-4bdc-8e08-4d618edd6f6a	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	1	6	paid	emi	2025-09-05	2025-11-02 23:03:27.834+00	Tally Advance + GST	online	\N	\N	\N	First EMI payment on enrollment	2025-11-02 23:03:02.448+00	2025-11-11 11:41:34.358659+00
47b8b471-9f4b-4c76-bd80-4bb537e07192	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	1	6	paid	emi	2025-09-16	2025-11-12 11:51:16.767+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-04 11:33:53.791+00	2025-11-12 11:51:22.932182+00
4f2887b7-d015-40a8-8eed-9d8ce33bb48d	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	2	6	paid	emi	2025-10-05	2025-12-05 13:44:22.777+00	Tally Advance + GST	online	\N	\N	\N	EMI 2 of 6	2025-11-02 23:03:02.448+00	2025-12-05 13:44:26.482322+00
f9fd3083-19f2-4174-9c0b-56bbd6a7272b	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	2	6	pending	emi	2025-12-02	\N	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-02 23:42:03.611+00	2025-11-02 23:42:03.611+00
c8622a85-817d-4914-974a-f1faaa144aeb	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	3	6	pending	emi	2026-01-02	\N	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-02 23:42:03.611+00	2025-11-02 23:42:03.611+00
0ec89d2d-ed32-4db2-a687-e599984405b0	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	4	6	pending	emi	2026-02-02	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-02 23:42:03.611+00	2025-11-02 23:42:03.611+00
43f118c1-305f-4c54-a464-eccdd78d8cfb	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	5	6	pending	emi	2026-03-02	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-02 23:42:03.611+00	2025-11-02 23:42:03.611+00
3962023c-2f02-4836-92be-47e22a81e9cc	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	6	6	pending	emi	2026-04-02	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-02 23:42:03.611+00	2025-11-02 23:42:03.611+00
b4a2d36b-1cef-4e88-bf52-1fe0a9521459	fb639c4a-126f-4c16-a51f-66555461f9db	b6824f04-91ad-4fdd-819f-53c7f418d364	615544b6-9aad-401e-897a-407dabb550b5	3000.00	500.00	2	6	paid	emi	2025-10-16	2025-11-12 11:51:17.977+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-04 11:33:53.791+00	2025-11-12 11:51:22.943877+00
efde71f2-795a-47d8-8e3c-302fdd72f3e4	75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	b6824f04-91ad-4fdd-819f-53c7f418d364	4fc6e212-7bc0-4ba5-ab7c-e76782e192be	3000.00	500.00	1	6	paid	emi	2025-11-02	2025-11-12 11:51:55.05+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-02 23:42:03.611+00	2025-11-12 11:51:59.679448+00
415f011d-4b1b-4b85-b743-066b73818fb9	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	4	6	pending	emi	2025-12-05	\N	Tally Advance + GST	online	\N	\N	\N	EMI 4 of 6	2025-11-02 23:03:02.448+00	2025-11-03 12:18:50.932752+00
1781ad02-73a5-4bbc-9fd8-ea87b36efdf9	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	5	6	pending	emi	2026-01-05	\N	Tally Advance + GST	online	\N	\N	\N	EMI 5 of 6	2025-11-02 23:03:02.448+00	2025-11-03 12:19:02.466434+00
3654f650-5eac-40b3-8a71-cf8e12eb92c9	2a83928e-04e9-46cd-a107-0ed1e4629955	2a7631b2-a0a2-421d-983c-b7215d4dfa9b	0215dd93-e5d8-409d-ad4f-d8cb63f2e796	6000.00	1000.00	6	6	pending	emi	2026-02-05	\N	Tally Advance + GST	online	\N	\N	\N	EMI 6 of 6	2025-11-02 23:03:02.448+00	2025-11-03 12:19:12.244991+00
b08ede93-7e12-4d8d-8934-6534127eb812	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	2	6	paid	emi	2025-11-01	2025-11-20 14:39:41.264+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-15 14:46:42.372+00	2025-11-20 14:39:47.058925+00
6ac76c8f-9ee8-490a-a4c3-252f846de514	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	2	6	paid	emi	2025-11-01	2025-12-04 07:21:45.216+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 6	2025-11-15 14:42:50.718+00	2025-12-04 07:21:48.732755+00
f0f97c1b-ba3e-430e-9429-de05325f48f7	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	1	6	pending	emi	2025-12-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	First EMI payment on enrollment	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
aa260026-802e-44e0-9689-e72ec4499dbf	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	2	6	pending	emi	2026-01-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	EMI 2 of 6	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
b035af25-5d9d-465d-aaaa-9e9d7a49a920	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	1	6	paid	emi	2025-05-06	2025-11-15 14:11:01.633+00	Flutter Mobile App Development	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-15 14:10:50.531+00	2025-11-15 14:11:05.048239+00
0d5869d9-a795-440c-a232-56919c1f8e34	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	3	6	paid	emi	2025-07-06	2025-11-15 14:11:03.319+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 3 of 6	2025-11-15 14:10:50.531+00	2025-11-15 14:11:06.4359+00
4fd49e87-e754-4a23-9237-1b865bf58e33	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	4	6	paid	emi	2025-08-06	2025-11-15 14:11:04.039+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 4 of 6	2025-11-15 14:10:50.531+00	2025-11-15 14:11:07.15343+00
c94251e3-39db-4b7a-b1a5-2c1c3bfcb8a6	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	5	6	paid	emi	2025-09-06	2025-11-15 14:11:05.364+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 5 of 6	2025-11-15 14:10:50.531+00	2025-11-15 14:11:08.505448+00
56bbbd5c-b4a4-4acc-b0af-a76deca03f56	d867bb56-15ec-4b60-87b1-85ea1374fe01	50646736-2f01-4192-bf44-98de68734016	c622d203-869f-4973-a724-9b0c165fa12d	12000.00	2000.00	6	6	paid	emi	2025-10-06	2025-11-15 14:11:12.077+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 6 of 6	2025-11-15 14:10:50.531+00	2025-11-15 14:11:15.261999+00
24d2ec06-bf09-45f9-bb03-3a4928ebd1aa	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	3	6	pending	emi	2026-02-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	EMI 3 of 6	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
eb059d6a-5ab4-4374-8f6f-319f9e1a7ae3	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	3	6	pending	emi	2025-12-01	\N	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-15 14:42:50.718+00	2025-11-15 14:42:50.718+00
ca05c2f2-f7e3-47e5-ac56-47fc7c7a07f3	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	4	6	pending	emi	2026-01-01	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-15 14:42:50.718+00	2025-11-15 14:42:50.718+00
067565c3-8d49-4a0d-97d1-6576be04e8f2	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	5	6	pending	emi	2026-02-01	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-15 14:42:50.718+00	2025-11-15 14:42:50.718+00
caca44dd-d05b-4f1d-a81e-0dbe3643d3f8	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	6	6	pending	emi	2026-03-01	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-15 14:42:50.718+00	2025-11-15 14:42:50.718+00
de4d7ca8-405a-454e-a9db-44d91fd1bad4	5abdfcb8-4f97-4607-9d53-5121e88f3057	b6824f04-91ad-4fdd-819f-53c7f418d364	222f148e-8059-463d-a7a4-7dfe50b3f4d9	3600.00	600.00	1	6	paid	emi	2025-10-01	2025-11-15 14:43:04.216+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-15 14:42:50.718+00	2025-11-15 14:43:07.256559+00
d34e81f5-5018-4a3b-a38d-535bfc799201	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	4	6	pending	emi	2026-03-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	EMI 4 of 6	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
b0d4bb6e-f1eb-4e96-88eb-090cfee41191	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	3	6	pending	emi	2025-12-01	\N	Computer Advance	offline	\N	\N	\N	EMI 3 of 6	2025-11-15 14:46:42.372+00	2025-11-15 14:46:42.372+00
2866e374-102e-4441-b1d3-8a235af34a01	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	4	6	pending	emi	2026-01-01	\N	Computer Advance	offline	\N	\N	\N	EMI 4 of 6	2025-11-15 14:46:42.372+00	2025-11-15 14:46:42.372+00
fab1f7e4-5aca-418e-a696-702b8f4252a7	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	5	6	pending	emi	2026-02-01	\N	Computer Advance	offline	\N	\N	\N	EMI 5 of 6	2025-11-15 14:46:42.372+00	2025-11-15 14:46:42.372+00
e3c24f6a-a8c9-4240-9f0c-cebecfcdf95e	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	6	6	pending	emi	2026-03-01	\N	Computer Advance	offline	\N	\N	\N	EMI 6 of 6	2025-11-15 14:46:42.372+00	2025-11-15 14:46:42.372+00
96fc7559-cbb7-4731-bad0-2fa2f882b4f2	24b451f6-51d5-41bf-95d9-0f9a17fc8c95	b6824f04-91ad-4fdd-819f-53c7f418d364	21c59ba0-1833-446e-9ecd-7af0096ee505	3600.00	600.00	1	6	paid	emi	2025-10-01	2025-11-15 14:47:07.814+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-15 14:46:42.372+00	2025-11-15 14:47:10.851374+00
dbdb1085-fa09-404d-9ef6-235ae7cac664	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	5	6	pending	emi	2026-04-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	EMI 5 of 6	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
1d3b8bf9-4b2a-4774-8b8e-82e6ea59db9f	d065f8ff-e313-4d68-a413-feadb20633c1	24176d8b-13a8-4619-95b8-a80ed4027927	eecec5da-d62f-40be-8cb1-ec813f40c240	12000.00	2000.00	6	6	pending	emi	2026-05-04	\N	Digital Marketing Diploma	offline	\N	\N	\N	EMI 6 of 6	2025-12-05 13:39:34.579+00	2025-12-05 13:39:34.579+00
b78cba49-50c7-4c95-85bc-2b1fc70cd3a6	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	3	6	pending	emi	2025-11-27	\N	Python Core	offline	\N	\N	\N	EMI 3 of 6	2025-11-17 14:45:20.4+00	2025-11-17 14:45:20.4+00
1f70de12-a497-46cd-a512-7a200ba18ecc	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	4	6	pending	emi	2025-12-27	\N	Python Core	offline	\N	\N	\N	EMI 4 of 6	2025-11-17 14:45:20.4+00	2025-11-17 14:45:20.4+00
8292bb58-abe2-4844-936d-9bf724ff11f7	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	5	6	pending	emi	2026-01-27	\N	Python Core	offline	\N	\N	\N	EMI 5 of 6	2025-11-17 14:45:20.4+00	2025-11-17 14:45:20.4+00
a033e7b5-0c2d-4697-9963-67f25dbecee5	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	6	6	pending	emi	2026-02-27	\N	Python Core	offline	\N	\N	\N	EMI 6 of 6	2025-11-17 14:45:20.4+00	2025-11-17 14:45:20.4+00
62e90e75-e0a3-4cac-93bd-4a15b759540a	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	ad60b216-2f14-4e75-a6a9-b84183259c13	10000.00	2000.00	4	5	pending	emi	2025-06-06	\N	Flutter Mobile App Development	offline	\N	\N	\N	EMI 4 of 5	2025-11-18 07:03:52.602+00	2025-11-18 07:03:52.602+00
99f1baeb-de0c-4aac-be7c-5208a5118fc2	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	ad60b216-2f14-4e75-a6a9-b84183259c13	10000.00	2000.00	1	5	paid	emi	2025-03-06	2025-11-18 07:04:05.074+00	Flutter Mobile App Development	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-18 07:03:52.602+00	2025-11-18 07:04:08.370839+00
be3994b9-74d4-48e9-82cc-441636148929	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	ad60b216-2f14-4e75-a6a9-b84183259c13	10000.00	2000.00	3	5	paid	emi	2025-05-06	2025-11-18 07:04:06.01+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 3 of 5	2025-11-18 07:03:52.602+00	2025-11-18 07:04:09.305275+00
5c330a06-4938-45b4-8854-89701d61212b	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	ad60b216-2f14-4e75-a6a9-b84183259c13	10000.00	2000.00	5	5	paid	emi	2025-07-06	2025-11-18 07:04:07.27+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 5 of 5	2025-11-18 07:03:52.602+00	2025-11-18 07:04:10.574172+00
feaca520-5171-47a3-b92f-4b9aee756354	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	1	6	paid	emi	2025-09-27	2025-11-18 07:04:09.619+00	Python Core	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-17 14:45:20.4+00	2025-11-18 07:04:12.91711+00
a1ad1506-d2fa-4c0d-b5c4-a55b68654d98	ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	755b3a85-20b9-41e1-8773-4f232e1f8de5	af5e88a1-5478-4431-96f8-bee820c18b20	6000.00	1000.00	2	6	paid	emi	2025-10-27	2025-11-18 07:06:22.249+00	Python Core	offline	\N	\N	\N	EMI 2 of 6	2025-11-17 14:45:20.4+00	2025-11-18 07:06:26.605458+00
4bda2a2f-ea3d-4026-8a0f-adea2e092fee	f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	50646736-2f01-4192-bf44-98de68734016	ad60b216-2f14-4e75-a6a9-b84183259c13	10000.00	2000.00	2	5	paid	emi	2025-04-06	2025-11-18 07:06:40.903+00	Flutter Mobile App Development	offline	\N	\N	\N	EMI 2 of 5	2025-11-18 07:03:52.602+00	2025-11-18 07:06:44.191237+00
ad40fc68-d3e0-4bab-addf-520cc1ad40d0	d867bb56-15ec-4b60-87b1-85ea1374fe01	de1ce660-f2cb-4ddb-88dd-2de3329d985f	6b8e9c91-a788-40e1-bc41-01f346c84dd8	4000.00	2000.00	1	2	paid	emi	2025-11-18	2025-11-18 09:34:15.371+00	Spring Boot Java	offline	\N	\N	\N	\N	2025-11-18 09:33:57.768+00	2025-11-18 09:34:18.562757+00
0635ec43-cd08-429f-a15a-877b43610f3c	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	6	12	paid	emi	2025-11-12	2025-11-18 00:15:14.886+00	Computer Advance	offline	\N	\N	\N	EMI 6 of 12	2025-11-18 00:14:38.26+00	2025-11-18 12:27:04.963832+00
be019d9c-9d56-48b1-9eb3-d20dd4023634	2f092881-a975-492a-aa0b-3e4ac3382547	b6824f04-91ad-4fdd-819f-53c7f418d364	c8e109c9-d905-4852-8a05-dc550a4fe791	3500.00	500.00	6	7	paid	emi	2025-11-05	2025-12-05 13:44:16.085+00	Computer Advance	offline	\N	\N	\N	EMI 6 of 7	2025-11-02 23:27:59.015+00	2025-12-05 13:44:20.63406+00
c9f57790-651a-49ec-a54c-19a20f2cb776	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	8	12	pending	emi	2025-11-04	\N	Computer Advance	offline	\N	\N	\N	EMI 8 of 12	2025-11-18 00:02:27.127+00	2025-11-18 00:02:27.127+00
f699f82b-2062-499d-b753-b3cecc07133e	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	9	12	pending	emi	2025-12-04	\N	Computer Advance	offline	\N	\N	\N	EMI 9 of 12	2025-11-18 00:02:27.127+00	2025-11-18 00:02:27.127+00
38f6ad28-69a6-4141-98dd-eb92f433356f	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	10	12	pending	emi	2026-01-04	\N	Computer Advance	offline	\N	\N	\N	EMI 10 of 12	2025-11-18 00:02:27.127+00	2025-11-18 00:02:27.127+00
8b9baa39-1266-4941-83c0-8bcb0a65ccc2	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	11	12	pending	emi	2026-02-04	\N	Computer Advance	offline	\N	\N	\N	EMI 11 of 12	2025-11-18 00:02:27.127+00	2025-11-18 00:02:27.127+00
c07cdfd2-5496-4ea8-8ad5-f1db2df0dc8a	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	12	12	pending	emi	2026-03-04	\N	Computer Advance	offline	\N	\N	\N	EMI 12 of 12	2025-11-18 00:02:27.127+00	2025-11-18 00:02:27.127+00
bf388fdd-ced3-4977-83b5-0320a22ef13d	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	1	12	paid	emi	2025-04-04	2025-11-18 00:02:38.867+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-18 00:02:27.127+00	2025-11-18 12:14:28.864981+00
02585a41-4ed9-46f1-8f2c-cd4f59dfa4a3	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	2	12	paid	emi	2025-05-04	2025-11-18 00:03:09.479+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:14:59.540208+00
02fc4029-c622-472a-a8d0-86a24ae72d82	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	3	12	paid	emi	2025-06-04	2025-11-18 00:03:11.648+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:15:01.705028+00
f7e7fcf1-bb6f-49c5-9aec-9b25a20b26a6	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	4	12	paid	emi	2025-07-04	2025-11-18 00:03:13.102+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:15:03.137796+00
8c2a35e1-7930-488b-8fa1-87ea1a1743f6	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	5	12	paid	emi	2025-08-04	2025-11-18 00:03:29.567+00	Computer Advance	offline	\N	\N	\N	EMI 5 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:15:19.646439+00
a8087c84-776b-43b6-b43d-c631eca47ad8	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	6	12	paid	emi	2025-09-04	2025-11-18 00:03:31.066+00	Computer Advance	offline	\N	\N	\N	EMI 6 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:15:21.137721+00
f7754ece-0d0b-4790-9d1c-09aa94f37b45	6468285f-750e-4c25-a95f-52269c3b0c08	b6824f04-91ad-4fdd-819f-53c7f418d364	e659507d-22bf-426a-aba5-16e4dc407410	7200.00	600.00	7	12	paid	emi	2025-10-04	2025-11-18 00:03:34.787+00	Computer Advance	offline	\N	\N	\N	EMI 7 of 12	2025-11-18 00:02:27.127+00	2025-11-18 12:15:24.819374+00
723e56c4-41fe-44dd-ac40-ebaec057db86	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	7	12	pending	emi	2025-12-12	\N	Computer Advance	offline	\N	\N	\N	EMI 7 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
8a1d076f-70ea-42ee-92fa-2351666fe48d	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	8	12	pending	emi	2026-01-12	\N	Computer Advance	offline	\N	\N	\N	EMI 8 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
593a8049-069f-4386-a2da-50222edcb0fe	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	9	12	pending	emi	2026-02-12	\N	Computer Advance	offline	\N	\N	\N	EMI 9 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
8d7f4fdc-4959-4b74-afa2-43ff399921e6	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	10	12	pending	emi	2026-03-12	\N	Computer Advance	offline	\N	\N	\N	EMI 10 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
0cf89af3-ecaf-46c5-bbee-be20b1657231	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	11	12	pending	emi	2026-04-12	\N	Computer Advance	offline	\N	\N	\N	EMI 11 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
e58f0927-211c-4c1b-9a0b-fd5a2ed204df	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	12	12	pending	emi	2026-05-12	\N	Computer Advance	offline	\N	\N	\N	EMI 12 of 12	2025-11-18 00:14:38.26+00	2025-11-18 00:14:38.26+00
5a5019c9-c285-4428-8775-a8d33f6becf2	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	1	12	paid	emi	2025-06-12	2025-11-18 00:14:49.061+00	Computer Advance	offline	\N	\N	\N	First EMI payment on enrollment	2025-11-18 00:14:38.26+00	2025-11-18 12:26:39.077552+00
e004fd52-60cb-4ef2-b2eb-d3692e0bddc7	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	2	12	paid	emi	2025-07-12	2025-11-18 00:14:49.813+00	Computer Advance	offline	\N	\N	\N	EMI 2 of 12	2025-11-18 00:14:38.26+00	2025-11-18 12:26:39.857353+00
7cfa0ab7-2fc0-4e0b-9f6c-5ce8359fe8f5	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	3	12	paid	emi	2025-08-12	2025-11-18 00:14:50.477+00	Computer Advance	offline	\N	\N	\N	EMI 3 of 12	2025-11-18 00:14:38.26+00	2025-11-18 12:26:40.510512+00
58b1b993-6e35-4e83-94fe-731d49221fed	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	4	12	paid	emi	2025-09-12	2025-11-18 00:14:54.445+00	Computer Advance	offline	\N	\N	\N	EMI 4 of 12	2025-11-18 00:14:38.26+00	2025-11-18 12:26:44.457523+00
77c0189b-b9d5-4d08-9784-91f54fa3e84e	197c89e3-707b-447f-8c09-4928a1b7c22c	b6824f04-91ad-4fdd-819f-53c7f418d364	d8607c6f-3165-476b-9a42-dbd63b8e398a	3600.00	300.00	5	12	paid	emi	2025-10-12	2025-11-18 00:15:14.084+00	Computer Advance	offline	\N	\N	\N	EMI 5 of 12	2025-11-18 00:14:38.26+00	2025-11-18 12:27:04.118546+00
\.


--
-- Data for Name: otps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otps (id, created_at, phone, otp) FROM stdin;
1	2025-10-15 06:20:47.784+00	9808125085	917835
3	2025-11-03 11:18:42.87793+00	8218926428	761508
4	2025-11-04 12:08:22.805+00	9675394257	709013
5	2025-11-15 14:50:26.148+00	8394909542	414688
6	2025-11-17 11:26:03.455104+00	9690332291	942524
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, user_id, course_id, enrollment_id, amount, currency, payment_status, payment_method, payment_type, gateway_payment_id, gateway_order_id, gateway_transaction_id, instamojo_payment_id, instamojo_payment_request_id, instamojo_longurl, instamojo_shorturl, buyer_name, email, phone, payment_date, created_at, updated_at, ip_address, user_agent, payment_request_id, provider, purpose, paid_at, verified_at, verified_source, raw_webhook, raw_request) FROM stdin;
11521819-5671-43e8-840d-e5641aaeaea7	\N	\N	\N	10.00	INR	completed	\N	course_fee	001faecfbc924bc2886a64873fbae3f3	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-12 10:16:19.325872+00	2025-10-12 10:49:43.007776+00	\N	\N	001faecfbc924bc2886a64873fbae3f3	instamojo	Course Enrollment: Robotics for Age (14+) (ID75c19337-d027-40ca-946a-092a5eefbc3b)	2025-10-12 10:49:37.228+00	2025-10-12 10:49:37.228+00	instamojo_redirect	\N	\N
6cba2657-ae30-491f-8e60-3265e1d6d679	\N	\N	\N	10.00	INR	completed	\N	course_fee	d9977e393bec453d85207a521f91c576	\N	\N	\N	\N	\N	\N	shubham	ganwanishubham1@gmail.com	+918273651634	\N	2025-10-12 12:30:12.60238+00	2025-10-12 12:31:00.155935+00	\N	\N	d9977e393bec453d85207a521f91c576	instamojo	Course Enrollment: O-Level (ID04161c03-edcb-4e7e-87fe-9ea0c84df942)	2025-10-12 12:30:58.865+00	2025-10-12 12:30:58.866+00	instamojo_redirect	\N	\N
7632f5e6-291a-48b4-a7c4-80cbb39351f1	\N	\N	\N	10.00	INR	pending	\N	course_fee	b38cc0ceaf3f48169312e1e9af33281b	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-12 11:17:23.175393+00	2025-10-12 11:29:32.663248+00	\N	\N	b38cc0ceaf3f48169312e1e9af33281b	instamojo	Course Enrollment: Data Science (ID576b0e74-61d0-4272-96ca-ef55fb887f31)	2025-10-12 11:28:15.35+00	2025-10-12 11:28:15.35+00	instamojo_redirect	\N	\N
1acea0d5-a77b-4253-ac85-6c22959659f4	\N	\N	\N	10.00	INR	completed	\N	course_fee	35d5adad7a9b4561af0859cd9b5574e4	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-12 11:04:03.532774+00	2025-10-12 11:30:18.785263+00	\N	\N	35d5adad7a9b4561af0859cd9b5574e4	instamojo	Course Enrollment: Excel Basic (ID702aedd5-45ed-4255-96f7-67f662ed9d4a)	2025-10-12 11:30:13.103+00	2025-10-12 11:30:13.103+00	instamojo_redirect	\N	\N
8eff1d75-d520-44df-b16d-0419ab0f85c2	\N	\N	\N	10.00	INR	completed	\N	course_fee	c588eb345c96444bb97e69e4b5c0ae73	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-12 11:30:53.608925+00	2025-10-12 11:31:37.215203+00	\N	\N	c588eb345c96444bb97e69e4b5c0ae73	instamojo	Course Enrollment: Robotics for Age (14+) (ID75c19337-d027-40ca-946a-092a5eefbc3b)	2025-10-12 11:31:31.557+00	2025-10-12 11:31:31.557+00	instamojo_redirect	\N	\N
aeba424f-ef20-4ff5-bc31-390cef173cc9	\N	\N	\N	10.00	INR	completed	\N	course_fee	783471710c6d4ab4ae55d573eedadcea	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-12 11:33:53.848893+00	2025-10-12 11:34:21.279299+00	\N	\N	783471710c6d4ab4ae55d573eedadcea	instamojo	Course Enrollment: Data Science (ID576b0e74-61d0-4272-96ca-ef55fb887f31)	2025-10-12 11:34:15.546+00	2025-10-12 11:34:15.546+00	instamojo_redirect	\N	\N
38e365af-a33c-4819-b8cf-1f904193d540	\N	\N	\N	10.00	INR	completed	\N	course_fee	fa67ef092ac046ca8a8d5aa706b664a4	\N	\N	\N	\N	\N	\N	Shivi jaswal	Shivijaswal61@gmail.com	+919149290463	\N	2025-10-12 12:20:26.054602+00	2025-10-12 12:22:00.607077+00	\N	\N	fa67ef092ac046ca8a8d5aa706b664a4	instamojo	Course Enrollment: O-Level (ID04161c03-edcb-4e7e-87fe-9ea0c84df942)	2025-10-12 12:21:58.458+00	2025-10-12 12:21:58.459+00	instamojo_redirect	\N	\N
a3a81c4c-72b9-4cdc-adfa-d7c0d04d32f4	\N	\N	\N	1333.00	INR	pending	\N	course_fee	5ba35368b57944e381f16a1a5da02516	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-14 12:49:00.933986+00	2025-10-14 12:49:00.933986+00	\N	\N	5ba35368b57944e381f16a1a5da02516	instamojo	Course Enrollment: CCC (IDac7e9c32-1ec0-46e5-b855-44de6b08115b)	\N	\N	create	\N	\N
76664a81-daf6-448d-b66e-bae6e56ebbe8	\N	\N	\N	1333.00	INR	pending	\N	course_fee	ff349fc5eef64848bf0e02b98309f82b	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-14 12:54:00.944169+00	2025-10-14 12:54:00.944169+00	\N	\N	ff349fc5eef64848bf0e02b98309f82b	instamojo	Course Enrollment: CCC (IDac7e9c32-1ec0-46e5-b855-44de6b08115b)	\N	\N	create	\N	\N
a672ebbf-93c1-4ad3-97ad-8b78767881c4	\N	\N	\N	3300.00	INR	pending	\N	course_fee	6e6bfc4c3a4846558d8bdf38712fb706	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-14 12:54:35.252501+00	2025-10-14 12:54:35.252501+00	\N	\N	6e6bfc4c3a4846558d8bdf38712fb706	instamojo	Course Enrollment: Robotics for Age (14+) (ID75c19337-d027-40ca-946a-092a5eefbc3b)	\N	\N	create	\N	\N
55e4e4c9-9dd2-41d4-bb08-e9a14c95ee2a	\N	\N	\N	1334.00	INR	pending	\N	course_fee	140c2559ba154c5f8df83aaff807bd0d	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-15 06:38:04.837995+00	2025-10-15 06:38:04.837995+00	\N	\N	140c2559ba154c5f8df83aaff807bd0d	instamojo	Fee Payment: undefined	\N	\N	create	\N	\N
cec7a8da-a34b-4f9d-a27c-e847fa9cb32d	\N	\N	\N	1334.00	INR	completed	\N	course_fee	6a1721bbdee841479e6265d94d88f602	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-15 06:37:51.773631+00	2025-10-15 06:42:13.942746+00	\N	\N	6a1721bbdee841479e6265d94d88f602	instamojo	Fee Payment: undefined	2025-10-15 06:42:11.01+00	2025-10-15 06:42:11.01+00	instamojo_redirect	\N	\N
dee994b4-bb28-4e2e-8527-2bf1000306ff	\N	\N	\N	9800.00	INR	completed	\N	course_fee	de450aa6aaee4277a33a8f7fa29ccbd6	\N	\N	\N	\N	\N	\N	sumukh	abcd@gmail.com	+919808125085	\N	2025-10-15 06:42:40.08827+00	2025-10-15 06:44:15.895405+00	\N	\N	de450aa6aaee4277a33a8f7fa29ccbd6	instamojo	Fee Payment: undefined	2025-10-15 06:44:12.929+00	2025-10-15 06:44:12.929+00	instamojo_redirect	\N	\N
700c51ce-91b3-4f92-899e-796b2ba834b4	\N	\N	\N	600.00	INR	pending	\N	course_fee	c685d340d2464579ad5068f5e2313ffe	\N	\N	\N	\N	\N	\N	Aman	amandiwakar06150615@gmail.com	+918394909542	\N	2025-11-15 14:51:32.990786+00	2025-11-15 14:51:32.990786+00	\N	\N	c685d340d2464579ad5068f5e2313ffe	instamojo	Fee Payment: undefined	\N	\N	create	\N	\N
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, email, full_name, phone_number, date_of_birth, role, avatar_url, created_at, updated_at) FROM stdin;
2a83928e-04e9-46cd-a107-0ed1e4629955	aainakarotiya@gmail.com	Aaina Karotiya	8218926428	2007-05-16	student	\N	2025-11-02 23:03:00.591+00	2025-11-02 23:03:00.591+00
2f092881-a975-492a-aa0b-3e4ac3382547	hrdinesh793@gmail.com	Himanshi Sagar	8218847317	2008-12-28	student	\N	2025-11-02 23:27:58.295+00	2025-11-02 23:27:58.295+00
b16d3257-8404-4fc3-8c2b-8be3e3ea7995	adityabaghel57@gmail.com	Aditya Kumar	7668493546	2013-08-19	student	\N	2025-11-02 23:36:20.549+00	2025-11-02 23:36:20.55+00
75d4e6ac-b18e-4bcc-a744-e4f51d0c5b38	bhoomi55677@gmail.com	Bhoomi Sagar	9259108434	2004-05-25	student	\N	2025-11-02 23:42:02.816+00	2025-11-02 23:42:02.816+00
8611f73c-4a4d-457b-88eb-94198c2a577a	missnaina76@gmail.com	Naina	9412531391	2006-03-10	student	\N	2025-11-02 23:43:51.952+00	2025-11-02 23:43:51.952+00
a76081b4-96dd-4178-901b-e1f4b1c99b55	anmolbansal22309@gmail.com	Anmol Bansal	9458503901	2008-10-31	student	\N	2025-11-03 00:23:55.941+00	2025-11-03 00:23:55.941+00
db3606a5-8e71-4796-94f5-444feff4425b	kumarkaran46617@gmail.com	Karan	7453967545	2005-01-01	student	\N	2025-11-03 12:38:19.552+00	2025-11-03 12:38:19.552+00
52bf5577-0464-4c44-a6e4-40b9ab2c5536	bansalanurag272@gmail.com	Anurag Bansal	8218061479	2007-07-31	student	\N	2025-11-04 11:28:16.254+00	2025-11-04 11:28:16.254+00
fb639c4a-126f-4c16-a51f-66555461f9db	av8154236@gmail.com	Arun verma	6397360861	2007-08-10	student	\N	2025-11-04 11:33:53.346+00	2025-11-04 11:33:53.346+00
8e993d95-2cab-492b-b3a7-24adbfb75d06	tgarg8724@gmail.com	Tushar Garg	9675394257	2005-06-11	student	\N	2025-11-04 11:37:15.321+00	2025-11-04 11:37:15.321+00
d867bb56-15ec-4b60-87b1-85ea1374fe01	khandelwalkartik3451@gmail.com	Kartik Khandelwal	9284253307	2005-03-30	student	\N	2025-11-15 14:10:50.179+00	2025-11-15 14:10:50.179+00
24b451f6-51d5-41bf-95d9-0f9a17fc8c95	amandiwakar06150615@gmail.com	Aman	8394909542	2007-07-12	student	\N	2025-11-15 14:46:42.089+00	2025-11-15 14:46:42.089+00
5abdfcb8-4f97-4607-9d53-5121e88f3057	shakyaankit27333@gmail.com	Ankit Shakya	9690332291	2006-01-01	student	\N	2025-11-15 14:42:50.379+00	2025-11-17 11:27:30.285343+00
ad15a1fc-7fa2-4ff1-ab2d-79c4001c4d32	rehankhan817142@gmail.com	Rehan Khan	8630544689	2008-01-31	student	\N	2025-11-17 14:45:19.581+00	2025-11-17 14:45:19.581+00
f3dd92ff-f0ac-43a4-84a5-9b02f65d95c0	amankhichi24@gmail.com	Aman Kichi	8595626824	2001-09-09	student	\N	2025-11-18 07:03:52.257+00	2025-11-18 07:03:52.257+00
6468285f-750e-4c25-a95f-52269c3b0c08	shivijaswal61@gmail.com	Shivi Jaswal 	9149290463	2007-03-17	student	\N	2025-11-18 00:02:26.668+00	2025-11-18 00:02:26.668+00
197c89e3-707b-447f-8c09-4928a1b7c22c	rishav09112010@gmail.com	Rishav	8384899391	2010-11-09	student	\N	2025-11-18 00:14:37.861+00	2025-11-18 00:14:37.862+00
d7dd69b8-326d-48af-9f3e-e107d13a06f9	tomarharshal363@gmail.com	Harshal Tomar	6230940648	2007-08-11	student	\N	2025-11-19 14:21:27.785+00	2025-11-19 14:21:27.785+00
d065f8ff-e313-4d68-a413-feadb20633c1	rudranshgupta205@gmail.com	Rudransh Kumar Gupta	7983190920	2006-06-08	student	\N	2025-12-05 13:39:34.091+00	2025-12-05 13:39:34.091+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-09-30 15:08:56
20211116045059	2025-09-30 15:08:57
20211116050929	2025-09-30 15:08:58
20211116051442	2025-09-30 15:08:58
20211116212300	2025-09-30 15:08:59
20211116213355	2025-09-30 15:09:00
20211116213934	2025-09-30 15:09:00
20211116214523	2025-09-30 15:09:01
20211122062447	2025-09-30 15:09:02
20211124070109	2025-09-30 15:09:03
20211202204204	2025-09-30 15:09:03
20211202204605	2025-09-30 15:09:04
20211210212804	2025-09-30 15:09:06
20211228014915	2025-09-30 15:09:07
20220107221237	2025-09-30 15:09:07
20220228202821	2025-09-30 15:09:08
20220312004840	2025-09-30 15:09:08
20220603231003	2025-09-30 15:09:09
20220603232444	2025-09-30 15:09:10
20220615214548	2025-09-30 15:09:11
20220712093339	2025-09-30 15:09:11
20220908172859	2025-09-30 15:09:12
20220916233421	2025-09-30 15:09:13
20230119133233	2025-09-30 15:09:13
20230128025114	2025-09-30 15:09:14
20230128025212	2025-09-30 15:09:15
20230227211149	2025-09-30 15:09:15
20230228184745	2025-09-30 15:09:16
20230308225145	2025-09-30 15:09:17
20230328144023	2025-09-30 15:09:17
20231018144023	2025-09-30 15:09:18
20231204144023	2025-09-30 15:09:19
20231204144024	2025-09-30 15:09:20
20231204144025	2025-09-30 15:09:20
20240108234812	2025-09-30 15:09:21
20240109165339	2025-09-30 15:09:21
20240227174441	2025-09-30 15:09:23
20240311171622	2025-09-30 15:09:23
20240321100241	2025-09-30 15:09:25
20240401105812	2025-09-30 15:09:27
20240418121054	2025-09-30 15:09:27
20240523004032	2025-09-30 15:09:30
20240618124746	2025-09-30 15:09:30
20240801235015	2025-09-30 15:09:31
20240805133720	2025-09-30 15:09:31
20240827160934	2025-09-30 15:09:32
20240919163303	2025-09-30 15:09:33
20240919163305	2025-09-30 15:09:34
20241019105805	2025-09-30 15:09:34
20241030150047	2025-09-30 15:09:37
20241108114728	2025-09-30 15:09:37
20241121104152	2025-09-30 15:09:38
20241130184212	2025-09-30 15:09:39
20241220035512	2025-09-30 15:09:39
20241220123912	2025-09-30 15:09:40
20241224161212	2025-09-30 15:09:41
20250107150512	2025-09-30 15:09:41
20250110162412	2025-09-30 15:09:42
20250123174212	2025-09-30 15:09:42
20250128220012	2025-09-30 15:09:43
20250506224012	2025-09-30 15:09:44
20250523164012	2025-09-30 15:09:44
20250714121412	2025-09-30 15:09:45
20250905041441	2025-09-30 15:09:45
20251103001201	2025-11-15 13:08:12
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-09-30 15:08:53.718288
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-09-30 15:08:53.758411
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-09-30 15:08:53.773742
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-09-30 15:08:53.870383
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-09-30 15:08:54.066458
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-09-30 15:08:54.070281
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-09-30 15:08:54.075693
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-09-30 15:08:54.080732
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-09-30 15:08:54.08388
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-09-30 15:08:54.087316
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-09-30 15:08:54.091154
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-09-30 15:08:54.099585
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-09-30 15:08:54.112414
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-09-30 15:08:54.115856
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-09-30 15:08:54.119398
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-09-30 15:08:54.155649
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-09-30 15:08:54.159385
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-09-30 15:08:54.162993
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-09-30 15:08:54.171177
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-09-30 15:08:54.184661
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-09-30 15:08:54.190781
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-09-30 15:08:54.198911
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-09-30 15:08:54.224384
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-09-30 15:08:54.243539
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-09-30 15:08:54.248242
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-09-30 15:08:54.252074
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-01 06:58:10.426518
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-01 06:58:10.472788
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-01 06:58:10.482002
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-01 06:58:10.489833
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-01 06:58:10.49465
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-01 06:58:10.501286
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-01 06:58:10.509081
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-01 06:58:10.515926
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-01 06:58:10.517512
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-01 06:58:10.523258
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-01 06:58:10.527197
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-01 06:58:10.537264
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-01 06:58:10.541487
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-01 06:58:10.554317
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-01 06:58:10.559985
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-01 06:58:10.568974
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-01 06:58:10.57287
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-01 06:58:10.578343
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-06 12:14:40.594835
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-06 12:14:40.625346
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-06 12:14:40.717921
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-06 12:14:40.722793
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-12-06 12:14:40.726185
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
20251004183954	\N	remote_commit
20251004184552	{"-- =============================================\n-- TechAddaa Institute - Supabase Database Schema\n-- =============================================\n\n-- Enable Row Level Security (RLS) for all tables\n-- This ensures users can only access their own data\n\n-- =============================================\n-- 1. User Profiles Table\n-- =============================================\n-- This extends the default auth.users table with additional profile information\nCREATE TABLE IF NOT EXISTS public.user_profiles (\n  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  full_name TEXT,\n  phone_number TEXT,\n  date_of_birth DATE,\n  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),\n  avatar_url TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n)","-- Enable RLS on user_profiles\nALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY","-- Policy: Users can view and update their own profile\nCREATE POLICY \\"Users can view own profile\\" ON public.user_profiles\n  FOR SELECT USING (auth.uid() = id)","CREATE POLICY \\"Users can update own profile\\" ON public.user_profiles\n  FOR UPDATE USING (auth.uid() = id)","CREATE POLICY \\"Users can insert own profile\\" ON public.user_profiles\n  FOR INSERT WITH CHECK (auth.uid() = id)","-- =============================================\n-- 2. Courses Table\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.courses (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  title TEXT NOT NULL,\n  description TEXT,\n  instructor_id UUID REFERENCES public.user_profiles(id),\n  price DECIMAL(10,2) DEFAULT 0,\n  duration TEXT,\n  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),\n  category TEXT,\n  image_url TEXT,\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n)","-- Enable RLS on courses\nALTER TABLE public.courses ENABLE ROW LEVEL SECURITY","-- Policy: Anyone can view active courses\nCREATE POLICY \\"Anyone can view active courses\\" ON public.courses\n  FOR SELECT USING (is_active = true)","-- Policy: Only instructors and admins can manage courses\nCREATE POLICY \\"Instructors can manage own courses\\" ON public.courses\n  FOR ALL USING (\n    auth.uid() = instructor_id OR \n    EXISTS (\n      SELECT 1 FROM public.user_profiles \n      WHERE id = auth.uid() AND role IN ('admin', 'instructor')\n    )\n  )","-- =============================================\n-- 3. Course Enrollments Table\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.course_enrollments (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,\n  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,\n  enrollment_mode TEXT DEFAULT 'online' CHECK (enrollment_mode IN ('online', 'offline')),\n  price_paid DECIMAL(10,2),\n  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  completion_date TIMESTAMP WITH TIME ZONE,\n  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),\n  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),\n  completed_lessons INTEGER DEFAULT 0,\n  grade TEXT,\n  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  UNIQUE(user_id, course_id)\n)","-- Enable RLS on course_enrollments\nALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY","-- Policy: Users can view their own enrollments\nCREATE POLICY \\"Users can view own enrollments\\" ON public.course_enrollments\n  FOR SELECT USING (auth.uid() = user_id)","-- Policy: Users can enroll themselves\nCREATE POLICY \\"Users can enroll themselves\\" ON public.course_enrollments\n  FOR INSERT WITH CHECK (auth.uid() = user_id)","-- Policy: Users can update their own enrollment progress\nCREATE POLICY \\"Users can update own enrollment\\" ON public.course_enrollments\n  FOR UPDATE USING (auth.uid() = user_id)","-- =============================================\n-- 4. Certificates Table\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.certificates (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,\n  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,\n  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,\n  certificate_number TEXT UNIQUE NOT NULL,\n  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  grade TEXT,\n  instructor_name TEXT,\n  course_name TEXT NOT NULL,\n  course_duration TEXT,\n  completion_date TIMESTAMP WITH TIME ZONE,\n  certificate_url TEXT,\n  is_valid BOOLEAN DEFAULT true,\n  UNIQUE(user_id, course_id)\n)","-- Enable RLS on certificates\nALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY","-- Policy: Users can view their own certificates\nCREATE POLICY \\"Users can view own certificates\\" ON public.certificates\n  FOR SELECT USING (auth.uid() = user_id)","-- Policy: Only system can create certificates (through functions)\nCREATE POLICY \\"System can create certificates\\" ON public.certificates\n  FOR INSERT WITH CHECK (true)","-- =============================================\n-- 5. Certificate Downloads Log Table\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.certificate_downloads (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,\n  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,\n  phone_number TEXT NOT NULL,\n  date_of_birth DATE NOT NULL,\n  download_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  ip_address INET,\n  user_agent TEXT\n)","-- Enable RLS on certificate_downloads\nALTER TABLE public.certificate_downloads ENABLE ROW LEVEL SECURITY","-- Policy: Users can view their own download history\nCREATE POLICY \\"Users can view own downloads\\" ON public.certificate_downloads\n  FOR SELECT USING (auth.uid() = user_id)","-- =============================================\n-- 6. Fees Table\n-- =============================================\n-- This table manages fee records for course enrollments with support for full payment and EMI options\nCREATE TABLE IF NOT EXISTS public.fees (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,\n  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,\n  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,\n  \n  -- Payment details\n  total_amount DECIMAL(10,2) NOT NULL,\n  installment_amount DECIMAL(10,2) NOT NULL,\n  installment_number INTEGER NOT NULL DEFAULT 1,\n  total_installments INTEGER NOT NULL DEFAULT 1,\n  \n  -- Payment status\n  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),\n  payment_type VARCHAR(20) NOT NULL DEFAULT 'full' CHECK (payment_type IN ('full', 'emi')),\n  \n  -- Due dates\n  due_date DATE NOT NULL,\n  paid_date TIMESTAMP WITH TIME ZONE,\n  \n  -- Course information (denormalized for easier queries)\n  course_name VARCHAR(255) NOT NULL,\n  course_mode VARCHAR(20) NOT NULL DEFAULT 'online' CHECK (course_mode IN ('online', 'offline')),\n  \n  -- Payment tracking\n  payment_method VARCHAR(50), -- 'card', 'upi', 'bank_transfer', etc.\n  transaction_id VARCHAR(100),\n  payment_gateway_response JSONB,\n  \n  -- Metadata\n  notes TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  \n  -- Constraints\n  CONSTRAINT unique_user_course_installment UNIQUE (user_id, course_id, installment_number)\n)","-- Enable RLS on fees\nALTER TABLE public.fees ENABLE ROW LEVEL SECURITY","-- Policy: Users can view their own fees\nCREATE POLICY \\"Users can view own fees\\" ON public.fees\n  FOR SELECT USING (auth.uid() = user_id)","-- Policy: Users can insert their own fees\nCREATE POLICY \\"Users can insert own fees\\" ON public.fees\n  FOR INSERT WITH CHECK (auth.uid() = user_id)","-- Policy: Users can update their own fees\nCREATE POLICY \\"Users can update own fees\\" ON public.fees\n  FOR UPDATE USING (auth.uid() = user_id)","-- Policy: Admins can manage all fees\nCREATE POLICY \\"Admins can manage all fees\\" ON public.fees\n  FOR ALL USING (\n    EXISTS (\n      SELECT 1 FROM public.user_profiles \n      WHERE id = auth.uid() AND role = 'admin'\n    )\n  )","-- =============================================\n-- 7. Functions and Triggers\n-- =============================================\n\n-- Function to automatically create user profile when user signs up\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.user_profiles (id, email, full_name)\n  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Trigger to call the function when a new user is created\nDROP TRIGGER IF EXISTS on_auth_user_created ON auth.users","CREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()","-- Function to update updated_at timestamp\nCREATE OR REPLACE FUNCTION public.handle_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Add updated_at triggers to relevant tables\nDROP TRIGGER IF EXISTS handle_updated_at ON public.user_profiles","CREATE TRIGGER handle_updated_at\n  BEFORE UPDATE ON public.user_profiles\n  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()","DROP TRIGGER IF EXISTS handle_updated_at ON public.courses","CREATE TRIGGER handle_updated_at\n  BEFORE UPDATE ON public.courses\n  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()","DROP TRIGGER IF EXISTS handle_updated_at ON public.course_enrollments","CREATE TRIGGER handle_updated_at\n  BEFORE UPDATE ON public.course_enrollments\n  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()","DROP TRIGGER IF EXISTS handle_updated_at ON public.fees","CREATE TRIGGER handle_updated_at\n  BEFORE UPDATE ON public.fees\n  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()","-- Function to generate certificate number\nCREATE OR REPLACE FUNCTION public.generate_certificate_number()\nRETURNS TEXT AS $$\nBEGIN\n  RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');\nEND;\n$$ LANGUAGE plpgsql","-- Function to create certificate when course is completed\nCREATE OR REPLACE FUNCTION public.create_certificate(\n  p_user_id UUID,\n  p_course_id UUID,\n  p_enrollment_id UUID,\n  p_grade TEXT DEFAULT 'A'\n)\nRETURNS UUID AS $$\nDECLARE\n  v_certificate_id UUID;\n  v_course_record RECORD;\n  v_user_record RECORD;\n  v_instructor_name TEXT;\nBEGIN\n  -- Get course details\n  SELECT * INTO v_course_record FROM public.courses WHERE id = p_course_id;\n  \n  -- Get user details\n  SELECT * INTO v_user_record FROM public.user_profiles WHERE id = p_user_id;\n  \n  -- Get instructor name\n  SELECT full_name INTO v_instructor_name \n  FROM public.user_profiles \n  WHERE id = v_course_record.instructor_id;\n  \n  -- Create certificate\n  INSERT INTO public.certificates (\n    user_id,\n    course_id,\n    enrollment_id,\n    certificate_number,\n    grade,\n    instructor_name,\n    course_name,\n    course_duration,\n    completion_date\n  ) VALUES (\n    p_user_id,\n    p_course_id,\n    p_enrollment_id,\n    public.generate_certificate_number(),\n    p_grade,\n    COALESCE(v_instructor_name, 'TechAddaa Institute'),\n    v_course_record.title,\n    v_course_record.duration,\n    NOW()\n  ) RETURNING id INTO v_certificate_id;\n  \n  RETURN v_certificate_id;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- =============================================\n-- 7. Sample Data (Optional)\n-- =============================================\n\n-- Insert sample courses (you can modify or remove this)\nINSERT INTO public.courses (title, description, price, duration, level, category, image_url) VALUES\n('React.js Fundamentals', 'Learn the basics of React.js development', 99.99, '8 weeks', 'beginner', 'Web Development', '/images/react-course.jpg'),\n('Advanced JavaScript', 'Master advanced JavaScript concepts', 149.99, '12 weeks', 'advanced', 'Programming', '/images/js-course.jpg'),\n('Python for Data Science', 'Learn Python programming for data analysis', 199.99, '16 weeks', 'intermediate', 'Data Science', '/images/python-course.jpg'),\n('UI/UX Design Principles', 'Master the fundamentals of user interface design', 129.99, '10 weeks', 'beginner', 'Design', '/images/design-course.jpg')\nON CONFLICT DO NOTHING","-- =============================================\n-- 8. Indexes for Performance\n-- =============================================\n\n-- Indexes for better query performance\nCREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email)","CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role)","CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active)","CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category)","CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.course_enrollments(user_id, course_id)","CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.course_enrollments(status)","CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id)","CREATE INDEX IF NOT EXISTS idx_certificates_number ON public.certificates(certificate_number)","CREATE INDEX IF NOT EXISTS idx_certificate_downloads_user ON public.certificate_downloads(user_id)","CREATE INDEX IF NOT EXISTS idx_fees_user_id ON public.fees(user_id)","CREATE INDEX IF NOT EXISTS idx_fees_course_id ON public.fees(course_id)","CREATE INDEX IF NOT EXISTS idx_fees_status ON public.fees(status)","CREATE INDEX IF NOT EXISTS idx_fees_due_date ON public.fees(due_date)","CREATE INDEX IF NOT EXISTS idx_fees_payment_type ON public.fees(payment_type)","CREATE INDEX IF NOT EXISTS idx_fees_enrollment_id ON public.fees(enrollment_id)","-- =============================================\n-- 6. Admin User Table\n-- =============================================\n-- This table stores dedicated admin users separate from regular user_profiles\n-- Provides enhanced security and admin-specific features\n\nCREATE TABLE IF NOT EXISTS public.admin_user (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  full_name TEXT NOT NULL,\n  phone_number TEXT,\n  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),\n  is_active BOOLEAN DEFAULT true,\n  last_login TIMESTAMP WITH TIME ZONE,\n  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  failed_login_attempts INTEGER DEFAULT 0,\n  locked_until TIMESTAMP WITH TIME ZONE,\n  created_by UUID REFERENCES public.admin_user(id),\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n)","-- Enable RLS on admin_user\nALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY","-- RLS Policies for admin_user\nCREATE POLICY \\"Admin users can view admin records\\" ON public.admin_user\n  FOR SELECT USING (\n    EXISTS (\n      SELECT 1 FROM public.admin_user au \n      WHERE au.email = auth.jwt() ->> 'email' \n      AND au.is_active = true\n    )\n  )","CREATE POLICY \\"Super admin can create admin users\\" ON public.admin_user\n  FOR INSERT WITH CHECK (\n    EXISTS (\n      SELECT 1 FROM public.admin_user au \n      WHERE au.email = auth.jwt() ->> 'email' \n      AND au.role = 'super_admin' \n      AND au.is_active = true\n    )\n  )","CREATE POLICY \\"Admin users can update profiles\\" ON public.admin_user\n  FOR UPDATE USING (\n    email = auth.jwt() ->> 'email' OR\n    EXISTS (\n      SELECT 1 FROM public.admin_user au \n      WHERE au.email = auth.jwt() ->> 'email' \n      AND au.role = 'super_admin' \n      AND au.is_active = true\n    )\n  )","CREATE POLICY \\"Super admin can delete admin users\\" ON public.admin_user\n  FOR DELETE USING (\n    EXISTS (\n      SELECT 1 FROM public.admin_user au \n      WHERE au.email = auth.jwt() ->> 'email' \n      AND au.role = 'super_admin' \n      AND au.is_active = true\n    )\n  )","-- =============================================\n-- 7. Admin Session Management Table\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.admin_sessions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  admin_user_id UUID REFERENCES public.admin_user(id) ON DELETE CASCADE,\n  session_token TEXT UNIQUE NOT NULL,\n  ip_address INET,\n  user_agent TEXT,\n  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n)","-- Enable RLS for admin sessions\nALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY","-- Policy: Admin users can only see their own sessions\nCREATE POLICY \\"Admin users can view own sessions\\" ON public.admin_sessions\n  FOR SELECT USING (\n    admin_user_id IN (\n      SELECT id FROM public.admin_user \n      WHERE email = auth.jwt() ->> 'email' \n      AND is_active = true\n    )\n  )","-- =============================================\n-- Admin User Functions\n-- =============================================\n\n-- Function to update admin_user updated_at timestamp\nCREATE OR REPLACE FUNCTION update_admin_user_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Trigger for admin_user updated_at\nCREATE TRIGGER update_admin_user_updated_at_trigger\n  BEFORE UPDATE ON public.admin_user\n  FOR EACH ROW\n  EXECUTE FUNCTION update_admin_user_updated_at()","-- Function to create admin user with hashed password\nCREATE OR REPLACE FUNCTION create_admin_user(\n  p_email TEXT,\n  p_password TEXT,\n  p_full_name TEXT,\n  p_phone_number TEXT DEFAULT NULL,\n  p_role TEXT DEFAULT 'admin'\n)\nRETURNS UUID AS $$\nDECLARE\n  v_admin_id UUID;\n  v_password_hash TEXT;\nBEGIN\n  -- Hash the password using crypt\n  v_password_hash := crypt(p_password, gen_salt('bf'));\n  \n  -- Insert the admin user\n  INSERT INTO public.admin_user (\n    email, password_hash, full_name, phone_number, role\n  ) VALUES (\n    p_email, v_password_hash, p_full_name, p_phone_number, p_role\n  ) RETURNING id INTO v_admin_id;\n  \n  RETURN v_admin_id;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Function to verify admin password\nCREATE OR REPLACE FUNCTION verify_admin_password(\n  p_email TEXT,\n  p_password TEXT\n)\nRETURNS TABLE(\n  admin_id UUID,\n  email TEXT,\n  full_name TEXT,\n  phone_number TEXT,\n  role TEXT,\n  is_active BOOLEAN,\n  last_login TIMESTAMP WITH TIME ZONE\n) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT \n    au.id,\n    au.email,\n    au.full_name,\n    au.phone_number,\n    au.role,\n    au.is_active,\n    au.last_login\n  FROM public.admin_user au\n  WHERE au.email = p_email \n    AND au.password_hash = crypt(p_password, au.password_hash)\n    AND au.is_active = true\n    AND (au.locked_until IS NULL OR au.locked_until < NOW());\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Function to update last login\nCREATE OR REPLACE FUNCTION update_admin_last_login(p_admin_id UUID)\nRETURNS VOID AS $$\nBEGIN\n  UPDATE public.admin_user \n  SET last_login = NOW(),\n      failed_login_attempts = 0,\n      locked_until = NULL\n  WHERE id = p_admin_id;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Function to handle failed login attempts\nCREATE OR REPLACE FUNCTION handle_admin_failed_login(p_email TEXT)\nRETURNS VOID AS $$\nDECLARE\n  v_attempts INTEGER;\nBEGIN\n  UPDATE public.admin_user \n  SET failed_login_attempts = failed_login_attempts + 1\n  WHERE email = p_email\n  RETURNING failed_login_attempts INTO v_attempts;\n  \n  -- Lock account after 5 failed attempts for 30 minutes\n  IF v_attempts >= 5 THEN\n    UPDATE public.admin_user \n    SET locked_until = NOW() + INTERVAL '30 minutes'\n    WHERE email = p_email;\n  END IF;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- =============================================\n-- Additional Indexes for Admin Tables\n-- =============================================\nCREATE INDEX IF NOT EXISTS idx_admin_user_email ON public.admin_user(email)","CREATE INDEX IF NOT EXISTS idx_admin_user_active ON public.admin_user(is_active)","CREATE INDEX IF NOT EXISTS idx_admin_user_role ON public.admin_user(role)","CREATE INDEX IF NOT EXISTS idx_admin_user_last_login ON public.admin_user(last_login)","CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token)","CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user ON public.admin_sessions(admin_user_id)","CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at)","-- =============================================\n-- Instructions for Setup:\n-- =============================================\n-- 1. Go to your Supabase dashboard\n-- 2. Navigate to SQL Editor\n-- 3. Copy and paste this entire script\n-- 4. Run the script to create all tables, policies, and functions\n-- 5. The database will be ready for your React application\n-- =============================================\n\n\n-- =============================================\n-- Payments Table (Missing from main schema)\n-- =============================================\nCREATE TABLE IF NOT EXISTS public.payments (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,\n  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,\n  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,\n  amount DECIMAL(10,2) NOT NULL,\n  currency VARCHAR(3) DEFAULT 'INR',\n  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),\n  payment_method VARCHAR(50),\n  payment_type VARCHAR(20) NOT NULL DEFAULT 'course_fee' CHECK (payment_type IN ('course_fee', 'installment', 'late_fee', 'refund')),\n  gateway_payment_id VARCHAR(255),\n  gateway_order_id VARCHAR(255),\n  gateway_transaction_id VARCHAR(255),\n  instamojo_payment_id VARCHAR(255),\n  instamojo_payment_request_id VARCHAR(255),\n  instamojo_longurl TEXT,\n  instamojo_shorturl TEXT,\n  buyer_name VARCHAR(255),\n  email VARCHAR(255),\n  phone VARCHAR(20),\n  payment_date TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  ip_address INET,\n  user_agent TEXT,\n  CONSTRAINT unique_gateway_payment_id UNIQUE (gateway_payment_id),\n  CONSTRAINT unique_instamojo_payment_id UNIQUE (instamojo_payment_id)\n)","-- Enable RLS on payments\nALTER TABLE public.payments ENABLE ROW LEVEL SECURITY","-- Policy: Users can view their own payments\nCREATE POLICY \\"Users can view own payments\\" ON public.payments\n  FOR SELECT USING (auth.uid() = user_id)","-- Policy: Users can insert their own payments\nCREATE POLICY \\"Users can insert own payments\\" ON public.payments\n  FOR INSERT WITH CHECK (auth.uid() = user_id)","-- Policy: Users can update their own payments\nCREATE POLICY \\"Users can update own payments\\" ON public.payments\n  FOR UPDATE USING (auth.uid() = user_id)","-- Policy: Admins can manage all payments\nCREATE POLICY \\"Admins can manage all payments\\" ON public.payments\n  FOR ALL USING (\n    EXISTS (\n      SELECT 1 FROM public.user_profiles \n      WHERE id = auth.uid() AND role = 'admin'\n    )\n  )","-- Indexes for payments table\nCREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id)","CREATE INDEX IF NOT EXISTS idx_payments_course_id ON public.payments(course_id)","CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status)","CREATE INDEX IF NOT EXISTS idx_payments_gateway_id ON public.payments(gateway_payment_id)","CREATE INDEX IF NOT EXISTS idx_payments_instamojo_id ON public.payments(instamojo_payment_id)","CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email)","CREATE INDEX IF NOT EXISTS idx_payments_phone ON public.payments(phone)","CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at)","-- Trigger for payments updated_at\nDROP TRIGGER IF EXISTS handle_updated_at ON public.payments","CREATE TRIGGER handle_updated_at\n  BEFORE UPDATE ON public.payments\n  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()"}	complete_database_schema
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_id_seq', 7, true);


--
-- Name: otps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otps_id_seq', 6, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: admin_sessions admin_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (id);


--
-- Name: admin_sessions admin_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_session_token_key UNIQUE (session_token);


--
-- Name: admin_user admin_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_email_key UNIQUE (email);


--
-- Name: admin_user admin_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_pkey PRIMARY KEY (id);


--
-- Name: certificate_downloads certificate_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_downloads
    ADD CONSTRAINT certificate_downloads_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_certificate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_number_key UNIQUE (certificate_number);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- Name: otps otps_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_phone_key UNIQUE (phone);


--
-- Name: otps otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments unique_gateway_payment_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT unique_gateway_payment_id UNIQUE (gateway_payment_id);


--
-- Name: payments unique_instamojo_payment_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT unique_instamojo_payment_id UNIQUE (instamojo_payment_id);


--
-- Name: fees unique_user_course_installment; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT unique_user_course_installment UNIQUE (user_id, course_id, installment_number);


--
-- Name: user_profiles user_profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_email_key UNIQUE (email);


--
-- Name: user_profiles user_profiles_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_phone_number_key UNIQUE (phone_number);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_admin_sessions_admin_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_sessions_admin_user ON public.admin_sessions USING btree (admin_user_id);


--
-- Name: idx_admin_sessions_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions USING btree (expires_at);


--
-- Name: idx_admin_sessions_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_sessions_token ON public.admin_sessions USING btree (session_token);


--
-- Name: idx_admin_user_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_user_active ON public.admin_user USING btree (is_active);


--
-- Name: idx_admin_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_user_email ON public.admin_user USING btree (email);


--
-- Name: idx_admin_user_last_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_user_last_login ON public.admin_user USING btree (last_login);


--
-- Name: idx_admin_user_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_user_role ON public.admin_user USING btree (role);


--
-- Name: idx_certificate_downloads_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificate_downloads_user ON public.certificate_downloads USING btree (user_id);


--
-- Name: idx_certificates_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificates_number ON public.certificates USING btree (certificate_number);


--
-- Name: idx_certificates_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certificates_user ON public.certificates USING btree (user_id);


--
-- Name: idx_courses_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_active ON public.courses USING btree (is_active);


--
-- Name: idx_courses_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_category ON public.courses USING btree (category);


--
-- Name: idx_enrollments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_status ON public.course_enrollments USING btree (status);


--
-- Name: idx_enrollments_user_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_user_course ON public.course_enrollments USING btree (user_id, course_id);


--
-- Name: idx_fees_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_course_id ON public.fees USING btree (course_id);


--
-- Name: idx_fees_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_due_date ON public.fees USING btree (due_date);


--
-- Name: idx_fees_enrollment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_enrollment_id ON public.fees USING btree (enrollment_id);


--
-- Name: idx_fees_payment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_payment_type ON public.fees USING btree (payment_type);


--
-- Name: idx_fees_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_status ON public.fees USING btree (status);


--
-- Name: idx_fees_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fees_user_id ON public.fees USING btree (user_id);


--
-- Name: idx_payments_course_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_course_id ON public.payments USING btree (course_id);


--
-- Name: idx_payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_created_at ON public.payments USING btree (created_at);


--
-- Name: idx_payments_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_email ON public.payments USING btree (email);


--
-- Name: idx_payments_gateway_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_gateway_id ON public.payments USING btree (gateway_payment_id);


--
-- Name: idx_payments_instamojo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_instamojo_id ON public.payments USING btree (instamojo_payment_id);


--
-- Name: idx_payments_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_phone ON public.payments USING btree (phone);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (payment_status);


--
-- Name: idx_payments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_user_id ON public.payments USING btree (user_id);


--
-- Name: idx_user_profiles_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_profiles_email ON public.user_profiles USING btree (email);


--
-- Name: idx_user_profiles_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_profiles_role ON public.user_profiles USING btree (role);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: course_enrollments handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.course_enrollments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: courses handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: fees handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.fees FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: payments handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: user_profiles handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: payments payments_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER payments_set_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: admin_user update_admin_user_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_admin_user_updated_at_trigger BEFORE UPDATE ON public.admin_user FOR EACH ROW EXECUTE FUNCTION public.update_admin_user_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: admin_sessions admin_sessions_admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.admin_user(id) ON DELETE CASCADE;


--
-- Name: admin_user admin_user_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.admin_user(id);


--
-- Name: certificate_downloads certificate_downloads_certificate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_downloads
    ADD CONSTRAINT certificate_downloads_certificate_id_fkey FOREIGN KEY (certificate_id) REFERENCES public.certificates(id) ON DELETE CASCADE;


--
-- Name: certificate_downloads certificate_downloads_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificate_downloads
    ADD CONSTRAINT certificate_downloads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_enrollments course_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;


--
-- Name: courses courses_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.user_profiles(id);


--
-- Name: fees fees_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: fees fees_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id) ON DELETE SET NULL;


--
-- Name: fees fees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;


--
-- Name: payments payments_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.course_enrollments(id) ON DELETE SET NULL;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_sessions Admin users can view own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin users can view own sessions" ON public.admin_sessions FOR SELECT USING ((admin_user_id IN ( SELECT admin_user.id
   FROM public.admin_user
  WHERE ((admin_user.email = (auth.jwt() ->> 'email'::text)) AND (admin_user.is_active = true)))));


--
-- Name: payments Admins can manage all payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all payments" ON public.payments USING ((EXISTS ( SELECT 1
   FROM public.user_profiles
  WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'::text)))));


--
-- Name: courses All; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "All" ON public.courses USING (true) WITH CHECK (true);


--
-- Name: admin_user Allow service role and authenticated access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow service role and authenticated access" ON public.admin_user USING (((auth.role() = 'service_role'::text) OR (auth.role() = 'authenticated'::text)));


--
-- Name: courses Anyone can view active courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING ((is_active = true));


--
-- Name: courses Instructors can manage own courses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Instructors can manage own courses" ON public.courses USING (((auth.uid() = instructor_id) OR (EXISTS ( SELECT 1
   FROM public.user_profiles
  WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.role = ANY (ARRAY['admin'::text, 'instructor'::text])))))));


--
-- Name: certificates System can create certificates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can create certificates" ON public.certificates FOR INSERT WITH CHECK (true);


--
-- Name: course_enrollments Users can enroll themselves; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can enroll themselves" ON public.course_enrollments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: fees Users can insert own fees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own fees" ON public.fees FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: payments Users can insert own payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: course_enrollments Users can update own enrollment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own enrollment" ON public.course_enrollments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: fees Users can update own fees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own fees" ON public.fees FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: payments Users can update own payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own payments" ON public.payments FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: certificates Users can view own certificates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own certificates" ON public.certificates FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: certificate_downloads Users can view own downloads; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own downloads" ON public.certificate_downloads FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: course_enrollments Users can view own enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own enrollments" ON public.course_enrollments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: fees Users can view own fees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own fees" ON public.fees FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: payments Users can view own payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: account; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_sessions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_user; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_user ENABLE ROW LEVEL SECURITY;

--
-- Name: account all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.account USING (true) WITH CHECK (true);


--
-- Name: admin_sessions all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.admin_sessions USING (true) WITH CHECK (true);


--
-- Name: certificate_downloads all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.certificate_downloads USING (true) WITH CHECK (true);


--
-- Name: course_enrollments all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.course_enrollments USING (true) WITH CHECK (true);


--
-- Name: courses all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.courses USING (true) WITH CHECK (true);


--
-- Name: fees all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.fees USING (true) WITH CHECK (true);


--
-- Name: otps all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.otps USING (true) WITH CHECK (true);


--
-- Name: payments all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.payments USING (true) WITH CHECK (true);


--
-- Name: user_profiles all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all" ON public.user_profiles USING (true) WITH CHECK (true);


--
-- Name: certificate_downloads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.certificate_downloads ENABLE ROW LEVEL SECURITY;

--
-- Name: certificates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: course_enrollments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: fees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

--
-- Name: otps; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text, p_role text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text, p_role text) TO anon;
GRANT ALL ON FUNCTION public.create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text, p_role text) TO authenticated;
GRANT ALL ON FUNCTION public.create_admin_user(p_email text, p_password text, p_full_name text, p_phone_number text, p_role text) TO service_role;


--
-- Name: FUNCTION create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text) TO anon;
GRANT ALL ON FUNCTION public.create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text) TO authenticated;
GRANT ALL ON FUNCTION public.create_certificate(p_user_id uuid, p_course_id uuid, p_enrollment_id uuid, p_grade text) TO service_role;


--
-- Name: FUNCTION generate_certificate_number(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_certificate_number() TO anon;
GRANT ALL ON FUNCTION public.generate_certificate_number() TO authenticated;
GRANT ALL ON FUNCTION public.generate_certificate_number() TO service_role;


--
-- Name: FUNCTION handle_admin_failed_login(p_email text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_admin_failed_login(p_email text) TO anon;
GRANT ALL ON FUNCTION public.handle_admin_failed_login(p_email text) TO authenticated;
GRANT ALL ON FUNCTION public.handle_admin_failed_login(p_email text) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION handle_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_updated_at() TO anon;
GRANT ALL ON FUNCTION public.handle_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.handle_updated_at() TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- Name: FUNCTION update_admin_last_login(p_admin_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_admin_last_login(p_admin_id uuid) TO anon;
GRANT ALL ON FUNCTION public.update_admin_last_login(p_admin_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.update_admin_last_login(p_admin_id uuid) TO service_role;


--
-- Name: FUNCTION update_admin_user_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_admin_user_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_admin_user_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_admin_user_updated_at() TO service_role;


--
-- Name: FUNCTION verify_admin_password(p_email text, p_password text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.verify_admin_password(p_email text, p_password text) TO anon;
GRANT ALL ON FUNCTION public.verify_admin_password(p_email text, p_password text) TO authenticated;
GRANT ALL ON FUNCTION public.verify_admin_password(p_email text, p_password text) TO service_role;


--
-- Name: FUNCTION verify_admin_password_techaddaa(p_email text, p_password text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.verify_admin_password_techaddaa(p_email text, p_password text) TO anon;
GRANT ALL ON FUNCTION public.verify_admin_password_techaddaa(p_email text, p_password text) TO authenticated;
GRANT ALL ON FUNCTION public.verify_admin_password_techaddaa(p_email text, p_password text) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE account; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.account TO anon;
GRANT ALL ON TABLE public.account TO authenticated;
GRANT ALL ON TABLE public.account TO service_role;


--
-- Name: SEQUENCE account_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.account_id_seq TO anon;
GRANT ALL ON SEQUENCE public.account_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.account_id_seq TO service_role;


--
-- Name: TABLE admin_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_sessions TO anon;
GRANT ALL ON TABLE public.admin_sessions TO authenticated;
GRANT ALL ON TABLE public.admin_sessions TO service_role;


--
-- Name: TABLE admin_user; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_user TO anon;
GRANT ALL ON TABLE public.admin_user TO authenticated;
GRANT ALL ON TABLE public.admin_user TO service_role;


--
-- Name: TABLE certificate_downloads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificate_downloads TO anon;
GRANT ALL ON TABLE public.certificate_downloads TO authenticated;
GRANT ALL ON TABLE public.certificate_downloads TO service_role;


--
-- Name: TABLE certificates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.certificates TO anon;
GRANT ALL ON TABLE public.certificates TO authenticated;
GRANT ALL ON TABLE public.certificates TO service_role;


--
-- Name: TABLE course_enrollments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.course_enrollments TO anon;
GRANT ALL ON TABLE public.course_enrollments TO authenticated;
GRANT ALL ON TABLE public.course_enrollments TO service_role;


--
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.courses TO anon;
GRANT ALL ON TABLE public.courses TO authenticated;
GRANT ALL ON TABLE public.courses TO service_role;


--
-- Name: TABLE fees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fees TO anon;
GRANT ALL ON TABLE public.fees TO authenticated;
GRANT ALL ON TABLE public.fees TO service_role;


--
-- Name: TABLE otps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.otps TO anon;
GRANT ALL ON TABLE public.otps TO authenticated;
GRANT ALL ON TABLE public.otps TO service_role;


--
-- Name: SEQUENCE otps_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.otps_id_seq TO anon;
GRANT ALL ON SEQUENCE public.otps_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.otps_id_seq TO service_role;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;


--
-- Name: TABLE user_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_profiles TO anon;
GRANT ALL ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.user_profiles TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict CotfyMSI1QLZ0GhwxzgBf30lPddBs0N7hph2sg0a8xIqJaHnLhuRuPOGD12hGZw

