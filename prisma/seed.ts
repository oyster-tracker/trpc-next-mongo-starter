/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

async function main() {
  const firstPostId = new ObjectId().toHexString();
  await prisma.post.upsert({
    where: {
      id: firstPostId,
    },
    create: {
      id: firstPostId,
      title: 'First Post',
      text: 'This is an example post generated from `prisma/seed.ts`',
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
