import Check from "../components/Check";
import { PrintIcon } from "../components/IconComponents";
import PaymentMethodModal from "../components/PaymentMethodModal";
import { printStyles } from "../constants/PaymentConstants";

import { useCheck } from "../hooks/useCheck";
import CheckSkeleton from "./CheckSkeleton";

export default function CheckPage() {
  const { data: check, isLoading, isError } = useCheck();

  return (
    <>
      {isLoading ? <CheckSkeleton /> 
        : isError ? <div className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center min-h-screen p-4">
            Error al cargar la cuenta. Intente nuevamente.
          </div>
        : (
            <>
              <style>{printStyles}</style>
              <section className="w-full bg-[var(--background-200)] flex flex-col items-center justify-center min-h-screen p-4">
                <div className="print-container">
                  <Check check={check!} />
                </div>

                <div className="no-print mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-md">
                  <button 
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center bg-[var(--secondary-100)] hover:bg-[var(--secondary-200)] cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-all duration-100 active:scale-95 active:bg-teal-900"
                  >
                    <PrintIcon />
                    Imprimir / Guardar PDF
                  </button>
                  <PaymentMethodModal />
                </div>
              </section>
          </>
        )
      }
    </>
  );
}