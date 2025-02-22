import { Space } from "antd";
import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { useLoggedInUser } from "./api/query/userQuery";
import ImportDataGSheetHeader from "./components/ImportDataGSheetHeader";
import LoadingComponent from "./components/LoadingComponent";
import SideMenu from "./components/SideMenu";
import AdminSideMenu from "./components/SuperAdmin/AdminSideMenu";
import { allowedroleToAccess } from "./constants";
import { AppContextProvider } from "./context/AppContext";
import { CallProvider } from "./context/CallContext";
import ContactSetup from "./pages/ContactSetup";
import ContactView from "./pages/ContactView";
import Deal from "./pages/Deal";
import DealPipelineSetup from "./pages/DealPipelineSetup";
import DealSetup from "./pages/DealSetup";
import BulkAction from "./pages/PageContacts/BulkAction";
import Contacts from "./pages/PageContacts/Contacts";
import MergeContacts from "./pages/PageContacts/MergeContacts";
import PageDashboard from "./pages/PageDashboard/PageDashboard";
import CallForwarding from "./pages/Setup/CallForwarding";
import ComponentImportData from "./pages/Setup/Components/ComponentImportData";
import ImportDataGSheet from "./pages/Setup/Components/ImportDataGSheet";
import ImportDataGSheetHistory from "./pages/Setup/Components/ImportDataGSheetHistory";
import Setup from "./pages/Setup/Setup";
import SetupLayout from "./pages/Setup/SetupLayout";
import AdminDashboard from "./pages/SuperAdmin/Dashboard/AdminDashboard";
import AdminUsers from "./pages/SuperAdmin/Users/AdminUsers";
import TextBoxView from "./pages/Texts/components/TextBoxView";
import TextTemplates from "./pages/TextTemplates";
import Users from "./pages/Users";
import AddEditUser from "./pages/Users/AddEditUser";
import RoorDataMapping from "./pages/Setup/Components/RoorDataMapping";
import OpenPhoneAudioImport from "./pages/Setup/Components/OpenPhoneAudioImport";
import StopWordList from "./pages/Setup/Components/StopWordList";

const AppRoutes = () => {
    const { user, isLoading, isError } = useLoggedInUser();

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (isError) {
        window.location.href = "/";
    }
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
                            {/* <Route
                                path="/deals/:dealId"
                                element={
                                    <PrivateRoute>
                                        <DealDetail />
                                    </PrivateRoute>
                                }
                            /> */}
                            {/* <Route
                                path="/inbox"
                                element={
                                    <PrivateRoute>
                                        <Inbox />
                                    </PrivateRoute>
                                }
                            /> */}
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
                            {/* <Route
                                path="/setup/customizations/activity-types"
                                element={
                                    <PrivateRoute
                                        accessibleTo={allowedroleToAccess}
                                    >
                                        <SetupLayout
                                            content={<ComponentActivityType />}
                                            title="Activity Types"
                                        />
                                    </PrivateRoute>
                                }
                            /> */}
                            <Route
                                path="/setup/data-administration/import-file"
                                element={
                                    <PrivateRoute>
                                        <SetupLayout
                                            content={<ComponentImportData />}
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
                                            content={<OpenPhoneAudioImport />}
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
                                            content={
                                                <Space
                                                    direction="vertical"
                                                    className="w-100"
                                                >
                                                    <ImportDataGSheetHeader />
                                                    <ImportDataGSheet />
                                                </Space>
                                            }
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
                                                <Space
                                                    direction="vertical"
                                                    className="w-100"
                                                >
                                                    <ImportDataGSheetHeader />
                                                    <ImportDataGSheetHistory />
                                                </Space>
                                            }
                                            title="Import Data From Google Sheet"
                                        />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
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
