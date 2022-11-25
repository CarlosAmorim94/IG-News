import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  //Saber se o usuário está logado na apliação, para não pagar assinatura novamente.
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return; //Se não estiver logado, vai logar e parar o código aqui
    }
    /* 
      Não vamos fazer as requisições e verificações de pegamentos aqui no client, pois as secret keys ficarão visiveis para os usuários.
      Temos que usar as API's routers do Next, pois o SSR e SSG rodam na renderização da página e precisamos rodar a função no clique do usuáio.
    */

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
