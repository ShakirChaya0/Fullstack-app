import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import KitchenMainLayout from "../shared/components/KitchenMainLayout";
import SuggestionSkeletonBody from "../features/Suggestions/pages/SuggestionSkeletonBody";
import ProfileCardSkeleton from "../features/Profile/components/ProfileCardSkeleton";
import UserProfile from "../features/Profile/pages/UserProfile";
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
          <Suspense fallback = {<ProfileCardSkeleton/>}>
            <UserProfile />
          </Suspense>
        }/>
        <Route path="/Pedidos"/>
      </Route>
    </Routes>
  );
}