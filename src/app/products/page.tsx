import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { PRODUCT_CATEGORIES } from '@/config';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const allItems = { id: 1, name: 'All', href: '/products' };

const BREADCRUMBS = [
  { id: 2, name: 'UI Kits', href: 'ui_kits' },
  { id: 3, name: 'Icons', href: 'icons' },
];

type Param = string | string[] | undefined;

interface ProductsPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined;
};

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label;

  return (
    <MaxWidthWrapper>
      <ol className="flex items-center space-x-2 mt-12">
        <li key={allItems.id} className="flex items-center text-sm">
          <Link
            href={`${allItems.href}`}
            className={cn('font-medium text-sm text-muted-foreground hover:text-white', {
              'text-white': !category,
            })}
          >
            {allItems.name}
          </Link>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="ml-2 h-5 w-5 flex-shrink-0 text-white/70">
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
        </li>
        {BREADCRUMBS.map((breadcrumb, i) => (
          <li key={breadcrumb.id} className="flex items-center text-sm">
            <Link
              href={`/products?category=${breadcrumb.href}`}
              className={cn('font-medium text-sm text-muted-foreground hover:text-white', {
                'text-white': category === breadcrumb.href,
              })}
            >
              {breadcrumb.name}
            </Link>
            {i !== BREADCRUMBS.length - 1 ? (
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="ml-2 h-5 w-5 flex-shrink-0 text-white/70">
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            ) : null}
          </li>
        ))}
      </ol>
      <ProductReel
        title={label ?? 'Browse high-quality assets'}
        query={{
          category,
          limit: 40,
          sort: sort === 'desc' || sort === 'asc' ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
