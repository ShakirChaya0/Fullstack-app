import { Route, Routes } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
import DrinksList from "../features/Products/pages/DrinksList";
import FoodsList from "../features/Products/pages/FoodsList";

export function ClientRouter() {
  return (
    <Routes>
      <Route element={<ClientMainLayout />}>
        <Route path="menu" element={<Menu />} />
        <Route path="menu/comidas" element={<FoodsList />} />
        <Route path="menu/bebidas" element={<DrinksList />} />
      </Route>
    </Routes>
  );
}
