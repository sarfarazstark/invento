import ProductsChart from '@/components/products-chart';
import Sidebar from '@/components/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TrendingUp } from 'lucide-react';

export default async function Dashboard() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [total_products, low_stock, all_products, recent] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: { userId, lowStock: { not: null }, quantity: { lte: 5 } },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, created_at: true },
    }),
    prisma.product.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ]);

  const total_value = all_products.reduce(
    (sum, product) => sum + Number(product.price) * product.quantity,
    0
  );

  const weekly_products_data = [];

  for (let i = 11; i >= 0; i--) {
    const week_start = new Date();
    week_start.setDate(week_start.getDate() - i * 7);
    week_start.setHours(0, 0, 0, 0);

    const week_end = new Date(week_start);
    week_end.setDate(week_end.getDate() + 6);
    week_end.setHours(230, 59, 59, 999);

    const week_label = `${String(week_start.getDate() + 1).padStart(
      2,
      '0'
    )}/${String(week_start.getMonth() + 1).padStart(2, '0')}`;

    const week_products = all_products.filter((product) => {
      const product_date = new Date(product.created_at);

      return product_date >= week_start && product_date <= week_end;
    });

    weekly_products_data.push({
      week: week_label,
      products: week_products.length,
    });
  }

  const in_stock_count = all_products.filter(
    (p) => Number(p.quantity) > 5
  ).length;
  const low_stock_count = all_products.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1
  ).length;
  const out_of_stock_count = all_products.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  const in_stock_percentage =
    total_products > 0
      ? Math.round((in_stock_count / total_products) * 100)
      : 0;

  const low_stock_percentage =
    total_products > 0
      ? Math.round((low_stock_count / total_products) * 100)
      : 0;

  const out_of_stock_percentage =
    total_products > 0
      ? Math.round((out_of_stock_count / total_products) * 100)
      : 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar currentPath='/dashboard' />
      <main className='ml-64 p-8'>
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-5xl font-semibold text-gray-800'>
                Dashboard
              </h1>
              <p className='text-sm text-gray-500'>
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div className='bg-white rounded-lg border border-gray-200 p-6 flex flex-col'>
            <h2 className='text-lg font-semibold text-gray-800'>Key Metrics</h2>
            <div className='grid grid-cols-3 gap-6 mt-6 flex-1 [&_div]:my-auto '>
              {/* Total Products */}
              <div className='text-center'>
                <div className='text-5xl font-bold text-gray-700'>
                  {total_products}
                </div>
                <div className='text-lg text-gray-600'>Total Products</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-sm text-green-600'>
                    +{total_products}
                  </span>
                  <TrendingUp className='w-3 h-3 text-green-600' />
                </div>
              </div>

              {/* Total Value */}
              <div className='text-center'>
                <div className='text-5xl font-bold text-gray-700'>
                  ₹{Number(total_value).toFixed(0)}
                </div>
                <div className='text-lg text-gray-600'>Total Value</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-sm text-green-600'>
                    +₹{Number(total_value).toFixed(0)}
                  </span>
                  <TrendingUp className='w-3 h-3 text-green-600' />
                </div>
              </div>

              {/* Low Stock */}
              <div className='text-center'>
                <div className='text-5xl font-bold text-gray-700'>
                  {low_stock}
                </div>
                <div className='text-lg text-gray-600'>Low Stock</div>
                <div className='flex items-center justify-center mt-1'>
                  <span className='text-sm text-green-600'>+{low_stock}</span>
                  <TrendingUp className='w-3 h-3 text-green-600' />
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-800'>
                New product per week
              </h2>
            </div>
            <div className='h-48'>
              <ProductsChart data={weekly_products_data} />
            </div>
          </div>
        </div>

        {/*  */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Stock Levels
              </h2>
            </div>
            <div className='space-y-3'>
              {recent.map((product, key) => {
                const stock_level =
                  product.quantity === 0
                    ? 0
                    : product.quantity <= (product.lowStock || 5)
                    ? 1
                    : 2;

                const bg_color = [
                  'bg-red-600',
                  'bg-yellow-600',
                  'bg-green-600',
                ];

                const text_color = [
                  'text-red-600',
                  'text-yellow-600',
                  'text-green-600',
                ];

                return (
                  <div
                    key={key}
                    className='flex w-full items-center justify-between text-gray-600 p-3 bg-gray-100 rounded-md'
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <div
                        className={`w-3 h-3 rounded-full ${bg_color[stock_level]}`}
                      />
                      <span className='text-sm font-medium text-gray-800'>
                        {product.name}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-semibold ${text_color[stock_level]}`}
                    >
                      {product.quantity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-800'>
                Efficiency
              </h2>
            </div>
            <div className='flex items-center justify-center'>
              <div className='relative w-48 h-48'>
                <div className='absolute inset-0 rounded-full border-8 border-gray-200'></div>
                <div
                  className='absolute inset-0 rounded-full border-8 border-purple-600'
                  style={{
                    clipPath:
                      'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)',
                  }}
                />
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-gray-800'>
                      {in_stock_percentage}%
                    </div>
                    <div className='text-sm text-gray-600'>In Stock</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-6 space-y-2'>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-purple-200' />
                  <span>In Stock ({in_stock_percentage}%)</span>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-purple-600' />
                  <span>Low Stock ({low_stock_percentage}%)</span>
                </div>
              </div>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <div className='flex items-center space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-gray-200' />
                  <span>Out of Stock ({out_of_stock_percentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
