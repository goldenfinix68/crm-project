import React, { Suspense } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { useLoggedInUser } from "./api/query/userQuery";
import LoadingComponent from "./components/LoadingComponent";
import SideMenu from "./components/SideMenu";
import AdminSideMenu from "./components/SuperAdmin/AdminSideMenu";
import { allowedroleToAccess } from "./constants";
import { AppContextProvider } from "./context/AppContext";
import { CallProvider } from "./context/CallContext";
import SetupLayout from "./pages/Setup/SetupLayout";
import AdminDashboard from "./pages/SuperAdmin/Dashboard/AdminDashboard";
import AdminUsers from "./pages/SuperAdmin/Users/AdminUsers";
import { Card, Layout, theme } from "antd";
import LoadingComponent2 from "./components/LoadingComponent2";
import CallForwarding from "./pages/Setup/CallForwarding";
import Users from "./pages/Users";
import PageDashboard from "./pages/PageDashboard/PageDashboard";
import AddEditUser from "./pages/Users/AddEditUser";
import ContactView from "./pages/ContactView";
import Contacts from "./pages/PageContacts/Contacts";
import MergeContacts from "./pages/PageContacts/MergeContacts";
import Deal from "./pages/Deal";
import BulkAction from "./pages/PageContacts/BulkAction";
import TextTemplates from "./pages/TextTemplates";
import TextBoxView from "./pages/Texts/components/TextBoxView";
import Setup from "./pages/Setup/Setup";
import ContactSetup from "./pages/ContactSetup";
import DealSetup from "./pages/DealSetup";
import DealPipelineSetup from "./pages/DealPipelineSetup";
import ComponentImportData from "./pages/Setup/Components/ComponentImportData";
import RoorDataMapping from "./pages/Setup/Components/RoorDataMapping";
import StopWordList from "./pages/Setup/Components/StopWordList";
import OpenPhoneAudioImport from "./pages/Setup/Components/OpenPhoneAudioImport";
import ImportDataGSheet from "./pages/Setup/Components/ImportDataGSheet";
import ImportDataGSheetHistory from "./pages/Setup/Components/ImportDataGSheetHistory";

