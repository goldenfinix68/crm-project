import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import { QueryClientProvider } from "react-query";
import queryClient from "./queryClient";
import SideMenu from "./components/SideMenu";
import Users from "./pages/Users";
import AddEditUser from "./pages/Users/AddEditUser";
import Contacts from "./pages/Activities/Contacts";

const App: React.FC = () => {
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === "/";
    return (
        <Router>
            {/* <Navigation /> */}
            {isLoginPage ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            ) : (
                <SideMenu>
                    <Routes>
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/new" element={<AddEditUser />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/contacts" element={<Contacts />} />
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
