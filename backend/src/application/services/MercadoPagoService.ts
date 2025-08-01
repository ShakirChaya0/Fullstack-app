import { Items } from 'mercadopago/dist/clients/commonTypes.js';
import { mercadoPagoClient } from '../../infrastructure/config/mercadoPago.js';
import { Preference } from 'mercadopago';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes.js';

type preferenceType = {
    items: Items[],
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
    public async createPreference (data: preferenceType): Promise<PreferenceResponse> {
        const draft = new Preference(mercadoPagoClient)
        const preference = await draft.create({ body: data});
        return preference;
    }
}