/**
 * Convert JSON Backup to SQL Backup
 * This script converts the JSON backup files to a simple SQL file with INSERT statements
 */

const fs = require('fs');
const path = require('path');

const backupDir = './database_backup_2025-10-05';
const outputFile = './database_backup.sql';

// Helper function to escape SQL values
function escapeSqlValue(value) {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    
    if (typeof value === 'string') {
        // Escape single quotes and wrap in quotes
        return `'${value.replace(/'/g, "''")}'`;
    }
    
    if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
    }
    
    if (typeof value === 'number') {
        return value.toString();
    }
    
    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))) {
        return `'${value}'`;
    }
    
    // For objects/arrays, convert to JSON string
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}

// Helper function to generate INSERT statement
function generateInsertStatement(tableName, records) {
    if (!records || records.length === 0) {
        return `-- No data for table: ${tableName}\n\n`;
    }
    
    let sql = `-- Data for table: ${tableName}\n`;
    
    // Get column names from the first record
    const columns = Object.keys(records[0]);
    const columnList = columns.join(', ');
    
    sql += `-- Columns: ${columnList}\n\n`;
    
    // Generate INSERT statements
    for (const record of records) {
        const values = columns.map(col => escapeSqlValue(record[col])).join(', ');
        sql += `INSERT INTO ${tableName} (${columnList}) VALUES (${values});\n`;
    }
    
    sql += '\n';
    return sql;
}

// Main function to convert JSON to SQL
function convertJsonToSql() {
    console.log('🔄 Converting JSON backup to SQL...');
    
    let sqlContent = `-- Database Backup SQL File
-- Generated from JSON backup on ${new Date().toISOString()}
-- Source: ${backupDir}

-- Disable foreign key checks for easier import
SET session_replication_role = replica;

`;

    // Define the order of tables for proper foreign key handling
    const tableOrder = [
        'admin_user',
        'admin_sessions', 
        'courses',
        'users',
        'enrollments',
        'payments',
        'fees',
        'certificates'
    ];
    
    // Process each table
    for (const tableName of tableOrder) {
        const jsonFile = path.join(backupDir, `${tableName}.json`);
        
        if (fs.existsSync(jsonFile)) {
            console.log(`📊 Processing ${tableName}...`);
            
            try {
                const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
                sqlContent += generateInsertStatement(tableName, jsonData);
            } catch (error) {
                console.error(`❌ Error processing ${tableName}:`, error.message);
                sqlContent += `-- Error processing ${tableName}: ${error.message}\n\n`;
            }
        } else {
            console.log(`⚠️ File not found: ${jsonFile}`);
            sqlContent += `-- File not found: ${tableName}.json\n\n`;
        }
    }
    
    // Add footer
    sqlContent += `-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Backup conversion completed on ${new Date().toISOString()}
`;

    // Write the SQL file
    fs.writeFileSync(outputFile, sqlContent);
    console.log(`✅ SQL backup created: ${outputFile}`);
    
    // Generate summary
    const stats = fs.statSync(outputFile);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)} KB`);
    
    return outputFile;
}

// Run the conversion
try {
    const sqlFile = convertJsonToSql();
    
    // Read and display first few lines as preview
    const content = fs.readFileSync(sqlFile, 'utf8');
    const lines = content.split('\n');
    
    console.log('\n📋 Preview of generated SQL file:');
    console.log('=' .repeat(50));
    console.log(lines.slice(0, 20).join('\n'));
    
    if (lines.length > 20) {
        console.log(`\n... (${lines.length - 20} more lines)`);
    }
    
    console.log('=' .repeat(50));
    console.log(`\n🎉 Conversion completed successfully!`);
    console.log(`📁 SQL backup file: ${sqlFile}`);
    
} catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
}