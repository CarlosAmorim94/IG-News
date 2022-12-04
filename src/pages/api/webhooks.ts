/* Comandos para rodar CLI do stripe:
stripe login
stripe listen --forward-to localhost:3000/api/webhooks */

import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

//Código Node.js que lida com streming
async function buffer(readable: Readable) {
  const chunks = []; //chunks são pedaços de stream

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  //O next.js entende a requisição como json ou formulário, mas nesse caso é stream, então desabilitamos como o next entende as requisições
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  // 'customers.subscription.created',
  "customers.subscription.updated",
  "customers.subscription.deleted",
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          // case 'customers.subscription.created':
          case "customers.subscription.updated":
          case "customers.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
              // type === 'customers.subscription.created',
            );
            break;

          case "checkout.session.completed":
            const checkouSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkouSession.subscription.toString(),
              checkouSession.customer.toString(),
              true
            );
            break;

          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        return res.json({ error: "Webhook handler failed." });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
