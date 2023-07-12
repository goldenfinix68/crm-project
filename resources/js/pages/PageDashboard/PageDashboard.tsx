import React from "react";
import DashboardComponentButtons from "./Components/DashboardComponentButtons";
import DashboardComponentFilters from "./Components/DashboardComponentFilters";

export default function PageDashboard() {
    return (
        <>
            <DashboardComponentButtons />

            <DashboardComponentFilters />
        </>
    );
}
