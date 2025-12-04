import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createPastorate() {
  try {
    console.log('🔧 Creating PASTORATE admin...\n');

    // Check if PASTORATE role exists in enum
    console.log('✓ Checking AdminRole enum...');

    const hashedPassword = await bcrypt.hash('pastorate123', 10);

    // Delete existing if any
    const existing = await prisma.admin.findUnique({
      where: { email: 'pastorate@uonsdamain.org' },
    });

    if (existing) {
      console.log('⚠️  Admin already exists, updating...');
      await prisma. admin.update({
        where: { email: 'pastorate@uonsdamain.org' },
        data: {
          password: hashedPassword,
          role: 'PASTORATE',
          isActive: true,
        },
      });
    } else {
      console.log('➕ Creating new admin...');
      await prisma. admin.create({
        data: {
          firstName: 'Elder',
          lastName: 'Pastorate',
          email: 'pastorate@uonsdamain.org',
          password: hashedPassword,
          role: 'PASTORATE',
          phone: '+254700000000',
          isActive: true,
        },
      });
    }

    console. log('\n✅ PASTORATE admin ready!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    pastorate@uonsdamain.org');
    console.log('🔑 Password: pastorate123');
    console.log('👤 Role:     PASTORATE');
    console. log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Login at: http://localhost:5173/admin/login\n');

  } catch (error) {
    console.error('\n❌ Error:', error. message);
    
    if (error.message.includes('Invalid `prisma.admin.create()` invocation')) {
      console.error('\n💡 Fix: Run migration first:');
      console.error('   npx prisma migrate dev --name add_pastorate_role\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createPastorate();