import { Items } from 'mercadopago/dist/clients/commonTypes.js';
import { mercadoPagoClient } from '../../infrastructure/config/MercadoPago.js';
import { Preference } from 'mercadopago';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes.js';

type PaymentMethod = {
    excluded_payment_methods?: { id: string }[];
    excluded_payment_types?: { id: string }[];
    installments?: number;
    default_payment_method_id?: string;
    default_installments?: number;
};

type PreferenceType = {
    items: Items[],
    payment_methods: PaymentMethod,
    back_urls: {
        success: string,
        failure: string,
        pending: string
    },
    auto_return: string,
    external_reference: string,
    notification_url: string
}

export class MercadoPagoService{
    public async createPreference (data: PreferenceType): Promise<PreferenceResponse> {
        const draft = new Preference(mercadoPagoClient)
        const preference = await draft.create({ body: data});
        return preference;
    }
}