import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import SignInPage from "./pages/authPage/SignInPage";
import SignUpPage from "./pages/authPage/SignUpPage";
import HomePage from "./pages/HomePage";
function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                <Route
                    path="/sign-up"
                    element={<SignUpPage></SignUpPage>}
                ></Route>
                <Route
                    path="/sign-in"
                    element={<SignInPage></SignInPage>}
                ></Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
