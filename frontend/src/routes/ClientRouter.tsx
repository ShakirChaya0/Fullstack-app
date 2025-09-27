import { Route, Routes } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import DrinksList from "../features/Products/pages/DrinksList";
import FoodsList from "../features/Products/pages/FoodsList";
import ConfirmOrder from "../features/Products/pages/ConfirmOrder";
import { Suspense } from "react";
import ProfileCardSkeleton from "../features/Profile/components/ProfileCardSkeleton";
import UserProfile from "../features/Profile/pages/UserProfile";

export function ClientRouter() {
  return (
    <Routes>
      <Route element={<ClientMainLayout />}>
        <Route path="/"></Route>
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Menu/Comidas" element={<FoodsList />} />
        <Route path="/Menu/Bebidas" element={<DrinksList />} />
        <Route path="/Menu/RealizarPedido" element={<ConfirmOrder/>}/>
        <Route path="/Perfil" element={
          <Suspense fallback = {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
      </Route>
    </Routes>
  );
}
