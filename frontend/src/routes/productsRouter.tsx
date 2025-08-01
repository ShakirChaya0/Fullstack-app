import { Route } from "react-router";
import { Menu } from "../features/Products/components/Menu";
import { lazy, Suspense } from "react";
import { Skeleton } from "@mui/material";
const FoodsListed = lazy(() => import("../features/Products/components/FoodsList"))
const DrinksListed = lazy(() => import("../features/Products/components/DrinksList"))


export function ProductsRouter() {
  return (
    <>
        <Route path="/Menu" element={<Menu/>}/>
        <Route path="/Comidas" element={
            <Suspense fallback={<Skeleton
                sx={{ bgcolor: 'grey.900' }}
                variant="rectangular"
                width={1920}
                height={200}
            />}>
                <FoodsListed/>
            </Suspense>
        }/>
        <Route path="/Bebidas" element={
            <Suspense fallback={<Skeleton
                sx={{ bgcolor: 'grey.900' }}
                variant="rectangular"
                width={210}
                height={118}
            />}>
                <DrinksListed/>
            </Suspense>
        } />
    </>
  );
}