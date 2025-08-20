import { Route } from "react-router";
import { Menu } from "../features/Products/pages/Menu";
import { lazy, Suspense } from "react";
import SkeletonBody from "../features/Products/pages/skeletonBody";
import { ClientMainLayout } from "../shared/components/ClientMainLayout";
const FoodsListed = lazy(() => import("../features/Products/pages/FoodsList"))
const DrinksListed = lazy(() => import("../features/Products/pages/DrinksList"))



export function ClientRouter() {
  return (
    <>
        <Route element={<ClientMainLayout/>}>
            <Route path="/Menu" element={<Menu/>}/>
            <Route path="/Menu/Comidas" element={
                <Suspense fallback={<SkeletonBody/>}>
                    <FoodsListed />
                </Suspense>
            }/>
            <Route path="/Menu/Bebidas" element={
                <Suspense fallback={<SkeletonBody/>}>
                    <DrinksListed/>
                </Suspense>
            } />
        </Route>
    </>
  );
}