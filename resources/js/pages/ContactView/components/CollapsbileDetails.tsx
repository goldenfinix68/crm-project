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

const CollapsibleDetails = () => {
    const { contact } = useContext(ContactContext);
    const [getLastCommunication, setGetLastCommunication] = useState("SMS");
    const [getLastCommunicationDate, setGetLastCommunicationDate] =
        useState("");

    const [getOpen, setGetOpen] = useState(0);
    const [getOpenTotal, setGetOpenTotal] = useState(0);

    const [getWon, setGetWon] = useState(0);
    const [getWonTotal, setGetWonTotal] = useState(0);
    const [getActivity, setGetActivity] = useState(0);
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

            var open = 0;
            var open_total = 0;

            var won = 0;
            var won_total = 0;

            var activity = 0;
            contact.wall?.forEach((x) => {
                if (x.type == "activity") {
                    activity++;
                }
                if (x.type == "deal") {
                    if (x.deal?.status == "Open") {
                        var a: string | undefined = x.deal?.value;
                        open++;
                        open_total = open_total + (a ? parseFloat(a) : 0);
                    }
                    if (x.deal?.status == "Won") {
                        var a: string | undefined = x.deal?.value;
                        won++;
                        won_total = won_total + (a ? parseFloat(a) : 0);
                    }
                }
            });
            setGetOpen(open);
            setGetOpen(open_total);

            setGetWon(won);
            setGetWonTotal(won_total);
            setGetActivity(activity);
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
                    <Descriptions.Item label="Open Deals">
                        {getOpen} (${getOpenTotal})
                    </Descriptions.Item>
                    <Descriptions.Item label="Deals Won">
                        {getWon} (${getWonTotal})
                    </Descriptions.Item>
                    <Descriptions.Item label="Activities">
                        {getActivity}
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
