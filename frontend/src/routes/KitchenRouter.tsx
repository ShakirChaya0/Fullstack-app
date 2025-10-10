import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import KitchenMainLayout from "../shared/components/KitchenMainLayout";
const OrdersSkeleton = lazy(() => import("../features/KitchenOrders/pages/OrdersSkeleton"));
const OrdersDashboard = lazy(() => import("../features/KitchenOrders/pages/OrdersDashboard"));
const SuggestionSkeletonBody = lazy(() => import("../features/Suggestions/pages/SuggestionSkeletonBody"));
const ProfileCardSkeleton = lazy(() => import("../features/Profile/components/ProfileCardSkeleton"));
const UserProfile = lazy(() => import("../features/Profile/pages/UserProfile"));
const SuggestionsPage = lazy(() => import("../features/Suggestions/pages/SuggestionsPage"))

export function KitchenRouter() {
  return (
    <Routes>
      <Route element={<KitchenMainLayout/>}>
        <Route path="/" element={<h1>Hola cocina</h1>}/>
        <Route path="/Sugerencias" element={
          <Suspense fallback={<SuggestionSkeletonBody/>}>
            <SuggestionsPage/>
          </Suspense>}
        />
        <Route path="/Perfil" element={
          <Suspense fallback= {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
        <Route path="/Pedidos" element={
          <Suspense fallback= {<OrdersSkeleton/>}>
            <OrdersDashboard />
          </Suspense>
        }/>
      </Route>
    </Routes>
  );
}