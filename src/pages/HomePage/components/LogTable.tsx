import { getKeyValue } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Key } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import type { LogTableProps } from "./types";

const columns = [
  { key: "lineNumber", label: "#" },
  { key: "content", label: "Line" },
];

export default function LogTable({
  rows,
  selectedLogEntries,
  onSelectionChange,
}: LogTableProps) {
  return (
    <div className="size-full overflow-auto bg-default-400/20">
      <AutoSizer>
        {({ scaledHeight, scaledWidth }) => (
          <Table
            hideHeader
            isVirtualized
            aria-label="Log file lines"
            selectionBehavior={
              (selectedLogEntries as Set<Key>).size > 1 ? "toggle" : "replace"
            }
            selectionMode="multiple"
            selectedKeys={selectedLogEntries}
            onSelectionChange={onSelectionChange}
            className="*:bg-transparent *:p-0 w-screen h-max"
            width={scaledWidth}
            radius="none"
            maxTableHeight={scaledHeight}
            shadow="none"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      <span
                        className={
                          "text-nowrap text-xs font-mono " +
                          (columnKey === "lineNumber" ? "opacity-50" : "")
                        }
                      >
                        {getKeyValue(item, columnKey)}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </AutoSizer>
    </div>
  );
}
