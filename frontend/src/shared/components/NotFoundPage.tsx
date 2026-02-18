import { Link } from "react-router";

function NotFoundPage() {  // Cuando hagamos la página de inicio, cambiar el Link a esa ruta
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="text-gray-700 mb-6">
        Lo sentimos, no pudimos encontrar la página que buscas.
      </p>
      <Link
        to="/" 
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFoundPage;