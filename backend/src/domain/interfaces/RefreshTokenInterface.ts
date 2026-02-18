export interface RefreshTokenInterface {
    idToken: string;
    token: string;
    fechaCreacion: Date;
    fechaExpiracion: Date;
    revocado: boolean;
    idUsuario: string;
}