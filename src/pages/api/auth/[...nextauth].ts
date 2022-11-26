import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";
import { query } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  //Match = WHERE do SQL
                  query.Index("user_by_email"), //Criamos o user_by_email como indice de pesquisa no FaunaDB
                  query.Casefold(email) //Casefold vai deixar tudo em lowercase
                )
              )
            ), //Se o usuário não existe, então criamos com Create, se ele existe, vamos pro GET para pegar informação.
            query.Create(query.Collection("users"), { data: { email } }),
            query.Get(
              // Get = SELECT do SQL
              query.Match(query.Index("user_by_email"), query.Casefold(email))
            )
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
