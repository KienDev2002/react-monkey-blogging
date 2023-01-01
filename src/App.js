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

import UserAddNew from "./drafts/UserAddNew";
import UserManage from "./drafts/UserManage";
import UserProfile from "./drafts/UserProfile";
import CategoryManage from "./module/category/CategoryManage";
import CategoryAddNew from "./module/category/CategoryAddNew";
import CategoryUpdate from "./module/category/CategoryUpdate";
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
                    <Route
                        path="/manage/category"
                        element={<CategoryManage></CategoryManage>}
                    ></Route>
                    <Route
                        path="/manage/add-category"
                        element={<CategoryAddNew></CategoryAddNew>}
                    ></Route>
                    <Route
                        path="/manage/update-category"
                        element={<CategoryUpdate></CategoryUpdate>}
                    ></Route>
                    <Route
                        path="/manage/user"
                        element={<UserManage></UserManage>}
                    ></Route>
                    <Route
                        path="/manage/add-user"
                        element={<UserAddNew></UserAddNew>}
                    ></Route>
                    <Route
                        path="/profile"
                        element={<UserProfile></UserProfile>}
                    ></Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
