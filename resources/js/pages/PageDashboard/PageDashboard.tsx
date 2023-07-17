import React from "react";
import DashboardComponentButtons from "./Components/DashboardComponentButtons";
import DashboardComponentFilters from "./Components/DashboardComponentFilters";
import DashboardComponentWidget from "./Components/DashboardComponentWidget";

interface MyProps {
    props: any;
}

const PageDashboard: React.FC = () => {
    return (
        <>
            <DashboardComponentButtons />

            <DashboardComponentFilters />

            <DashboardComponentWidget />
        </>
    );
};

export default PageDashboard;
