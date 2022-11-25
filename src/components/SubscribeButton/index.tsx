import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  //Saber se o usuário está logado na apliação, para não pagar assinatura novamente.
  const { data: session } = useSession();

  const handleSubscribe = () => {
    if (!session) {
      signIn("github");
      return; //Se não estiver logado, vai logar e parar o código aqui
    }
    /* 
      Não vamos fazer as requisições e verificações de pegamentos aqui no client, pois as secret keys ficarão visiveis para os usuários.
      Temos que usar as API's routers do Next, pois o SSR e SSG rodam na renderização da página e precisamos rodar a função no clique do usuáio.
    */
  };

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
