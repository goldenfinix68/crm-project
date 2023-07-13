import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";
import SideMenu from "./components/SideMenu";
import Users from "./pages/Users";
import AddEditUser from "./pages/Users/AddEditUser";

// css
import "../sass/dashboard/dashboard.css";
import PageDashboard from "./pages/PageDashboard/PageDashboard";
import { useLoggedInUser } from "./api/query/userQuery";
import Dialer from "./pages/Dialer/Dialer";

const App: React.FC = () => {
    const isLoginPage = window.location.pathname === "/";
    const isDialer = window.location.pathname === "/dialer";

    return (
        <Router>
            {isLoginPage ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            ) : isDialer ? (
                <Routes>
                    <Route path="/dialer" element={<Dialer />} />
                </Routes>
            ) : (
                <SideMenu>
                    <Routes>
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <PageDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <PrivateRoute>
                                    <Users />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users/new"
                            element={
                                <PrivateRoute>
                                    <AddEditUser />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users/:userId"
                            element={
                                <PrivateRoute>
                                    <AddEditUser />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </SideMenu>
            )}
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useLoggedInUser();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return user ? children : <Navigate to="/" />;
};

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById("app")
);
