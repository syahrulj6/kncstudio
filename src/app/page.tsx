import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowDownToLine, CheckCircle, Leaf } from 'lucide-react';
import Link from 'next/link';

const perks = [
  {
    name: 'Instant Delievery',
    Icon: ArrowDownToLine,
    description: 'Get your assets delivered to your email in seconds and donwload them right away.',
  },
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description: 'Every assets on our platform is verified by our teams to ensure our highest quality standards. Not happy? We offer a 30-day refund guaranteed.',
  },
  {
    name: 'For the Planet',
    Icon: Leaf,
    description: "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your Marketplace for high quality <span className="text-violet-600">digital assets</span>
          </h1>
          <p className="mt-6 text-lg max-w-prose text-white/70">Welcome to KncStudio. Every asset on our platform is verified by our team to ensure our highest quality standards.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 ">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant={'ghost'}>Our quality promise &rarr;</Button>
          </div>
        </div>

        <ProductReel query={{ sort: 'desc', limit: 4 }} title="Brand New" subtitle="" href="/products" />
      </MaxWidthWrapper>

      <section className="bg-dark">
        <MaxWidthWrapper classname="py-20  border-t border-muted-foreground">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center" key={perk.name}>
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-violet-300 text-violet-700">{<perk.Icon className="w-1/3 h-1/3" />}</div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-white">{perk.name}</h3>
                  <p className="mt-3 text-sm text-white/70">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
