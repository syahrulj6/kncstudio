'use client';

import { ShoppingCartIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { ScrollArea } from './ui/scroll-area';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce((total, { product }) => total + product.price, 0);

  const fee = 1;

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCartIcon aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-white/80 group-hover:text-white" />
        <span className="ml-2 text-sm font-medium text-white/80 group-hover:text-white">{isMounted ? itemCount : 0}</span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6 ">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem product={product} key={product.id} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex text-white/70">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex text-white/70">
                  <span className="flex-1 ">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex text-white/70">
                  <span className="flex-1 ">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: 'w-full',
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 w-60 h-60 text-muted-foreground" aria-hidden="true">
              <Image src="/grapy-olshop.png" fill alt="empty shopping cart " className="object-contain" />
            </div>
            <div className="text-xl font-semibold text-white">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className: 'text-sm text-muted-foreground',
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
