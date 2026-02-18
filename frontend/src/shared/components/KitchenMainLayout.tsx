import { Outlet } from "react-router";
import KitchenHeader from "./KitchenHeader";
import KitchenFooter from "./KitchenFooter";

export default function KitchenMainLayout() {
  return (
    <>  
      <div className="min-h-screen w-full flex flex-col">
        <KitchenHeader />
          <main className="flex-1 flex justify-center overflow-y-auto">
            <Outlet />
          </main>
      </div>
      <KitchenFooter />
    </>
  );
}