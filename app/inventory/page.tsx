import Sidebar from '@/components/sidebar';
import { deleteProduct } from '@/lib/actions/products';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Trash2 } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { Pagination } from '@/components/pagination';

export default async function Inventory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;
  const params = await searchParams;
  const q = (params.q ?? '').trim();

  const where: Prisma.ProductWhereInput = {
    userId,
    ...(q
      ? { name: { contains: q, mode: 'insensitive' as Prisma.QueryMode } }
      : {}),
  };

  const page_size = 10;
  const page = Math.max(1, Number(params.page ?? 1));

  const [total_count, all_products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * page_size,
      take: page_size,
    }),
  ]);

  const total_pages = Math.max(1, Math.ceil(total_count / page_size));
  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar currentPath='/inventory' />
      <main className='ml-64 p-8'>
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-5xl font-semibold text-gray-800'>
                Inventory
              </h1>
              <p className='text-lg text-gray-500'>
                Manage your product and track inventory levels.
              </p>
            </div>
          </div>
        </header>

        <section className='space-y-6'>
          {/* Search Form */}
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='px-4 py-4 border-b border-gray-200 bg-white'>
              <form action='/inventory' className='flex gap-2' method='GET'>
                <input
                  type='text'
                  name='q'
                  defaultValue={q}
                  placeholder='Search products...'
                  className='flex-1 text-gray-700 border-gray-300 rounded-lg px-4 py-2 border-2 focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none placeholder:text-gray-400'
                />
                <button
                  type='submit'
                  className='bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition-colors '
                >
                  Search
                </button>
              </form>
            </div>

            <table className='w-full shadow'>
              <thead className='bg-blue-50 rounded-none border-b border-gray-100 font-bold'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs text-gray-500 uppercase'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs text-gray-500 uppercase'>
                    SKU
                  </th>
                  <th className='px-6 py-3 text-center text-xs text-gray-500 uppercase'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-center text-xs text-gray-500 uppercase'>
                    Quantity
                  </th>
                  <th className='px-6 py-3 text-center text-xs text-gray-500 uppercase'>
                    Low Stock
                  </th>
                  <th className='px-6 py-3 text-center text-xs text-gray-500 uppercase'>
                    Slug
                  </th>
                  <th className='px-6 py-3 text-right text-xs text-gray-500 uppercase'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {all_products.map((product, key) => (
                  <tr key={key} className='hover:bg-gray-50'>
                    <td className='px-6 py-3 font-semibold text-sm text-gray-500'>
                      {product.name}
                    </td>
                    <td className='px-6 py-3 text-sm text-gray-500'>
                      {product.sku || '-'}
                    </td>
                    <td className='px-6 py-3 font-semibold text-center text-sm text-gray-500'>
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td className='px-6 py-3 text-center text-sm text-gray-500'>
                      {product.quantity}
                    </td>
                    <td className='px-6 py-3 text-center text-sm text-gray-500'>
                      {product.lowStock || '-'}
                    </td>
                    <td className='px-6 py-3 text-center text-xs text-gray-500'>
                      <span className='rounded-full py-1 px-2 border border-gray-200 text-gray-600 font-mono'>
                        {product.slug}
                      </span>
                    </td>
                    <td className='px-6 py-3 text-right text-sm text-gray-500'>
                      <form
                        action={async (formData: FormData) => {
                          'use server';

                          await deleteProduct(formData);
                        }}
                      >
                        <input type='hidden' name='id' value={product.id} />
                        <button type='submit' className='cursor-pointer'>
                          <Trash2 color='red' />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {total_pages > 1 && (
              <div className='flex justify-center space-x-2 bg-white border border-gray-200 px-4 py-4'>
                <Pagination
                  currentPage={page}
                  totalPages={total_pages}
                  baseUrl={'/inventory'}
                  searchParams={{
                    q,
                    pageSize: String(page_size),
                  }}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
