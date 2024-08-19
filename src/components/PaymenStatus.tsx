'use client';

import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter();

  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    }
  );

  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-white/70">
      <div>
        <p className="font-medium text-white">Shipping To</p>
        <p className="text-white/70">{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-white">Order Status</p>
        <p>{isPaid ? 'Payment successful' : 'Pending payment'}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
