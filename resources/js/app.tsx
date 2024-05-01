import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// css
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../sass/app/app.css";
import "../sass/navigation/navigation.css";
import "../sass/dashboard/dashboard.css";
import "../sass/helper/helper.css";
import "../sass/activity/activity.css";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "../sass/contacts/contacts.css";
import "../sass/deals/deals.css";
import "../sass/setup/setup.css";

// Pages

// css

//
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordVerifyToken from "./pages/ForgotPasswordVerifyToken";
import AppRoutes from "./AppRoutes";
import LoadingComponent2 from "./components/LoadingComponent2";
const App: React.FC = () => {
    const isLoginPage = window.location.pathname === "/";
    const isForgotPassword = window.location.pathname === "/forgot-password";
    const isForgotPasswordVerify =
        window.location.pathname === "/forgot-password-verify";

    return (
        <Router>
            {isLoginPage ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            ) : isForgotPassword ? (
                <Routes>
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                </Routes>
            ) : isForgotPasswordVerify ? (
                <Routes>
                    <Route
                        path="/forgot-password-verify"
                        element={<ForgotPasswordVerifyToken />}
                    />
                </Routes>
            ) : (
                <AppRoutes />
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