const AppRoutes = () => {
    const { user, isLoading, isError } = useLoggedInUser();

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (isError) {
        window.location.href = "/";
    }

    // const LazyContactView = React.lazy(() => import("./pages/ContactView"));
    // const LazyPageDashboard = React.lazy(
    //     () => import("./pages/PageDashboard/PageDashboard")
    // );
    // const LazyCallForwarding = React.lazy(
    //     () => import("./pages/Setup/CallForwarding")
    // );
    // const LazyUsers = React.lazy(() => import("./pages/Users"));
    // const LazyAddEditUser = React.lazy(
    //     () => import("./pages/Users/AddEditUser")
    // );
    // const LazyContacts = React.lazy(
    //     () => import("./pages/PageContacts/Contacts")
    // );
    // const LazyMergeContacts = React.lazy(
    //     () => import("./pages/PageContacts/MergeContacts")
    // );
    // const LazyDeal = React.lazy(() => import("./pages/Deal"));
    // const LazyTextTemplates = React.lazy(() => import("./pages/TextTemplates"));
    // const LazyTextBoxView = React.lazy(
    //     () => import("./pages/Texts/components/TextBoxView")
    // );
    // const LazySetup = React.lazy(() => import("./pages/Setup/Setup"));
    // const LazyContactSetup = React.lazy(() => import("./pages/ContactSetup"));
    // const LazyDealSetup = React.lazy(() => import("./pages/DealSetup"));
    // const LazyDealPipelineSetup = React.lazy(
    //     () => import("./pages/DealPipelineSetup")
    // );
    // const LazyRoorDataMapping = React.lazy(
    //     () => import("./pages/Setup/Components/RoorDataMapping")
    // );
    // const LazyStopWordList = React.lazy(
    //     () => import("./pages/Setup/Components/StopWordList")
    // );
    // const LazyOpenPhoneAudioImport = React.lazy(
    //     () => import("./pages/Setup/Components/OpenPhoneAudioImport")
    // );
    // const LazyImportDataGSheet = React.lazy(
    //     () => import("./pages/Setup/Components/ImportDataGSheet")
    // );
    // const LazyImportDataGSheetHistory = React.lazy(
    //     () => import("./pages/Setup/Components/ImportDataGSheetHistory")
    // );
    // const LazyComponentImportData = React.lazy(
    //     () => import("./pages/Setup/Components/ComponentImportData")
    // );
    // const LazyBulkAction = React.lazy(
    //     () => import("./pages/PageContacts/BulkAction")
    // );

    return (
        <>
            {user?.role == "superAdmin" ? (
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute accessibleTo={["superAdmin"]}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute accessibleTo={["superAdmin"]}>
                                <AdminUsers />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            ) : (
                <AppContextProvider>
                    <CallProvider>
                        <Suspense fallback={<LoadingComponent2 />}>
                            <Routes>
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute title="Dashboard">
                                            <PageDashboard props={""} />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/call-forwarding"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<CallForwarding />}
                                                title="Call Forwarding"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/users"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<Users />}
                                                title="Users"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/users/new"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<AddEditUser />}
                                                title="Users"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/users/:userId"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<AddEditUser />}
                                                title="Users"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/contacts/:contactId"
                                    element={
                                        <PrivateRoute title="Contacts">
                                            <ContactView />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/contacts/:contactId/:contactName"
                                    element={
                                        <PrivateRoute title="Contacts">
                                            <ContactView />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/contacts"
                                    element={
                                        <PrivateRoute title="Contacts">
                                            <Contacts />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/contacts/mergeContacts"
                                    element={<MergeContacts />}
                                />
                                <Route
                                    path="/deals"
                                    element={
                                        <PrivateRoute title="Deals">
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
                                        <PrivateRoute title="Texts">
                                            <TextBoxView />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-threads/:threadId"
                                    element={
                                        <PrivateRoute title="Texts">
                                            <TextBoxView />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/text-threads/contact/:contactId"
                                    element={
                                        <PrivateRoute title="Texts">
                                            <TextBoxView />
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
                                    path="/setup/customizations/contact"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<ContactSetup />}
                                                title="Contact"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/deal"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<DealSetup />}
                                                title="Deal"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/customizations/deal-pipeline"
                                    element={
                                        <PrivateRoute
                                            accessibleTo={allowedroleToAccess}
                                        >
                                            <SetupLayout
                                                content={<DealPipelineSetup />}
                                                title="Deal Pipeline"
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

                                <Route
                                    path="/setup/data-administration/roor-data-mapping"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<RoorDataMapping />}
                                                title="Roor Data Mapping"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/data-administration/stop-word-list"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<StopWordList />}
                                                title=""
                                            />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/setup/data-administration/openphone-audio-import"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={
                                                    <OpenPhoneAudioImport />
                                                }
                                                title="Manual Audio Import"
                                            />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/setup/data-administration/import-file-gsheet"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={<ImportDataGSheet />}
                                                title="Import Data From Google Sheet"
                                            />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/setup/data-administration/import-file-gsheet/history"
                                    element={
                                        <PrivateRoute>
                                            <SetupLayout
                                                content={
                                                    <ImportDataGSheetHistory />
                                                }
                                                title="Import Data From Google Sheet"
                                            />
                                        </PrivateRoute>
                                    }
                                />
                            </Routes>
                        </Suspense>
                    </CallProvider>
                </AppContextProvider>
            )}
        </>
    );
};
const PrivateRoute = ({
    children,
    accessibleTo,
    title,
}: {
    children: any;
    accessibleTo?: string[];
    title?: string;
}) => {
    const { user, isLoading } = useLoggedInUser();

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (user) {
        if (
            !accessibleTo ||
            (accessibleTo && accessibleTo.includes(user.role))
        ) {
            if (user?.role == "superAdmin") {
                return <AdminSideMenu>{children}</AdminSideMenu>;
            } else {
                return <SideMenu title={title}>{children}</SideMenu>;
            }
        } else {
            return <Navigate to="/dashboard" />;
        }
    } else {
        return <Navigate to="/" />;
    }
};

export default AppRoutes;
