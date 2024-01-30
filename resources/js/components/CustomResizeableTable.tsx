import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Resizable } from "react-resizable";

const CustomResizeableTable = ({
    columns,
    dataSource,
    localStorageKey,
    ...tableProps
}) => {
    const [columnsState, setColumnsState] = useState(columns);

    const handleResize =
        (index) =>
        (e, { size }) => {
            setColumnsState((prevColumns) => {
                const nextColumns = [...prevColumns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                };
                return nextColumns;
            });
        };

    const components = {
        header: {
            cell: ResizableTableHeader,
        },
    };

    const resizableColumns = columnsState.map((col, index) => {
        return {
            ...col,
            onHeaderCell: (column) => ({
                width: col.key === "rowSelection" ? 10 : column.width,
                onResize: handleResize(index),
            }),
        };
    });

    useEffect(() => {
        // Check for saved column widths in localStorage
        const savedColumnWidthsString = localStorage.getItem(localStorageKey);
        const savedColumnWidths = savedColumnWidthsString
            ? JSON.parse(savedColumnWidthsString)
            : [];

        // Use saved widths or set default widths
        const updatedColumns = columns.map((col, index) => ({
            ...col,
            width:
                savedColumnWidths && savedColumnWidths[index]
                    ? savedColumnWidths[index]
                    : col.width || 100,
        }));
        setColumnsState(updatedColumns);
    }, []);

    useEffect(() => {
        // Save column widths to localStorage when columnsState changes
        const columnWidths = columnsState.map((col) => col.width);
        localStorage.setItem(localStorageKey, JSON.stringify(columnWidths));
    }, [columnsState, localStorageKey]);

    return (
        <Table
            {...tableProps}
            components={components}
            columns={resizableColumns}
            dataSource={dataSource}
        />
    );
};

const ResizableTitle = ({ onResize, width, ...restProps }) => {
    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

const ResizableTableHeader = (props) => {
    const { onResize, width, ...restProps } = props;

    return <ResizableTitle onResize={onResize} width={width} {...restProps} />;
};

export default CustomResizeableTable;
