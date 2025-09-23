interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-lg">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer rounded-lg bg-amber-600 text-white hover:bg-amber-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
