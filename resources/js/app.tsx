import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById("app"));
