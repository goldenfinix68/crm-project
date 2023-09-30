import React, { useState } from "react";
import { Card, Space } from "antd";
import { useParams } from "react-router-dom";
import SentBox from "./components/SentBox";
import TextsHeaderMenu from "./components/TextsHeaderMenu";
import TextList from "./components/TextList";

const Texts = () => {
    const { route } = useParams();
    const [label, setLabel] = useState("");
    const isChatBox = ["all", "inbox"].includes(route ?? "all");
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <TextsHeaderMenu
                handleLabelChange={(e) => setLabel(`{{label:${e.key}}} `)}
            />
            <Card>
                {isChatBox ? (
                    <TextList label={label} />
                ) : (
                    <SentBox menu={route} />
                )}
            </Card>
        </Space>
    );
};

export default Texts;
