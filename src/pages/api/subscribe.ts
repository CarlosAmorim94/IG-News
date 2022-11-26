import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    //Saber qual o usuário logado na aplicação, pelos cookies pois o nextauth salva dados no cookies e estamos no "backend" da aplicação
    const session = await getSession({ req: request });

    // Pegando o usuário no fauna com o mesmo e-mail do github
    const user = await fauna.query<User>(
      query.Get(
        query.Match(
          query.Index("user_by_email"),
          query.Casefold(session?.user?.email)
        )
      )
    );

    let customerId = user.data.stripe_customer_id; //coletar o numero do customer/cliente do stripe cadastrado no banco de dados

    if (!customerId) {
      // Precisamos criar um customer/cliente no stripe para realizar o pagamento
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email as string, //pegando o e-mail do usuário logado e criando um customer no stripe
        //metadata
      });

      //Salvar o customer do stripe para o user no faunaDB
      await fauna.query(
        query.Update(query.Ref(query.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId, //id do customer do stripe, não do Fauna
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: process.env.STRIPE_PRICE as string, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL as string,
      cancel_url: process.env.STRIPE_CANCEL_URL as string,
    });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
};
