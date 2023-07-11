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
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
    const isLoginPage = window.location.pathname === "/";

    return (
        <Router>
            {isLoginPage ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            ) : (
                <SideMenu>
                    <Routes>
                        <PrivateRoute
                            path="/dashboard"
                            exact
                            component={PageDashboard}
                        />
                        <PrivateRoute path="/users" component={Users} />
                        <PrivateRoute
                            path="/users/new"
                            exact
                            component={AddEditUser}
                        />
                        <PrivateRoute
                            path="/users/:userId"
                            exact
                            component={AddEditUser}
                        />
                        <PrivateRoute path="/home" exact component={Home} />
                    </Routes>
                </SideMenu>
            )}
        </Router>
    );
};

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById("app")
);
