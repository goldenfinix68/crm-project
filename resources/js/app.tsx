import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";
import SideMenu from "./components/SideMenu";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// css
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../sass/dashboard/dashboard.css";
import "../sass/helper/helper.css";
import "./assets/css/activity/activity.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "../sass/contacts/contacts.css";

// Pages
import Welcome from "./pages/Welcome";
import Users from "./pages/Users";
import Home from "./pages/Home";
import AddEditUser from "./pages/Users/AddEditUser";
import PageDashboard from "./pages/PageDashboard/PageDashboard";
import Contacts from "./pages/PageContacts/Contacts";
import Activity from "./pages/Activity";
import Deal from "./pages/Deal";
// css

//
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
                                    <PageDashboard props={""} />
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
                        <Route path="/contacts" element={<Contacts />} />

                        <Route
                            path="/activities"
                            element={
                                <PrivateRoute>
                                    <Activity />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/deals"
                            element={
                                <PrivateRoute>
                                    <Deal />
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
