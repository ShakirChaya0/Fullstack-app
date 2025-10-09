import { Outlet } from "react-router";
import WaiterHeader from "./WaiterHeader";
import { WaiterFooter } from "./WaiterFooter";

export function WaiterMainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <WaiterHeader />
        <main className="flex-1 flex">
          <Outlet />
        </main>
      <WaiterFooter />
    </div>
  );
}