import { MercadoPagoConfig } from 'mercadopago';

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});