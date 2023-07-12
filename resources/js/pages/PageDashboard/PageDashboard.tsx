import React from "react";
import DashboardComponentButtons from "./Components/DashboardComponentButtons";
import DashboardComponentFilters from "./Components/DashboardComponentFilters";
import DashboardComponentWidget from "./Components/DashboardComponentWidget";

export default function PageDashboard() {
    return (
        <>
            <DashboardComponentButtons />

            <DashboardComponentFilters />

            <DashboardComponentWidget />
        </>
    );
}
