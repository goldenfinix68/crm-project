import React, { useEffect } from "react";
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
import Welcome from "./pages/Welcome";
import Users from "./pages/Users";
import Home from "./pages/Home";
import AddEditUser from "./pages/Users/AddEditUser";
import PageDashboard from "./pages/PageDashboard/PageDashboard";
import Contacts from "./pages/PageContacts/Contacts";

import Activity from "./pages/Activity";
import Deal from "./pages/Deal";
import Inbox from "./pages/Inbox/Inbox";
// css

//
import { useLoggedInUser } from "./api/query/userQuery";
import Dialer from "./pages/Dialer/Dialer";
import ContactView from "./pages/ContactView";
import LoadingComponent from "./components/LoadingComponent";
import DealDetail from "./pages/Deal/DealDetail";
import Texts from "./pages/Texts/index";
import MergeContacts from "./pages/PageContacts/MergeContacts";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordVerifyToken from "./pages/ForgotPasswordVerifyToken";
import { CallProvider } from "./context/CallContext";
import Setup from "./pages/Setup/Setup";
import SetupLayout from "./pages/Setup/SetupLayout";
import ComponentTagManagement from "./pages/Setup/Components/ComponentTagManagement";
import ComponentImportData from "./pages/Setup/Components/ComponentImportData";
import TextTemplates from "./pages/TextTemplates";
import ComponentActivityType from "./pages/Setup/Components/ComponentActivityType";
import ActivityCalendar from "./pages/Activity/ActivityCalendar";
import BulkAction from "./pages/PageContacts/BulkAction";
import TextBoxView from "./pages/Texts/components/TextBoxView";
import { AppContextProvider } from "./context/AppContext";
import ContactSetup from "./pages/ContactSetup";
import DealSetup from "./pages/DealSetup";
import ActivitySetup from "./pages/ActivitySetup";
import DealPipelineSetup from "./pages/DealPipelineSetup";
import { allowedroleToAccess } from "./constants";
import CallForwarding from "./pages/Setup/CallForwarding";
import { GiftOutlined } from "@ant-design/icons";
import { Space } from "antd";
import AdminSideMenu from "./components/SuperAdmin/AdminSideMenu";
import AdminDashboard from "./pages/SuperAdmin/Dashboard/AdminDashboard";
import AdminUsers from "./pages/SuperAdmin/Users/AdminUsers";
import ImportDataGSheet from "./pages/Setup/Components/ImportDataGSheet";
import ImportDataGSheetHeader from "./components/ImportDataGSheetHeader";
import ImportDataGSheetHistory from "./pages/Setup/Components/ImportDataGSheetHistory";
import AppRoutes from "./AppRoutes";
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
