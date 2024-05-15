import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Collapse,
    CollapseProps,
    Descriptions,
    Empty,
    Space,
    Tooltip,
    Typography,
} from "antd";
import ContactContext from "../context";
import moment from "moment";
import { TContact, TDeal, TWallData } from "../../../entities";
import { ArrowRightOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";

const CollapsibleDetails = ({ logs }: { logs?: TWallData[] }) => {
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
        // {
        //     key: "1",
        //     label: "SMART INSIGTHS",
        //     children: (
        //         <Descriptions column={1}>
        //             <Descriptions.Item label="Last Communication">
        //                 {getLastCommunication}
        //             </Descriptions.Item>
        //             <Descriptions.Item label="Last Communication On">
        //                 {moment(getLastCommunicationDate).fromNow()}
        //             </Descriptions.Item>
        //             {/* <Descriptions.Item label="Open Deals">
        //                 {getOpen} (${getOpenTotal})
        //             </Descriptions.Item>
        //             <Descriptions.Item label="Deals Won">
        //                 {getWon} (${getWonTotal})
        //             </Descriptions.Item>
        //             <Descriptions.Item label="Activities">
        //                 {getActivity}
        //             </Descriptions.Item> */}
        //         </Descriptions>
        //     ),
        // },
        // {
        //     key: "2",
        //     label: "EMAIL SUBSCRIPTIONS",
        //     children: <p>Not subscribed to any email subscriptions.</p>,
        // },
        // {
        //     key: "3",
        //     label: `DEALS (${contact.deals?.length}) `,
        //     children: (
        //         <>
        //             <Descriptions column={1}>
        //                 {contact.deals?.map((deal) => {
        //                     return (
        //                         <Descriptions.Item label="Stage">
        //                             {deal.stage?.name}
        //                         </Descriptions.Item>
        //                     );
        //                 })}
        //             </Descriptions>
        //         </>
        //     ),
        // },
        // // {
        // //     key: "4",
        // //     label: "ASSOCIATED DEALS (0)",
        // //     children: <p>No deals found.</p>,
        // // },
        // {
        //     key: "5",
        //     label: "LISTS",
        //     children: <p>Not added to any list</p>,
        // },

        {
            key: "4",
            label: `Logs`,
            children: (
                <>
                    <Descriptions column={1} size="small">
                        {logs?.map((log) => {
                            return (
                                <Descriptions.Item
                                    // label={`${log.update?.title}`}
                                    label={
                                        <Tooltip
                                            title={
                                                <Space direction="vertical">
                                                    {`By: ${log.update?.by}`}
                                                    {`On: ${moment
                                                        .utc(log.date)
                                                        .local()
                                                        .format(
                                                            "MMM DD hh:mm A"
                                                        )}`}
                                                    {`${moment
                                                        .utc(log.date)
                                                        .fromNow(true)} ago`}
                                                </Space>
                                            }
                                        >
                                            {log.update?.title.replace(
                                                "updated",
                                                ""
                                            )}
                                        </Tooltip>
                                    }
                                >
                                    <Tooltip
                                        title={
                                            <Space direction="vertical">
                                                {`By: ${log.update?.by}`}
                                                {`On: ${moment
                                                    .utc(log.date)
                                                    .local()
                                                    .format("MMM DD hh:mm A")}`}
                                                {`${moment
                                                    .utc(log.date)
                                                    .fromNow(true)} ago`}
                                            </Space>
                                        }
                                    >
                                        <Space>
                                            {/* {log.update?.from ? (
                                            <Paragraph
                                                ellipsis={{
                                                    rows: 2,
                                                    expandable: true,
                                                    symbol: "see more",
                                                }}
                                            >
                                                {log.update?.from}
                                            </Paragraph>
                                        ) : (
                                            <span
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                blank
                                            </span>
                                        )} */}
                                            {/* <ArrowRightOutlined /> */}
                                            {log.update?.to ? (
                                                <Paragraph
                                                    style={{ marginBottom: 0 }}
                                                    ellipsis={{
                                                        rows: 2,
                                                        expandable: true,
                                                        symbol: "see more",
                                                    }}
                                                >
                                                    {log.update?.to}
                                                </Paragraph>
                                            ) : (
                                                <span style={{}}>blank</span>
                                            )}
                                        </Space>
                                    </Tooltip>
                                </Descriptions.Item>
                            );
                        })}
                    </Descriptions>
                </>
            ),
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
