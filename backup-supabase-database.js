/**
 * Supabase Database Backup Script
 * This script exports all table data from your Supabase database to JSON files
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create backup directory
const backupDir = path.join(__dirname, 'database_backup_' + new Date().toISOString().split('T')[0]);

async function createBackupDirectory() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log(`📁 Created backup directory: ${backupDir}`);
    }
}

async function backupTable(tableName, selectQuery = '*') {
    try {
        console.log(`📊 Backing up table: ${tableName}`);
        
        const { data, error } = await supabase
            .from(tableName)
            .select(selectQuery);

        if (error) {
            console.error(`❌ Error backing up ${tableName}:`, error.message);
            return false;
        }

        const fileName = path.join(backupDir, `${tableName}.json`);
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        
        console.log(`✅ ${tableName}: ${data.length} records backed up to ${fileName}`);
        return true;
    } catch (error) {
        console.error(`❌ Exception backing up ${tableName}:`, error.message);
        return false;
    }
}

async function backupAdminTables() {
    console.log('\n🔐 Backing up Admin Tables...');
    
    // Backup admin_user table
    await backupTable('admin_user');
    
    // Backup admin_sessions table
    await backupTable('admin_sessions');
}

async function backupMainTables() {
    console.log('\n📚 Backing up Main Application Tables...');
    
    // List of main tables to backup
    const mainTables = [
        'courses',
        'users', 
        'enrollments',
        'payments',
        'fees',
        'certificates'
    ];

    for (const table of mainTables) {
        await backupTable(table);
    }
}

async function backupCustomQueries() {
    console.log('\n🔍 Backing up Custom Queries...');
    
    try {
        // Backup admin sessions with user details (if RLS allows)
        console.log('📊 Backing up admin sessions with user details...');
        const { data: sessionData, error: sessionError } = await supabase
            .from('admin_sessions')
            .select(`
                *,
                admin_user:admin_user_id (
                    id,
                    email,
                    full_name,
                    role,
                    is_active,
                    created_at,
                    last_login
                )
            `);

        if (!sessionError && sessionData) {
            const fileName = path.join(backupDir, 'admin_sessions_with_users.json');
            fs.writeFileSync(fileName, JSON.stringify(sessionData, null, 2));
            console.log(`✅ Admin sessions with user details: ${sessionData.length} records backed up`);
        } else {
            console.log('⚠️ Could not backup admin sessions with user details (likely RLS restriction)');
        }

        // Backup course enrollments with user details
        console.log('📊 Backing up enrollments with course and user details...');
        const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:course_id (
                    id,
                    title,
                    description,
                    price
                ),
                user:user_id (
                    id,
                    email,
                    full_name,
                    phone
                )
            `);

        if (!enrollmentError && enrollmentData) {
            const fileName = path.join(backupDir, 'enrollments_with_details.json');
            fs.writeFileSync(fileName, JSON.stringify(enrollmentData, null, 2));
            console.log(`✅ Enrollments with details: ${enrollmentData.length} records backed up`);
        }

    } catch (error) {
        console.error('❌ Error in custom queries backup:', error.message);
    }
}

async function generateBackupSummary() {
    console.log('\n📋 Generating Backup Summary...');
    
    const files = fs.readdirSync(backupDir);
    const summary = {
        backup_date: new Date().toISOString(),
        backup_directory: backupDir,
        files: [],
        total_files: files.length
    };

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(backupDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            summary.files.push({
                filename: file,
                table_name: file.replace('.json', ''),
                record_count: Array.isArray(content) ? content.length : 1,
                file_size_kb: Math.round(fs.statSync(filePath).size / 1024)
            });
        }
    }

    const summaryFile = path.join(backupDir, 'backup_summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log(`✅ Backup summary saved to: ${summaryFile}`);
    return summary;
}

async function main() {
    console.log('🚀 Starting Supabase Database Backup...');
    console.log(`📅 Backup Date: ${new Date().toISOString()}`);
    
    try {
        // Create backup directory
        await createBackupDirectory();
        
        // Backup admin tables first
        await backupAdminTables();
        
        // Backup main application tables
        await backupMainTables();
        
        // Backup custom queries with joins
        await backupCustomQueries();
        
        // Generate summary
        const summary = await generateBackupSummary();
        
        console.log('\n🎉 Database Backup Completed Successfully!');
        console.log(`📁 Backup Location: ${backupDir}`);
        console.log(`📊 Total Files: ${summary.total_files}`);
        console.log(`📈 Total Records: ${summary.files.reduce((sum, file) => sum + file.record_count, 0)}`);
        
        console.log('\n📋 Backup Summary:');
        summary.files.forEach(file => {
            console.log(`   ${file.table_name}: ${file.record_count} records (${file.file_size_kb} KB)`);
        });
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

// Run the backup
main();