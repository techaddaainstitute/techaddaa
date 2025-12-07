@echo off
echo ==========================================
echo   Restoring techaddaa_backup database
echo ==========================================

REM ---- SET POSTGRES PASSWORD ----
set PGPASSWORD=root

REM ---- TERMINATE EXISTING CONNECTIONS ----
echo Terminating active sessions...
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='techaddaa_backup';"

REM ---- DROP DATABASE ----
echo Dropping existing database...
psql -U postgres -c "DROP DATABASE IF EXISTS techaddaa_backup;"

REM ---- CREATE DATABASE ----
echo Creating new database...
psql -U postgres -c "CREATE DATABASE techaddaa_backup;"

REM ---- CREATE REQUIRED SUPABASE ROLES ----
echo Creating Supabase roles...
psql -U postgres -d techaddaa_backup -c "CREATE ROLE anon NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE authenticated NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE service_role NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE dashboard_user NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE supabase_auth_admin NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE supabase_realtime_admin NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE supabase_storage_admin NOLOGIN;"
psql -U postgres -d techaddaa_backup -c "CREATE ROLE postgres_auth_admin NOLOGIN;"

REM ---- ENABLE EXTENSIONS ----
echo Enabling PostgreSQL extensions...
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"pgjwt\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"pg_graphql\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"pg_net\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"http\";"
psql -U postgres -d techaddaa_backup -c "CREATE EXTENSION IF NOT EXISTS \"pg_stat_statements\";"

REM ---- RESTORE BACKUP ----
echo Restoring backup file...
psql -U postgres -d techaddaa_backup -f "F:\Trae\techaddaa\db_backups\techaddaa_backup07122025.sql"

echo ==========================================
echo   Backup restore completed successfully!
echo ==========================================
pause
