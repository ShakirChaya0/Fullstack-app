import cron from 'node-cron';
import { CheckExpiredReservations } from '../../application/use_cases/ReservationUseCases/CheckExpiredReservations.js';

export function runReservationCheckJob() {
    //Esta programado para cada 5 minutos
    cron.schedule('*/5 * * * *', async () => {
        const checkExpiredReservations = new CheckExpiredReservations();

        try {
            await checkExpiredReservations.execute();
        } catch (error) {
            console.log(error);
        }
    });
}