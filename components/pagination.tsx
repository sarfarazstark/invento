import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | number | boolean>;
}

export const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const get_page_url = (page: number) => {
    const params = new URLSearchParams({
      ...searchParams,
      page: String(page),
    } as Record<string, string>);

    return `${baseUrl}?${params.toString()}`;
  };

  const get_visible_page = () => {
    const delta = 2;
    const range = [];
    const range_with_dots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range_with_dots.push(1, '...');
    } else {
      range_with_dots.push(1);
    }

    range_with_dots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      range_with_dots.push('...', totalPages);
    } else {
      range_with_dots.push(totalPages);
    }

    return range_with_dots;
  };

  const visible_pages = get_visible_page();

  return (
    <nav className='flex items-center justify-center gap-1'>
      <Link
        href={get_page_url(currentPage - 1)}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
          currentPage <= 1
            ? 'text-gray-400 bg-gray-100 border border-gray-100 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className='h-4 w-4 text-gray-600' /> Previous
      </Link>

      {visible_pages.map((page, key) => {
        if (page === '...') {
          return (
            <span
              key={key}
              className='flex items-center px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg'
            >
              {page}
            </span>
          );
        }
        const page_number = Number(page);
        const is_current = page_number === currentPage;

        return (
          <Link
            href={get_page_url(page_number)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              is_current
                ? 'bg-purple-600 text-white border border-transparent'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            key={key}
            aria-current={is_current ? 'page' : undefined}
          >
            {page_number}
          </Link>
        );
      })}

      <Link
        href={get_page_url(currentPage + 1)}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
          currentPage >= totalPages
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Next
        <ChevronRight className='h-4 w-4 text-gray-600' />
      </Link>
    </nav>
  );
};
