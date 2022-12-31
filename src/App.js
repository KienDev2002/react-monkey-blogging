import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import DashboardLayout from "./module/dashboard/DashboardLayout";
import PostManage from "./module/post/PostManage";
import SignInPage from "./pages/authPage/SignInPage";
import SignUpPage from "./pages/authPage/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostDetailsPage from "~/pages/PostDetailsPage";
import PostAddNew from "./module/post/PostAddNew";
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
                <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
                <Route
                    path="/:slug"
                    element={<PostDetailsPage></PostDetailsPage>}
                ></Route>
                <Route element={<DashboardLayout></DashboardLayout>}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage></DashboardPage>}
                    ></Route>
                    <Route
                        path="/manage/post"
                        element={<PostManage></PostManage>}
                    ></Route>
                    <Route
                        path="/manage/add-post"
                        element={<PostAddNew></PostAddNew>}
                    ></Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
