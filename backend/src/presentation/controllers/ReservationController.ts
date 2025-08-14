import { Request, Response, NextFunction } from "express";
import { RegisterReservation } from "../../application/use_cases/ReservationUseCases/RegisterReservationUseCase.js";
import { UpdateStatus } from "../../application/use_cases/ReservationUseCases/UpdateStatus.js";
import { GetById } from "../../application/use_cases/ReservationUseCases/GetById.js";
import { GetByDate } from "../../application/use_cases/ReservationUseCases/GetByDate.js";
import { GetByClientId } from "../../application/use_cases/ReservationUseCases/GetByClienteId.js";
import { validateReservation} from "../../shared/validators/ReservationZod.js";
import { CUU01RegisterAttendance } from "../../application/use_cases/ReservationUseCases/CUU01RegisterAttendance.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { StateReservation } from "../../shared/types/SharedTypes.js";

export class ReservationController {
  constructor(
    private readonly registerReservation = new RegisterReservation(),
    private readonly updateStatus = new UpdateStatus(),
    private readonly getByIdUseCase = new GetById(),
    private readonly getByDateUseCase = new GetByDate(),
    private readonly getByClientIdUseCase = new GetByClientId(),
    private readonly cuu01RegisterAttendance = new CUU01RegisterAttendance()
  ) {}

  public createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId  = req.params.idCliente;
      if (!clientId) {
        throw new ValidationError("Se ingreso un ID válido")
      }

      const data = validateReservation(req.body);
      const newReservation = await this.registerReservation.execute(data, clientId);
      res.status(201).json(newReservation);
    } catch (error) {
      next(error);
    }
  };

  public updateReservationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idReserva } = req.params;
      const { estado } = req.query;
      if (isNaN(+idReserva)) {
        throw new ValidationError("El ID ingresado debe ser un número");
      }

      if (estado !== 'Realizada' && estado !== 'Asistida' && estado !== 'No_Asistida' && estado !== 'Cancelada' ) {
        throw new ValidationError("Debe proporcionar un estado válido");
      }

      await this.updateStatus.execute(+idReserva, estado as StateReservation);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idReserva } = req.params;
      if (isNaN(+idReserva)) {
        throw new ValidationError("El ID ingresado debe ser un número");
      }
      const reservation = await this.getByIdUseCase.execute(+idReserva);
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  public getByDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      if (!date || isNaN(Date.parse(date as string))) {
        throw new ValidationError("Debe proporcionar una fecha válida");
      }
      const reservations = await this.getByDateUseCase.execute(new Date(date as string));
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  public getByClientId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.params;
      if (!clientId) {
        throw new ValidationError("Se ingreso un ID válido")
      }

      const reservations = await this.getByClientIdUseCase.execute(clientId);
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  public getReservationByNameClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre, apellido } = req.query; 

      if (typeof nombre !== 'string' || typeof apellido !== 'string') {
        throw new ValidationError('Debe enviar un nombre y apellido valido'); 
      }

      const reservation = await this.cuu01RegisterAttendance.execute(nombre , apellido); 
      res.status(200).json(reservation);
    } 
    catch (error) {
      next(error);
    }
  };
}
