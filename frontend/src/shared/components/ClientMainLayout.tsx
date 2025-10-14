import { Outlet } from "react-router";
import ClientHeader from "./ClientHeader";
import { ClientFooter } from "./ClientFooter";

export function ClientMainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <ClientHeader />
        <main className="flex h-[100vh] justify-center">
          <Outlet />
        </main>
      <ClientFooter />
    </div>
  );
}