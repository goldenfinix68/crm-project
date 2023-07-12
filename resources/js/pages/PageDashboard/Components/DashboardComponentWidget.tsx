import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Row, Space } from "antd";
import { faFilter, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Responsive, WidthProvider } from "react-grid-layout";

const DashboardComponentWidget: React.FC = () => {
    const ResponsiveGridLayout = WidthProvider(Responsive);
    // const layouts = getLayoutsFromSomewhere();

    return (
        <>
            <ResponsiveGridLayout
                className="layout"
                // layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
                <Card
                    title="Everything to get started with Salesmate"
                    key={"1"}
                    // data-grid={{ x: 0, y: 0, w: 1, h: 2, static: true }}
                    // data-grid={{ x: 4, y: 0, w: 1, h: 2 }}
                    data-grid={{ x: 1, y: 0, w: 12, h: 3, minW: 1, maxW: 12 }}
                ></Card>
                <Card
                    title="Deal pipeline"
                    key={"2"}
                    data-grid={{ x: 0, y: 0, w: 12, h: 2, minW: 1, maxW: 12 }}
                ></Card>
                <Card
                    title="My agenda"
                    key={"3"}
                    data-grid={{ x: 0, y: 0, w: 6, h: 3, minW: 1, maxW: 12 }}
                ></Card>
                <Card
                    title="Deal performance"
                    key={"4"}
                    data-grid={{ x: 6, y: 0, w: 6, h: 3, minW: 1, maxW: 12 }}
                ></Card>
                <Card
                    title="Activity performance overview"
                    key={"5"}
                    data-grid={{ x: 0, y: 0, w: 6, h: 3, minW: 1, maxW: 12 }}
                ></Card>
                <Card
                    title="Contacts most recently updated"
                    key={"6"}
                    data-grid={{ x: 6, y: 0, w: 6, h: 3, minW: 1, maxW: 12 }}
                ></Card>
            </ResponsiveGridLayout>
        </>
    );
};

export default DashboardComponentWidget;
