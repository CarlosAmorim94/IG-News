import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Ocultado o 'http://localhost:3000' pois o endereço é o mesmo e o axios vai reaproveitar a url da aplicação
});
