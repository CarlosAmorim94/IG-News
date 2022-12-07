//Pastas com um _ na frente não serão entendidas como rotas ex: _lib

import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  //Buscar usuário no banco do fauna, com o id customerI.
  const userRef = await fauna.query(
    query.Select(
      // Selecionar somente um campo, para não haver cobrança excessiva do faunaDB, mas pode colocar mais.
      "ref",
      query.Get(
        query.Match(query.Index("user_by_stripe_customer_id"), customerId)
      )
    )
  );

  //Precisamos ter mais detalhes sobre a subscription, pois o webhook do stripe só retorna o id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  //Salvar somente o importante que retorna da variavel subscription
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  //Salvar os dados da subscription no FaunaDB
  if (createAction) {
    await fauna.query(
      query.Create(query.Collection("subscriptions"), {
        data: subscriptionData,
      })
    );
  } else {
    await fauna.query(
      query.Replace(
        //Update altera uma informação, Replace altera tudo
        query.Select(
          "ref",
          query.Get(
            query.Match(query.Index("subscription_by_id"), subscriptionId)
          )
        ),
        { data: subscriptionData }
      )
    );
  }
}
