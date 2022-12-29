import { Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
function App() {
    return (
        <AuthProvider>
            <div>
                <Routes></Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
