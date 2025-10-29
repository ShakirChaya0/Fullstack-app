import { PDFDownloadLink } from "@react-pdf/renderer";
import Check from "../components/Check";
import { PrintIcon } from "../components/IconComponents";
import PaymentMethodModal from "../components/PaymentMethodModal";
import { printStyles } from "../constants/PaymentConstants";
import { useCheck } from "../hooks/useCheck";
import CheckSkeleton from "./CheckSkeleton";
import { lazy } from "react";
import { useBlockNavigation } from "../../../shared/hooks/useBlockNavigation";
const CheckPDF = lazy(() => import("../components/CheckPDF"));

export default function CheckPage() {
  // useBlockNavigation(true)
  const { data: check, isLoading, isError } = useCheck();

  return (
    <>
      {isLoading ? <CheckSkeleton /> 
        : isError ? (
          <div className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center p-6">
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-6 max-w-md text-center shadow-md">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p className="mb-4">No se pudo generar la cuenta. Por favor, intente nuevamente.</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition active:scale-95"
              >
                Reintentar
              </button>
            </div>
          </div>
        )
        : (
            <>
              <style>{printStyles}</style>
              <section className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center min-h-screen p-4">
                <div className="print-container">
                  <Check check={check!} />
                </div>

                <div className="no-print mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-md">
                  <PDFDownloadLink
                    document={<CheckPDF check={check!} />}
                    fileName={`comprobante-pedido-${check?.pedido.idPedido}.pdf`}
                    className="w-full flex items-center justify-center bg-[var(--secondary-100)] hover:bg-[var(--secondary-200)] cursor-pointer text-white font-bold rounded-lg transition-all duration-100 active:scale-95 active:bg-teal-900"
                  >
                    {({ loading }) => (
                      <button
                        className="w-full flex items-center justify-center bg-[var(--secondary-100)] hover:bg-[var(--secondary-200)] cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-all duration-100 active:scale-95 active:bg-teal-900"
                      >
                        <PrintIcon />
                        {loading ? "Generando..." : "Descargar Comprobante PDF"}
                      </button>
                    )}
                  </PDFDownloadLink>

                  <PaymentMethodModal />
                </div>
              </section>
          </>
        )
      }
    </>
  );
}