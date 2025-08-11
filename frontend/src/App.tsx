import Header from "./shared/components/header"
import { Footer } from "./shared/components/footer"
import AppRouter from "./routes/AppRouter"

function App() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Header/>
        <AppRouter/>
      <Footer/>
    </main>
  )
}

export default App

