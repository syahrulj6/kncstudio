import { z } from 'zod';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { getPayloadClient } from '../get-payload';
import { stripe } from '../lib/stripe';
import Stripe from 'stripe';
import { Product } from '../payload-types'; // Importing Product interface for type annotations

export const paymentRouter = router({
  createSession: privateProcedure.input(z.object({ productIds: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const { productIds } = input;

    if (productIds.length === 0) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    const payload = await getPayloadClient();

    // Fetch products using payload.find
    const { docs: products } = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Type-casting the products to the Product interface
    const filteredProducts = (products as unknown[] as Product[]).filter((prod) => Boolean(prod.priceId));

    if (filteredProducts.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        _isPaid: false,
        products: filteredProducts.map((product) => product.id),
        user: user.id,
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = filteredProducts.map((product) => ({
      price: product.priceId!,
      quantity: 1,
    }));

    line_items.push({
      price: 'price_1PpN3aP7nKIJ6S8iwhj3tgGZ', // Replace with your actual price ID
      quantity: 1,
      adjustable_quantity: {
        enabled: false,
      },
    });

    try {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        payment_method_types: ['card'],
        mode: 'payment',
        metadata: {
          userId: user.id,
          orderId: order.id,
        },
        line_items,
      });

      return { url: stripeSession.url };
    } catch (error) {
      console.log(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create Stripe session' });
    }
  }),

  pollOrderStatus: publicProcedure.input(z.object({ orderId: z.string() })).query(async ({ input }) => {
    const { orderId } = input;

    const payload = await getPayloadClient();

    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        id: {
          equals: orderId,
        },
      },
    });

    if (orders.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    const [order] = orders;

    return { isPaid: order._isPaid };
  }),
});
