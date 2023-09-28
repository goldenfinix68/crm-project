// import React, { useContext, useEffect, useRef, useState } from "react";
// import {
//     Button,
//     Col,
//     Dropdown,
//     Input,
//     Modal,
//     Radio,
//     Row,
//     Space,
//     Table,
//     Tooltip,
//     Typography,
//     Form,
//     Select,
//     DatePicker,
//     Menu,
//     Popover,
//     Tag,
// } from "antd";

// import { CloseOutlined, LeftOutlined } from "@ant-design/icons";

// import { useMutation } from "react-query";
// import {
//     assignLabelMutation,
//     createTextLabelMutation,
//     sendTextMutation,
// } from "../../../api/mutation/useTextMutation";
// import queryClient from "../../../queryClient";
// import TextForm from "../../Texts/components/TextForm";
// import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
// import { TContact, TTextLabel, TTextTemplateFolder } from "../../../entities";
// import { createTextTemplateFolderMutation } from "../../../api/mutation/useTextTemplateMutation";
// import ContactContext from "../../ContactView/context";
// import { useTextLabels } from "../../../api/query/textQuery";
// import {
//     updateContactMutation,
// } from "../../../api/mutation/useContactMutation";

// const AssignLabelDropdown = () => {
//     const { labels, isLoading: isLabelsLoading } = useTextLabels();
//     const { contact } = useContext(ContactContext);
//     const [tagSearchKey, setTagSearchKey] = React.useState("");
//     const assignLabelContact = useMutation(assignLabelMutation, {
//         onSuccess: () => {
//             queryClient.invalidateQueries("contacts");
//             queryClient.invalidateQueries("getContact");
//         },
//     });

//     const handleTypeChange = async (e) => {
//         await assignLabelContact.mutate({
//             ...contact,
//             textLabelId: e.key,
//         });
//     };
//     return (
//         <Dropdown
//             overlay={
//                 <Menu
//                     onClick={handleTypeChange}
//                     selectedKeys={[contact?.typeId ?? "0"]}
//                 >
//                     <Menu.Item key="search">
//                         <Input
//                             placeholder="Search"
//                             onKeyUp={(e: any) =>
//                                 setTagSearchKey(e.target.value)
//                             }
//                             onClick={(e) => e.stopPropagation()}
//                         />
//                     </Menu.Item>
//                     <Menu.Item key="disabled" disabled>
//                         <Typography.Text strong>
//                             SELECT TEXT TYPE
//                         </Typography.Text>
//                     </Menu.Item>

//                     <Menu.Item key={0}>
//                         <Tag>No Type</Tag>
//                     </Menu.Item>
//                     {labels
//                         ?.filter((label) => label.name.includes(tagSearchKey))
//                         ?.map((type) => (
//                             <Menu.Item key={type.id}>
//                                 <Tag>{type.name}</Tag>
//                             </Menu.Item>
//                         ))}
//                 </Menu>
//             }
//             trigger={["click"]}
//         >
//             {contact.label?.name ? (
//                 <Tag style={{ cursor: "pointer" }}>{contact.label?.name}</Tag>
//             ) : (
//                 <Tag style={{ cursor: "pointer" }}>No Type</Tag>
//             )}
//         </Dropdown>
//     );
// };

// export default AssignLabelDropdown;
