import { BrowserRouter, Routes } from "react-router"
import { ProductsRouter } from "./routes/productsRouter"
import Header from "./shared/components/header"
import { Footer } from "./shared/components/footer"

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <BrowserRouter>
        <Header/>
        <Routes>
            {ProductsRouter()}
        </Routes>
        <Footer/>
      </BrowserRouter>
    </main>
  )
}

export default App

