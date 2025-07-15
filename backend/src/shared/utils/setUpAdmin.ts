//Archivo para ser ejecutado una única vez para obtener el hash respectivo de la contraseña del admin y su uuid 
//Estos mismos datos deberan ser instanciados manualmente en la BD del servidor o en el respectivo local storage de cada desarrollador
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const constraseñaDesea = '7891011';

const uuid = randomUUID();
console.log('UUID generado:', uuid);

const hashedPassword = bcrypt.hash(constraseñaDesea, 10);
console.log('Contraseña hasheada:', hashedPassword);