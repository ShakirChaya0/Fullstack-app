import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";
import type { CheckType } from "../types/PaymentSharedTypes";

export default function Check({ check }: { check: CheckType }) {
    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-slate-800">

            <header className="text-center border-b-2 border-dashed border-slate-300 pb-6 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-900">{check.nombreRestaurante}</h1>
                <p className="text-sm mt-2 text-slate-600">{check.direccionRestaurante}</p>
                <p className="text-sm text-slate-600">{check.telefonoContacto}</p>
            </header>

            <section className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-6 pb-6 border-b-2 border-dashed border-slate-300">
                <div><strong>Mesa:</strong> <span className="font-mono">{check.nroMesa}</span></div>
                <div><strong>Cubiertos:</strong> <span className="font-mono">{formatCurrency(check.totalCubiertos, "es-AR", "ARS")}</span></div>
                <div><strong>Fecha:</strong> <span className="font-mono">{formatDate(new Date(check.fecha), "en-US")}</span></div>
                <div><strong>Mozo:</strong> <span className="font-mono">{check.nombreMozo}</span></div>
                <div className="col-span-2"><strong>Pedido N°:</strong> <span className="font-mono">{check.pedido.idPedido}</span></div>
            </section>

            <section className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-semibold uppercase text-slate-600">
                    <span>Producto</span>
                    <span>Total</span>
                </div>
                {check.pedido.lines.map(line => (
                    <div key={line.nombreProducto} className="flex justify-between items-start font-mono text-sm">
                        <div className="pr-4">
                            <p className="font-semibold text-slate-700">{line.nombreProducto}</p>
                            <p className="text-xs text-slate-500">{line.cantidad} x {formatCurrency(line.montoUnitario, "es-AR", "ARS")}</p>
                        </div>
                        <span className="font-semibold text-right">{formatCurrency(line.importe, "es-AR", "ARS")}</span>
                    </div>
                ))}
            </section>

            <section className="pt-6 border-t-2 border-dashed border-slate-300">
                <div className="space-y-2 font-mono text-md">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(check.pedido.subtotal, "es-AR", "ARS")}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-600">Impuestos (IVA 21%):</span>
                        <span className="font-semibold">{formatCurrency(check.pedido.importeImpuestos, "es-AR", "ARS")}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 mt-2 border-t border-slate-300">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(check.pedido.total, "es-AR", "ARS")}</span>
                    </div>
                </div>
            </section>

            <footer className="text-center mt-8 pt-6 border-t border-slate-200">
                <p className="text-lg font-semibold">¡Gracias por su visita!</p>
                <p className="text-xs text-slate-500 mt-2">{check.razonSocial}</p>
            </footer>
        </div>
    );
};