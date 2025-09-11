import { Route, Routes } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import DrinksList from "../features/Products/pages/DrinksList";
import FoodsList from "../features/Products/pages/FoodsList";

export function ClientRouter() {
  return (
    <Routes>
      <Route element={<ClientMainLayout />}>
        <Route path="/Cliente"></Route>
        <Route path="/Cliente/Menu" element={<Menu />} />
        <Route path="/Cliente/Menu/Comidas" element={<FoodsList />} />
        <Route path="/Cliente/Menu/Bebidas" element={<DrinksList />} />
      </Route>
    </Routes>
  );
}
