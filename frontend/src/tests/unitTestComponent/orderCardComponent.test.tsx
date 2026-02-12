import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderCard from "../../features/KitchenOrders/components/OrderCard";
import type {
    FoodType,
    OrderLineStatus,
    OrderStatus,
} from "../../features/KitchenOrders/types/SharedTypes";

describe("OrderCard", () => {
    beforeEach(() => {
        // Activamos fake timers ANTES de renderizar
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Restauramos tiempos reales
        vi.useRealTimers();
    });

    const baseProps = {
        order: {
            idPedido: 123,
            horaInicio: "14:00",
            lineasPedido: [
                {
                    nroLinea: 1,
                    nombreProducto: "Matambre a la Pizza",
                    tipoComida: "Plato_Principal" as FoodType,
                    cantidad: 4,
                    estado: "Pendiente" as OrderLineStatus,
                },
                {
                    nroLinea: 2,
                    nombreProducto: "Ensalada César",
                    tipoComida: "Entrada" as FoodType,
                    cantidad: 2,
                    estado: "Pendiente" as OrderLineStatus,
                },
            ],
            estado: "Solicitado" as OrderStatus,
            observaciones: "Sin cebolla",
        },
        onSelect: vi.fn(),
    };

    it("debe renderizar la información básica de la reserva", () => {
        // 2. Fijar "ahora" a las 14:05:30 del 11 de febrero de 2026
        vi.setSystemTime(new Date(2026, 1, 11, 14, 5, 30));

        render(<OrderCard {...baseProps} />);

        expect(screen.getByText("Pedido #123")).toBeInTheDocument();
        expect(screen.getByText("05:30")).toBeInTheDocument();
        expect(screen.getByText("4x")).toBeInTheDocument();
        expect(screen.getByText("Matambre a la Pizza")).toBeInTheDocument();
        expect(screen.getByText("2x")).toBeInTheDocument();
        expect(screen.getByText("Ensalada César")).toBeInTheDocument();
        expect(screen.getByText("⚠️ Con observaciones")).toBeInTheDocument();

        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveStyle("width: 0%");
        expect(screen.getByText("Progreso")).toBeInTheDocument();
        expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("debe mostrar el color correcto según el tiempo transcurrido (>= 15 min)", () => {
        // Fijamos "fecha actual" a las 14:20:00 del mismo día (20 minutos después)
        vi.setSystemTime(new Date(2026, 1, 11, 14, 20, 0));

        render(<OrderCard {...baseProps} />);

        // El timer debería tener la clase naranja (>= 15 min)
        const timerElement = screen.getByText("20:00");
        expect(timerElement).toHaveClass("bg-[#FFEFE5]"); // Naranja
        expect(timerElement).toHaveClass("text-[#FF6600]");
    });

    it("deberia visualizar el progreso del pedido", () => {
        baseProps.order.lineasPedido[1].estado = "Terminada";

        render(<OrderCard {...baseProps} />);

        const progressBar = screen.getByRole("progressbar");
        expect(progressBar).toHaveStyle("width: 50%");
        expect(screen.getByText("Progreso")).toBeInTheDocument();
        expect(screen.getByText("50%")).toBeInTheDocument();
    });

    it("deberia ejecutarse onSelect prop al hacer click", async () => {
        const user = userEvent.setup();

        render(<OrderCard {...baseProps} />);

        const pressingComponent = screen.getByRole("orderCard");
        await user.click(pressingComponent);

        expect(baseProps.onSelect).toHaveBeenCalledTimes(1);
    });
});
