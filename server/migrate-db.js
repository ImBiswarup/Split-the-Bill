const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateDatabase() {
    try {
        console.log('Starting database migration...');

        // Check if we need to add new columns
        const tableInfo = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'User'
        `;

        console.log('Current table structure:', tableInfo);

        // Add new columns if they don't exist
        const columnsToAdd = [
            { name: 'image', type: 'TEXT', nullable: true },
            { name: 'provider', type: 'TEXT', nullable: true },
            { name: 'providerId', type: 'TEXT', nullable: true }
        ];

        for (const column of columnsToAdd) {
            try {
                await prisma.$executeRaw`
                    ALTER TABLE "User" 
                    ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}
                `;
                console.log(`Added column: ${column.name}`);
            } catch (error) {
                console.log(`Column ${column.name} might already exist or error occurred:`, error.message);
            }
        }

        // Make password column nullable
        try {
            await prisma.$executeRaw`
                ALTER TABLE "User" 
                ALTER COLUMN "password" DROP NOT NULL
            `;
            console.log('Made password column nullable');
        } catch (error) {
            console.log('Password column modification error:', error.message);
        }

        console.log('Database migration completed successfully!');
        
        // Verify the new structure
        const newTableInfo = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'User'
            ORDER BY ordinal_position
        `;
        
        console.log('New table structure:', newTableInfo);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateDatabase();
}

module.exports = { migrateDatabase };
