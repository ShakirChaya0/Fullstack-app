import { Route } from "react-router";
import { Menu } from "../features/Products/components/Menu";
import { lazy, Suspense } from "react";
import { SkeletonBody } from "../features/Products/components/skeletonBody";
const FoodsListed = lazy(() => import("../features/Products/components/FoodsList"))
const DrinksListed = lazy(() => import("../features/Products/components/DrinksList"))


export function ProductsRouter() {
  return (
    <>
        <Route path="/Menu" element={<Menu/>}/>
        <Route path="/Comidas" element={
            <Suspense fallback={<SkeletonBody/>}>
                <FoodsListed/>
            </Suspense>
        }/>
        <Route path="/Bebidas" element={
            <Suspense fallback={<SkeletonBody/>}>
                <DrinksListed/>
            </Suspense>
        } />
    </>
  );
}