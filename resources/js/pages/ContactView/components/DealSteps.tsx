import React from "react";
import { Tooltip, Steps } from "antd";

import { TDeal } from "../../../entities";

const { Step } = Steps;

interface Props {
    deal: TDeal;
}

const DealSteps = ({ deal }: Props) => {
    const stages = deal.pipeline?.stages;
    const currentStageIndex = stages?.findIndex(
        (stage) => stage.id === deal.stageId!
    );

    return (
        <Steps size="small" current={currentStageIndex}>
            {stages?.map((stage, index) => (
                <Step
                    key={stage.id}
                    title={<Tooltip title={stage.name}>{stage.name}</Tooltip>}
                    style={{
                        opacity:
                            index < currentStageIndex!
                                ? 0.5 + 0.5 * (index / (stages.length - 1))
                                : index === currentStageIndex
                                ? 1
                                : 0.5,
                    }}
                />
            ))}
        </Steps>
    );
};

export default DealSteps;
