import React from "react";
import { Dropdown, Input, Typography, Menu, Tag, Checkbox } from "antd";

import { useMutation } from "react-query";
import { assignLabelMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import { TTextThread } from "../../../entities";
import { useTextLabels } from "../../../api/query/textQuery";

const AssignLabelDropdown = ({ thread }: { thread: TTextThread }) => {
    const { labels, isLoading: isLabelsLoading } = useTextLabels();
    const [tagSearchKey, setTagSearchKey] = React.useState("");
    const [checkedLabels, setCheckedLabels] = React.useState<any>([]);
    const assignLabelContact = useMutation(assignLabelMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("threads");
        },
    });

    const handleTypeChange = async (e) => {
        // await assignLabelContact.mutate({
        //     ...contact,
        //     textLabelId: e.key,
        // });
    };
    return (
        <Dropdown
            overlay={
                <Menu
                    onClick={handleTypeChange}
                    style={{ pointerEvents: "none" }}
                >
                    <Menu.Item key="search">
                        <Input
                            placeholder="Search"
                            onKeyUp={(e: any) =>
                                setTagSearchKey(e.target.value)
                            }
                        />
                    </Menu.Item>
                    <Menu.Item key="disabled" disabled>
                        <Typography.Text strong>SELECT LABEL</Typography.Text>
                    </Menu.Item>

                    {labels
                        ?.filter((label) => label.name.includes(tagSearchKey))
                        ?.map((label) => (
                            <Menu.Item key={label.id}>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={checkedLabels.includes(
                                            label.id
                                        )} // Check if the label is selected
                                        onChange={(e) => {
                                            if (
                                                e.target.checked &&
                                                !checkedLabels.includes(
                                                    label.id
                                                )
                                            ) {
                                                setCheckedLabels([
                                                    ...checkedLabels,
                                                    label.id,
                                                ]);
                                            }
                                            if (
                                                !e.target.checked &&
                                                checkedLabels.includes(label.id)
                                            ) {
                                                setCheckedLabels(
                                                    checkedLabels.filter(
                                                        (checkedLabel) =>
                                                            checkedLabel !==
                                                            label.id
                                                    )
                                                );
                                            }
                                        }}
                                    >
                                        <Tag>{label.name}</Tag>
                                    </Checkbox>
                                </div>
                            </Menu.Item>
                        ))}
                    {checkedLabels.length ? (
                        <>
                            <Menu.Divider />
                            <Menu.Item key="apply">
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // setIsCreateNewTypeOpen(true);
                                    }}
                                >
                                    Apply
                                </a>
                            </Menu.Item>
                        </>
                    ) : null}
                </Menu>
            }
            trigger={["click"]}
        >
            <Typography.Text onClick={(e) => e.stopPropagation()}>
                Assign Label
            </Typography.Text>
        </Dropdown>
    );
};

export default AssignLabelDropdown;
