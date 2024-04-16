import React from "react";
import { Tooltip, Steps, Popconfirm, message } from "antd";

import { TDeal } from "../../../entities";
import { useMutation } from "react-query";
import { useDealMutation } from "../../../api/mutation/useDealMutation";
import queryClient from "../../../queryClient";

const { Step } = Steps;

interface Props {
    deal: TDeal;
}

const DealSteps = ({ deal }: Props) => {
    const stages = deal.pipeline?.stages;
    const currentStageIndex = stages?.findIndex(
        (stage) => stage.id === deal.stageId!
    );

    const updateDeal = useMutation(useDealMutation, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission
            if (res.success) {
                message.success("Successfully Updated Deal");
                queryClient.invalidateQueries("getContact");
            } else {
                message.error(res.message);
            }
        },
        onError: (error: any) => {
            message.error(error.message);
        },
    });

    return (
        <Steps size="small" current={currentStageIndex}>
            {stages?.map((stage, index) => (
                <Step
                    key={stage.id}
                    title={
                        <Popconfirm
                            title={`Do you want to change deal status to ${stage.name}?`}
                            onConfirm={async () => {
                                updateDeal.mutate({
                                    ...deal,
                                    stageId: stage.id,
                                });
                            }}
                            icon={false}
                        >
                            <Tooltip
                                title={stage.name}
                                style={{ cursor: "pointer" }}
                            >
                                {stage.name}
                            </Tooltip>
                        </Popconfirm>
                    }
                    style={{
                        opacity:
                            index < currentStageIndex!
                                ? 0.5 + 0.5 * (index / (stages.length - 1))
                                : index === currentStageIndex
                                ? 1
                                : 0.5,
                        cursor: "pointer",
                    }}
                />
            ))}
        </Steps>
    );
};

export default DealSteps;
