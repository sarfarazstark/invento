import Sidebar from '@/components/sidebar';
import { createProduct } from '@/lib/actions/products';
import Link from 'next/link';

export default async function ProductPage() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Sidebar currentPath='/product' />

      <main className='ml-64 p-8'>
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-5xl font-semibold text-gray-800'>
                Add a Product
              </h1>
              <p className='text-lg text-gray-500'>
                Create a new product to manage inventory and track sales.
              </p>
            </div>
          </div>
        </header>

        <section className='max-w-2xl'>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <form
              action={async (formData) => {
                'use server';
                try {
                  await createProduct(formData);
                } catch (error) {
                  console.error('Error creating product:', error);
                }
              }}
              className='space-y-6'
            >
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Product Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                  placeholder='e.g., Apple iPhone 13'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='slug'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Slug *
                </label>
                <input
                  type='text'
                  id='slug'
                  name='slug'
                  className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                  placeholder='e.g., apple-iphone-13'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Price *
                  </label>
                  <input
                    type='number'
                    id='price'
                    name='price'
                    step='0.01'
                    min={0}
                    className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                    placeholder='e.g., 999.99'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Quantity *
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    name='quantity'
                    min={0}
                    className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                    placeholder='e.g., 10'
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='sku'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  SKU
                </label>
                <input
                  type='text'
                  id='sku'
                  name='sku'
                  className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                  placeholder='e.g., IPH13-BLK-128'
                />
              </div>
              <div>
                <label
                  htmlFor='lowStock'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Low Stock At
                </label>
                <input
                  type='number'
                  id='lowStock'
                  name='lowStock'
                  min={0}
                  className='w-full text-gray-500 border border-gray-300 px-4 py-2 rounded-lg focus:border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none'
                  placeholder='e.g., 5'
                />
              </div>

              <button
                type='submit'
                className='inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
              >
                Add Product
              </button>

              <Link
                href='/inventory'
                className='px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ml-6'
              >
                Cancel
              </Link>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
