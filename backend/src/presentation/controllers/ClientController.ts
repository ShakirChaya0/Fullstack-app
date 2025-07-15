import { Request, Response, NextFunction } from "express";
import { GetClientUseCase } from "../../application/use_cases/ClientUseCases/GetClientUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GetClientByIdUser } from "../../application/use_cases/ClientUseCases/GetClientByIdUser.js";
import { validateClient, validateClientPartial } from "../../shared/validators/clientZod.js";
import { GetClientByIdUserName } from "../../application/use_cases/ClientUseCases/GetClientByUserName.js";
import { RegisterClientUseCase } from "../../application/use_cases/ClientUseCases/RegisterClientUseCase.js";
import { UpdateClientUseCase } from "../../application/use_cases/ClientUseCases/UpdateClientUseCase.js";


export class ClientController {
    constructor(
        private readonly getClientUseCase = new GetClientUseCase, 
        private readonly getClientByIdUser = new GetClientByIdUser,
        private readonly getClientByUserName = new GetClientByIdUserName, 
        private readonly registerClientUseCase = new RegisterClientUseCase, 
        private readonly updateClientUseCase = new UpdateClientUseCase
    ){}
    public async getAll(req:Request, res:Response, next: NextFunction){
        try {
            const clients = await this.getClientUseCase.execute();
            
            const filteredClient = clients.map(c => {  
                return {
                    nombreUsuario: c.userName, 
                    email: c.email,
                    nombre: c.name, 
                    apellido: c.lastname, 
                    telefono: c.phone, 
                    fechaNacimiento: c.birthDate
                }
            })
            res.status(200).json(filteredClient);
        } catch(error){
            next(error)
        }
    }

    public async getClientById(req:Request, res:Response, next: NextFunction) {
        try {
            const idUser = req.params.idUsuario; 
            if(!idUser) {
                throw new ValidationError("Se ingreso un ID válido")
            }


            const client = await this.getClientByIdUser.execute(idUser);
            const filteredClient = {
                nombreUsuario:client.userName, 
                email: client.email, 
                nombre: client.name, 
                apellido: client.lastname, 
                telefono: client.phone
            }

            res.status(201).json(filteredClient);

        } catch (error) {
            next(error)
        }
    }

    public async getClientByUsername(req:Request, res:Response, next: NextFunction) {
        try {
            const userN = req.params.nombreUsuario;
            if(!userN) {
                throw new ValidationError('El nombre de usuario es incorrecto');
            }

            const clientByUserName = await this.getClientByUserName.execute(userN);
                const filteredClient = {
                    nombreUsuario:  clientByUserName.userName, 
                    email: clientByUserName.email, 
                    nombre: clientByUserName.name, 
                    apellido: clientByUserName.lastname, 
                    telefono: clientByUserName.phone
                }
            res.status(201).json(filteredClient);
        } catch(error) {
            next(error);
        }
    }

    public async createClient(req:Request, res:Response, next: NextFunction) {
        try {
            const data = req.body;
            const validation = validateClient(data); 

            const newClient = await this.registerClientUseCase.execute(validation);
            
            const filteredClient = {
                nombreUsuario: newClient.userName,
                email: newClient.email,
                nombre: newClient.name,
                apellido: newClient.lastname,
                telefono: newClient.phone, 
                fechaNacimiento: newClient.birthDate
            }
            
            res.status(201).json(filteredClient);
        } 
        catch(error) {
            next(error);
        }
    }

    public async updateClient(req:Request, res:Response, next: NextFunction) {
        try {

            const id = req.params.idUsuario; 
            if(!id) {
                throw new ValidationError('Se ingreso un ID válido');
            }

            const newData = req.body
            const validation = validateClientPartial(newData);

            const updateClient =  await this.updateClientUseCase.execute(id,validation)
            
            const filteredClient = {
                nombreUsuario: updateClient.userName,
                email: updateClient.email,
                nombre: updateClient.name,
                apellido: updateClient.lastname,
                fechaNacimiento: updateClient.birthDate,
                telefono: updateClient.phone
            }
            
            res.status(201).json(filteredClient);

        } 
        catch (error) {
            next(error); 
        }
    }
}