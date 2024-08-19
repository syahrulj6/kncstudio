'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useCart } from '../hooks/use-cart';
import { Product } from '../payload-types';

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const handleClick = () => {
    addItem(product);
    setIsSuccess(true);
    toast.success('Successfully added to cart!', {
      duration: 2000, // Toast will appear for 2 seconds
    });
  };

  return (
    <Button onClick={handleClick} size="lg" className="w-full">
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
  );
};

export default AddToCartButton;
