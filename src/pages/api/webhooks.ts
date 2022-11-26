/* Comandos para rodar CLI do stripe:
stripe login
stripe listen --forward-to localhost:3000/api/webhooks */

import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  console.log("evento recebido");

  response.status(200).json({ ok: true });
};
