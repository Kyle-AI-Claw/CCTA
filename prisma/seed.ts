import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@example.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ Demo user created:', user.username);

  // Create demo tags
  const tags = [
    { name: 'vintage' },
    { name: 'modern' },
    { name: 'error' },
    { name: 'proof' },
    { name: 'silver' },
    { name: 'gold' },
  ];

  const tagList = await Promise.all(
    tags.map(async (tag) => {
      return await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: {
          name: tag.name,
        },
      });
    })
  );

  console.log('✅ Tags created:', tagList.length, 'tags');

  // Create demo coins (without images for demo)
  const coins = [
    {
      userId: user.id,
      name: 'Lincoln Cent',
      denomination: '1 cent',
      year: 1909,
      mintMark: 'VDB',
      country: 'United States',
      metal: 'Copper',
      grade: 'VF-30',
      purchasedDate: new Date('2026-03-15'),
      purchasePrice: 2.50,
      notes: 'First year VDB Lincoln Cent',
      description: 'The 1909 VDB Lincoln Cent is one of the most famous coins of the early 20th century.',
      tags: tagList.map((t) => ({ tagId: t.id })),
    },
    {
      userId: user.id,
      name: 'Morgan Dollar',
      denomination: '1 dollar',
      year: 1921,
      country: 'United States',
      metal: 'Silver',
      grade: 'AU-50',
      purchasedDate: new Date('2026-02-10'),
      purchasePrice: 15.00,
      notes: 'First year Morgan',
      description: 'Classic Morgan Dollar from 1921.',
      tags: tagList.filter((t) => t.name === 'silver').map((t) => ({ tagId: t.id })),
    },
    {
      userId: user.id,
      name: 'Peace Dollar',
      denomination: '1 dollar',
      year: 1928,
      country: 'United States',
      metal: 'Silver',
      grade: 'MS-63',
      purchasedDate: new Date('2026-01-20'),
      purchasePrice: 25.00,
      notes: 'Late year issue',
      description: 'Peace Dollar from 1928.',
      tags: tagList.filter((t) => t.name === 'silver').map((t) => ({ tagId: t.id })),
    },
  ];

  await prisma.coin.createMany({
    data: coins,
  });

  console.log('✅ Demo coins created:', coins.length, 'coins');

  // Get created coins for category creation
  const allCoins = await prisma.coin.findMany({
    include: { tags: true },
  });

  console.log('📊 Demo complete!');
  console.log(`   - 1 user (demo/demo@example.com)`);
  console.log(`   - ${tagList.length} tags`);
  console.log(`   - ${allCoins.length} coins`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
