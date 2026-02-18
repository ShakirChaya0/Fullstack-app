import { Outlet } from "react-router";
import AdminHeader from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

export default function AdminMainLayout() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col">
        <AdminHeader />
          <main className="flex-1 flex justify-center overflow-y-auto">
            <Outlet />
          </main>
      </div>
      <AdminFooter />
    </>
  );
}