import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Collapse,
    CollapseProps,
    Descriptions,
    Empty,
    Space,
    Typography,
} from "antd";
import ContactContext from "../context";
import moment from "moment";
import { TDeal, TWallData } from "../../../entities";

const CollapsibleDetails = () => {
    const { contact } = useContext(ContactContext);
    const [getLastCommunication, setGetLastCommunication] = useState("SMS");
    const [getLastCommunicationDate, setGetLastCommunicationDate] =
        useState("");

    useEffect(() => {
        if (contact) {
            contact.wall?.every((x) => {
                if (x.type == "call" || x.type == "text") {
                    setGetLastCommunication(x.type == "call" ? "Call" : "SMS");
                    setGetLastCommunicationDate(x.date);
                    return false;
                }
                return true;
            });
        }
    }, [contact]);
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
                        {getLastCommunication}
                    </Descriptions.Item>
                    <Descriptions.Item label="Last Communication On">
                        {moment(getLastCommunicationDate).fromNow()}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Open Deals">
                        {getOpen} (${getOpenTotal})
                    </Descriptions.Item>
                    <Descriptions.Item label="Deals Won">
                        {getWon} (${getWonTotal})
                    </Descriptions.Item>
                    <Descriptions.Item label="Activities">
                        {getActivity}
                    </Descriptions.Item> */}
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
            label: `DEALS (${contact.deals?.length}) `,
            children: (
                <>
                    <Descriptions column={1}>
                        {contact.deals?.map((deal) => {
                            return (
                                <Descriptions.Item label="Stage">
                                    {deal.stage?.name}
                                </Descriptions.Item>
                            );
                        })}
                    </Descriptions>
                </>
            ),
        },
        // {
        //     key: "4",
        //     label: "ASSOCIATED DEALS (0)",
        //     children: <p>No deals found.</p>,
        // },
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
