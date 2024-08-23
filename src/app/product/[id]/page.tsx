import AddToCartButton from '@/components/AddToCartButton';
import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/payload-types';
import { Check, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PropsPage {
  params: {
    id: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
];

const Page = async ({ params }: PropsPage) => {
  const { id } = params;

  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: {
        equals: id,
      },
      approvedForSale: {
        equals: 'approved',
      },
    },
  });

  const [product] = products as Product[];

  if (!product) return notFound();

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;
  const value = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.value;

  const validUrls = product.images.map(({ image }) => (typeof image === 'string' ? image : image.url)).filter(Boolean) as string[];

  return (
    <MaxWidthWrapper classname="bg-dark">
      <div className="bg-dark">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.id} className="flex items-center text-sm">
                  <Link href={breadcrumb.href} className="font-medium text-sm text-white/70 hover:text-white">
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
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{product.name}</h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-white">{formatPrice(product.price)}</p>
                <Link href={`/products?category=${value}`} className="ml-4 border-l text-white/70 border-white/70 pl-4">
                  {label}
                </Link>
              </div>
              <div className="mt-4 space-y-6">
                <p className="text-base text-white/70">{product.description}</p>
              </div>

              <div className="mt-6 flex items-center">
                <Check aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-green-500" />
                <p className="ml-2 text-sm text-white/70">Eligible for instant delivery</p>
              </div>
            </section>
          </div>

          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* Add to cart part */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm font-medium">
                  <Shield aria-hidden="true" className="mr-2 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground ">30 Day Return Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel href="/products" query={{ category: product.category, limit: 4 }} title={`Similar ${label}`} subtitle={`Browse similar high-quality ${label} just like '${product.name}'`} />
    </MaxWidthWrapper>
  );
};

export default Page;
