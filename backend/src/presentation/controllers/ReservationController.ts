import { Request, Response, NextFunction } from "express";
import { RegisterReservation } from "../../application/use_cases/ReservationUseCases/RegisterReservationUseCase.js";
import { UpdateStatus } from "../../application/use_cases/ReservationUseCases/UpdateStatus.js";
import { UpdateReservation } from "../../application/use_cases/ReservationUseCases/UpdateReservation.js";
import { GetById } from "../../application/use_cases/ReservationUseCases/GetById.js";
import { GetByDate } from "../../application/use_cases/ReservationUseCases/GetByDate.js";
import { GetByClientId } from "../../application/use_cases/ReservationUseCases/GetByClienteId.js";
import { GetByCompleteName } from "../../application/use_cases/ReservationUseCases/GetByCompleteName.js";
import { validateReservation, validatePartialReservation } from "../../shared/validators/reservationZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class ReservationController {
  constructor(
    private readonly registerReservation = new RegisterReservation(),
    private readonly updateStatus = new UpdateStatus(),
    private readonly updateReservation = new UpdateReservation(),
    private readonly getByIdUseCase = new GetById(),
    private readonly getByDateUseCase = new GetByDate(),
    private readonly getByClientIdUseCase = new GetByClientId(),
    private readonly getByCompleteNameUseCase = new GetByCompleteName()
  ) {}

  public createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = validateReservation(req.body);
      const newReservation = await this.registerReservation.execute(data, req.params.idCliente);
      res.status(201).json(newReservation);
    } catch (error) {
      next(error);
    }
  };

  public updateReservationData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idReserva } = req.params;
      if (isNaN(+idReserva)) {
        throw new ValidationError("El ID ingresado debe ser un número");
      }
      const data = validatePartialReservation(req.body);
      const updatedReservation = await this.updateReservation.execute(+idReserva, data);
      res.status(200).json(updatedReservation);
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

    const { status } = req.body;
    if (!status) {
      throw new ValidationError("Debe proporcionar un estado válido");
    }

    const updatedReservation = await this.updateStatus.execute(+idReserva, status);
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
      const reservations = await this.getByClientIdUseCase.execute(clientId);
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  public getByCompleteName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre, apellido } = req.query;
      if (!nombre || !apellido) {
        throw new ValidationError("Debe proporcionar nombre y apellido");
      }
      const reservations = await this.getByCompleteNameUseCase.execute(nombre as string, apellido as string);
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };
}
