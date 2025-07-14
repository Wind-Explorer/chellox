import { Button, getKeyValue, Input, NumberInput } from "@heroui/react";
import type { Selection } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";
import { commands } from "../../bindings";
import AutoSizer from "react-virtualized-auto-sizer";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [numLines, setNumLines] = useState<number | undefined>(undefined);
  const [submissionResponse, setSubmissionResponse] = useState<string[]>([]);
  const [selectedLogEntries, setSelectedLogEntries] = useState<Selection>(
    new Set(["2"])
  );

  const handleSubmit = async () => {
    const tailLines =
      numLines !== undefined && numLines !== null && numLines > 0
        ? numLines
        : null;
    const result = await commands.readFile(userInput, tailLines);
    if (result.status === "ok") {
      setSubmissionResponse(result.data);
    } else {
      setSubmissionResponse([`Error: ${result.error}`]);
    }
  };

  // Prepare table rows
  const rows = submissionResponse.map((line, idx) => ({
    key: idx.toString(),
    lineNumber: idx + 1,
    content: line,
  }));

  const columns = [
    { key: "lineNumber", label: "#" },
    { key: "content", label: "Line" },
  ];

  return (
    <div className="size-full flex flex-col">
      <div className="flex gap-4 items-center p-4">
        <Input
          label="Path to log file"
          value={userInput}
          onValueChange={setUserInput}
          size="sm"
        />
        <div className="flex flex-row gap-4 min-w-80">
          <NumberInput
            value={numLines}
            onValueChange={setNumLines}
            min={1}
            label="Last N lines (optional)"
            size="sm"
          />
          <Button size="lg" radius="sm" color="primary" onPress={handleSubmit}>
            Load
          </Button>
        </div>
      </div>
      <div className="size-full overflow-auto bg-default-400/20">
        <AutoSizer>
          {({ scaledHeight, scaledWidth }) => (
            <Table
              hideHeader
              isVirtualized
              aria-label="Log file lines"
              selectionBehavior="replace"
              selectionMode="multiple"
              selectedKeys={selectedLogEntries}
              onSelectionChange={setSelectedLogEntries}
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
    </div>
  );
}
