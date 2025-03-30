// import { prisma } from '@/lib/prisma';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'admin1' },
    update: {},
    create: {
      username: 'admin1',
      password: hashedPassword,
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project assignment',
        description: 'Finish the task management system',
        status: 'IN_PROGRESS',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId: user.id,
      },
      {
        title: 'Review PRs',
        description: 'Review team pull requests',
        status: 'TODO',
        userId: user.id,
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the latest version',
        status: 'DONE',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        userId: user.id,
      },
    ],
    // skipDuplicates: true,
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// import { PrismaClient } from "@prisma/client";
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// async function main() {
//   // Create test user
//   const hashedPassword = await bcrypt.hash('password123', 10);
  
//   await prisma.user.upsert({
//     where: { username: 'admin' },
//     update: {},
//     create: {
//       username: 'admin',
//       password: hashedPassword,
//     },
//   });

//   console.log('User seeded successfully');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
