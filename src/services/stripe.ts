import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(
  process.env.NEXT_PUBLIC_STRIPE_API_KEY as string,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "Ignews",
      version,
    },
  }
);
