import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demo_user_id = '9ea262f4-8309-44ed-b03a-b1dfbe608117';

  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
      userId: demo_user_id,
      name: `Product ${i + 1}`,
      slug: `product_${i + 1}`,
      price: (Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStock: 5,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
