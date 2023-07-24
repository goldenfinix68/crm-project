import React from "react";
import {
    Button,
    Collapse,
    CollapseProps,
    Descriptions,
    Empty,
    Space,
    Typography,
} from "antd";

const CollapsibleDetails = () => {
    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    const text = `
A dog is a type of domesticated animal.
Known for its loyalty and faithfulness,
it can be found as a welcome guest in many households across the world.
`;

    const items: CollapseProps["items"] = [
        {
            key: "1",
            label: "SMART INSIGTHS",
            children: (
                <Descriptions column={1}>
                    <Descriptions.Item label="Last Communication">
                        Call
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Communication On">
                        16 days ago
                    </Descriptions.Item>
                    <Descriptions.Item label="Open Deals">
                        0 ($0)
                    </Descriptions.Item>
                    <Descriptions.Item label="Deals Won">
                        0 ($0)
                    </Descriptions.Item>
                    <Descriptions.Item label="Activities">
                        0/3
                    </Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: "2",
            label: "EMAIL SUBSCRIPTIONS",
            children: <p>Not subscribed to any email subscriptions.</p>,
        },
        {
            key: "3",
            label: "DEALS (0)",
            children: <p>No deals found.</p>,
        },
        {
            key: "4",
            label: "ASSOCIATED DEALS (0)",
            children: <p>No deals found.</p>,
        },
        {
            key: "5",
            label: "LISTS",
            children: <p>Not added to any list</p>,
        },
    ];

    return (
        <Collapse
            items={items}
            defaultActiveKey={["1", 2, 3, 4, 5]}
            onChange={onChange}
        />
    );
};

export default CollapsibleDetails;
