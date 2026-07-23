import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default company
  const company = await prisma.company.upsert({
    where: { id: 'default-company-id' },
    update: {},
    create: {
      id: 'default-company-id',
      name: 'TechCorp Solutions',
      address: '123 Innovation Drive, Silicon Valley, CA 94025',
      website: 'https://techcorp.com',
      email: 'info@techcorp.com',
      phone: '1234567890',
      directorName: 'John Smith',
      certificatePrefix: 'TECH',
    },
  });
  console.log(`✅ Company created: ${company.name}`);

  // Create default admin linked to company
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@certgen.com' },
    update: {},
    create: {
      email: 'admin@certgen.com',
      password: hashedPassword,
      name: 'Admin User',
      companyId: company.id,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create sample activity log
  await prisma.activityLog.create({
    data: {
      action: 'system_init',
      details: 'Database seeded with default admin and company settings',
      adminId: admin.id,
      companyId: company.id,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
