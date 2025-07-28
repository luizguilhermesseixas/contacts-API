import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      contacts: {
        create: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '555-0000',
          },
          {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phone: '555-0001',
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
      contacts: {
        create: [
          {
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie.brown@example.com',
            phone: '555-1234',
          },
          {
            firstName: 'Daisy',
            lastName: 'Miller',
            email: 'daisy.miller@example.com',
            phone: '555-5678',
          },
        ],
      },
    },
  });
  console.log({ user1, user2 });
}

main()
  .then(async () => {
    console.log('Seeding completed successfully.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
