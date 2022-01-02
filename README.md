
<h1 align="center">
    ig.News - Next.js
</h1>
<p align="center">Aplicação para inscrição de newsletter com pagamento via stripe</p>


## Sobre o projeto

O projeto tem como objetivo o estudo e desenvolvimento de uma aplicação em ReactJS com NextJS para listagem de posts e sistema de inscrição(subscription).

A aplicação foi desenvolvida utilizando o framework NextJS aplicando conceitos como consumo de API externas, API Root, Server Side Rendering (SSR), Static Site Generation (SSG), STRIPE para pagamentos das subscriptions, NextAuth para autenticação com Github, FaunaDB para armazenar as informações do usuário em um banco de dados e Prismic CMS para adição e gerenciamento do conteúdo dos posts.

O projeto foi desenvolvido como pratica das aulas do modulo 03 do [Ignite da Rocketseat](https://rocketseat.com.br/)

---

## Tecnologias

Abaixo as tecnologias utilizadas para construção da aplicação

- ✔️ [ReactJS](https://reactjs.org/)
- ✔️ [NextJS](https://nextjs.org/)
- ✔️ [TypeScript](https://www.typescriptlang.org/)
- ✔️ [SASS](https://sass-lang.com/)
- ✔️ [Next-Auth](https://next-auth.js.org/)
- ✔️ [Stripe](https://stripe.com/)
- ✔️ [FaunaDB](https://fauna.com/)
- ✔️ [Prismic CMS](https://prismic.io/)

---


## ⚙ Pré Requisitos

Antes de iniciar o projeto, você vai precisar das seguintes ferramentas:

- ✔️ [VsCode](https://code.visualstudio.com/download);
- ✔️ [Git](https://git-scm.com/)
- ✔️ [NodeJS](https://nodejs.org/en/download/)
- ✔️ [Yarn](https://classic.yarnpkg.com)
- ✔️ [Stripe CLI](https://stripe.com/docs/stripe-cli)

Criar conta e configurar os serviços externos:

- ✔️ [Stripe](https://stripe.com/)
- ✔️ [FaunaDB](https://fauna.com/)
- ✔️ [Prismic CMS](https://prismic.io/)

*Configurações dos serviços estão localizadas no arquivo servicesConfig.md na raiz do projeto.*

## Dependencias:

```
npm install
yarn add typescript @types/react @types/node -D
yarn add sass
yarn add react-icons
```

## Clonar o repositório

```bash
$ git clone https://github.com/CarlosAmorim94/DTMoney
# Entre na pasta do repositório clonado
$ cd ignews
```

### Iniciando o projeto

```bash
# Execute yarn para instalar as dependências
$ yarn
# Na raiz do projeto crie uma copia do arquivo .env.local.example
# Altere o nome da copia para .env.local
# Preencha as variáveis ambiente de acordo com as instruções
$ cp .env.local.example .env.local
# Execute stripe listen para ouvir eventos do webhook
$ stripe listen --forward-to localhost:3000/api/webhooks 
# Para iniciar a aplicação
$ yarn dev
```

## 😃 Gostou? me siga no -> [Likedln](https://www.linkedin.com/in/CarlosAmorim94/)