import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import NavItems from './NavItems';
import { buttonVariants } from './ui/button';
import Cart from './Cart';
import { getServerSideUser } from '@/lib/payload.utils';
import { cookies } from 'next/headers';
import UserAccountNav from './UserAccountNav';
import MobileNav from './MobileNav';
import Image from 'next/image';

const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="bg-dark sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-dark">
        <MaxWidthWrapper>
          <div className="w-full">
            <div className="flex h-16 items-center justify-between w-full">
              <div className="flex items-center">
                <Link href="/">
                  <Image alt="logo" src="/logo.png" width={36} height={36} />
                </Link>
              </div>

              <div className="flex items-center ml-auto gap-3">
                <div className="block lg:hidden">
                  <Cart />
                </div>
                <MobileNav user={user} />
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {user ? null : (
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: 'ghost',
                    })}
                  >
                    Sign in
                  </Link>
                )}

                {user ? null : <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" />}

                {user ? (
                  <UserAccountNav user={user} />
                ) : (
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      variant: 'ghost',
                    })}
                  >
                    Create account
                  </Link>
                )}

                {user ? <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" /> : null}

                {user ? null : (
                  <div className="flex lg:ml-6">
                    <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" />
                  </div>
                )}

                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
