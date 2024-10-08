'use client';

import { Icons } from '@/components/Icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCredentialsValidation, TAuthCredentialsValidator } from '@/lib/schema/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const searchParams = useSearchParams();
  const isSeller = searchParams.get('as') === 'seller';
  const origin = searchParams.get('origin');

  const continueAsSeller = () => {
    router.push('?as=seller');
  };

  const continueAsCustomer = () => {
    router.replace('/sign-in', undefined);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidation),
  });

  const router = useRouter();

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success('Sign in successfully');
      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isSeller) {
        router.push('/sell');
        return;
      }

      router.push('/');
      router.refresh();
    },

    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        toast.error('Invalid email or password');
      }
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mb-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image src="/logo.png" alt="logo" width={80} height={80} />
            <h1 className="text-2xl font-bold text-white">Sign in to your {isSeller ? 'seller' : ''} account</h1>

            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5 ',
              })}
            >
              Doesn&apos;t have an account? Sign-up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register('email')} className={cn({ 'focus-visible:ring-red-500': errors.email })} placeholder="email@example.com" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" {...register('password')} className={cn({ 'focus-visible:ring-red-500': errors.password })} placeholder="Password" />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin h-6 w-6 text-zinc-300" /> : <p>Sign in</p>}</Button>
              </div>
            </form>

            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-dark px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {isSeller ? (
              <Button variant="secondary" onClick={continueAsCustomer} disabled={isLoading}>
                Continue as customer
              </Button>
            ) : (
              <Button variant="secondary" onClick={continueAsSeller} disabled={isLoading}>
                Continue as seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
