import { Outlet } from "react-router";
import ClientHeader from "./ClientHeader";
import { ClientFooter } from "./ClientFooter";

export default function ClientMainLayout() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <ClientHeader />
        <main className="flex-1 flex justify-center overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ClientFooter />
    </>
  );
}