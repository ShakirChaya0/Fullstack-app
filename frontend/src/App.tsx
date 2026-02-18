import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./shared/contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
        <AppRouter/>
    </AuthProvider>
  )
}

export default App

