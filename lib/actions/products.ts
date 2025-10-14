'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser } from '../auth';
import { prisma } from '../prisma';
import { z } from 'zod';
import { empty } from '@prisma/client/runtime/library';

const ProductSchema = z.object({
  name: z.string().min(10, 'Product name is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  sku: z.string().optional(),
  quantity: z.coerce.number().min(0, 'Quantity must be a positive number'),
  lowStock: z.coerce.number().min(0).optional(),
  slug: z.string().min(1, 'Slug is required'),
});

export const deleteProduct = async (formData: FormData) => {
  const user = await getCurrentUser();
  const userId = user.id;
  const id = String(formData.get('id') || '');

  await prisma.product.deleteMany({
    where: { id: id, userId: userId },
  });
};

export const createProduct = async (formData: FormData) => {
  const user = await getCurrentUser();
  const userId = user.id;

  const parsed = ProductSchema.safeParse({
    name: String(formData.get('name') || ''),
    price: Number(formData.get('price') || 0),
    sku: String(formData.get('sku') || ''),
    quantity: Number(formData.get('quantity') || 0),
    lowStock: Number(formData.get('lowStock') || 0),
    slug: String(formData.get('slug') || ''),
  });

  if (
    parsed.data?.slug === 'inventory' ||
    parsed.data?.slug === 'products' ||
    parsed.data?.slug === 'settings'
  ) {
    throw new Error('This slug is reserved. Please choose a different one.');
  } else if (parsed.data && parsed.data?.slug.trim() === '') {
    const slugify = parsed.data?.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    parsed.data.slug = slugify;
  }

  if (parsed.data && (parsed.data.sku ?? '').trim() === '') {
    parsed.data.sku = parsed.data.name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (!parsed.success) {
    throw new Error('Invalid form data', { cause: parsed.error });
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId },
    });
    redirect('/inventory');
  } catch (error) {
    throw new Error('Failed to create product', { cause: error });
  }
};
