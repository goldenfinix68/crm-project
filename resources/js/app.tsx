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
import AddEditUser from "./pages/Users/components/AddEditUser";

const App: React.FC = () => {
    return (
        <Router>
            {/* <Navigation /> */}
            <SideMenu>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/new" element={<AddEditUser />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </SideMenu>
        </Router>
    );
};

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById("app")
);
