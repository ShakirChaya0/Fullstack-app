//Archivo para ser ejecutado una única vez para obtener el hash respectivo de la contraseña del admin y su uuid 
//Estos mismos datos deberan ser instanciados manualmente en la BD del servidor o en el respectivo local storage de cada desarrollador
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

async function generateAdminData() {
    const constraseñaDesea = '7891011';
    const uuid = randomUUID();
    const hashedPassword = await bcrypt.hash(constraseñaDesea, 10);
}

// Ejecutar la función
generateAdminData().catch(console.error);