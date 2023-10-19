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
import IncomingCallListener from "./pages/Dialer/DialerTab/IncomingCallListener";
import { CallProvider } from "./context/CallContext";
import Setup from "./pages/Setup/Setup";
import SetupLayout from "./pages/Setup/SetupLayout";
import ComponentTagManagement from "./pages/Setup/Components/ComponentTagManagement";
import ComponentImportData from "./pages/Setup/Components/ComponentImportData";
import TextTemplates from "./pages/TextTemplates";
import ComponentActivityType from "./pages/Setup/Components/ComponentActivityType";
import Pusher from "pusher-js";
import ActivityCalendar from "./pages/Activity/ActivityCalendar";
import BulkAction from "./pages/PageContacts/BulkAction";
import TextBoxView from "./pages/Texts/components/TextBoxView";
import { AppContextProvider } from "./context/AppContext";
import ContactSetup from "./pages/ContactSetup";
import DealSetup from "./pages/DealSetup";
import ActivitySetup from "./pages/ActivitySetup";
const App: React.FC = () => {
    const isLoginPage = window.location.pathname === "/";
    const isForgotPassword = window.location.pathname === "/forgot-password";
    const isForgotPasswordVerify =
        window.location.pathname === "/forgot-password-verify";

    const pusher = new Pusher((window as any).PUSHER_APP_KEY, {
        cluster: (window as any).PUSHER_APP_CLUSTER,
    });

    useEffect(() => {
        // Subscribe to the Pusher channel and bind to the event
        const channel = pusher.subscribe("text-channel");
        channel.bind("text-received", (data) => {
            console.log("Received a text:", data);
            queryClient.invalidateQueries("textThreads");
            queryClient.invalidateQueries("thread");
        });

        // Clean up the subscription when the component unmounts
        return () => {
            channel.unbind("text-received");
            pusher.unsubscribe("text-channel");
        };
    }, []);

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
                <AppContextProvider>
                    <CallProvider>
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
                                    path="/dialer/:contactId"
                                    element={
                                        <PrivateRoute>
                                            <Dialer />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/dialer"
                                    element={
                                        <PrivateRoute>
                                            <Dialer />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/users"
                                    element={
                                        <PrivateRoute>
                                            <Users />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/users/new"
                                    element={
                                        <PrivateRoute>
                                            <AddEditUser />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/users/:userId"
                                    element={
                                        <PrivateRoute>
                                            <AddEditUser />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/contacts/:contactId"
                                    element={
                                        <PrivateRoute>
                                            <ContactView />
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
                                <Route
                                    path="/contacts"
                                    element={<Contacts />}
                                />
                                <Route
                                    path="/contacts/mergeContacts"
                                    element={<MergeContacts />}
                                />

                                <Route
                                    path="/activities"
                                    element={
                                        <PrivateRoute>
                                            <Activity />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/activities/calendar"
                                    element={
                                        <PrivateRoute>
                                            <ActivityCalendar />
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
                                <Route
                                    path="/bulk-action"
                                    element={
                                        <PrivateRoute>
                                            <BulkAction />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/deals/:dealId"
                                    element={
                                        <PrivateRoute>
                                            <DealDetail />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/inbox"
                                    element={
                                        <PrivateRoute>
                                            <Inbox />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-templates"
                                    element={
                                        <PrivateRoute>
                                            <TextTemplates />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-templates/:route"
                                    element={
                                        <PrivateRoute>
                                            <TextTemplates />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-threads"
                                    element={
                                        <PrivateRoute>
                                            <Texts />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-threads/:threadId"
                                    element={
                                        <PrivateRoute>
                                            <TextBoxView />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/texts/:route"
                                    element={
                                        <PrivateRoute>
                                            <Texts />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup"
                                    element={
                                        <PrivateRoute>
                                            <Setup />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/tag"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={
                                                    <ComponentTagManagement />
                                                }
                                                title="Tag Management"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/contact"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<ContactSetup />}
                                                title="Contact"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/activity"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<ActivitySetup />}
                                                title="Activity"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/deal"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<DealSetup />}
                                                title="Deal"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/activity-types"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={
                                                    <ComponentActivityType />
                                                }
                                                title="Activity Types"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/data-administration/import-file"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={
                                                    <ComponentImportData />
                                                }
                                                title="Import Data"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                            </Routes>
                        </SideMenu>
                    </CallProvider>
                </AppContextProvider>
            )}
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useLoggedInUser();

    if (isLoading) {
        return <LoadingComponent />;
    }

    return user ? children : <Navigate to="/" />;
};

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById("app")
);
