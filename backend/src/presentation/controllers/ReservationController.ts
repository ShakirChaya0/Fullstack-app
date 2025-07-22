import { Request, Response, NextFunction } from "express";
import { RegisterReservation } from "../../application/use_cases/ReservationUseCases/RegisterReservationUseCase.js";
import { UpdateStatus } from "../../application/use_cases/ReservationUseCases/UpdateStatus.js";
import { GetById } from "../../application/use_cases/ReservationUseCases/GetById.js";
import { GetByDate } from "../../application/use_cases/ReservationUseCases/GetByDate.js";
import { GetByClientId } from "../../application/use_cases/ReservationUseCases/GetByClienteId.js";
import { validateReservation, validatePartialReservation } from "../../shared/validators/reservationZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { EstadoReserva } from "../../domain/entities/Reservation.js";

export class ReservationController {
  constructor(
    private readonly registerReservation = new RegisterReservation(),
    private readonly updateStatus = new UpdateStatus(),
    private readonly getByIdUseCase = new GetById(),
    private readonly getByDateUseCase = new GetByDate(),
    private readonly getByClientIdUseCase = new GetByClientId(),
  ) {}

  public createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.params;
      if(!clientId) {
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
      if (isNaN(+idReserva)) {
        throw new ValidationError("El ID ingresado debe ser un número");
      }

      const { estado } = validatePartialReservation({ estado: req.body.status });

      if (!estado) {
        throw new ValidationError("Debe proporcionar un estado válido");
      }

      const updatedReservation = await this.updateStatus.execute(+idReserva, estado as EstadoReserva);
      res.status(200).json(updatedReservation);
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
      if(!clientId) {
        throw new ValidationError("Se ingreso un ID válido")
      }

      const reservations = await this.getByClientIdUseCase.execute(clientId);
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

}
