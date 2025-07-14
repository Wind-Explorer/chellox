import { Button, Input, NumberInput } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { commands } from "../../bindings";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [numLines, setNumLines] = useState<number | undefined>(undefined);
  const [submissionResponse, setSubmissionResponse] = useState<string[]>([]);
  const [maxTableHeight, setMaxTableHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 250 : 800
  );

  // Update maxTableHeight on window resize
  useEffect(() => {
    function handleResize() {
      setMaxTableHeight(window.innerHeight - 130);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    content: line,
  }));

  const columns = [{ key: "content", label: "Line" }];

  return (
    <div className="p-4 max-h-full flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          label="Path to log file"
          value={userInput}
          onValueChange={setUserInput}
          size="sm"
        />
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
      <div className="max-h-full overflow-auto">
        <Table
          hideHeader
          isVirtualized
          aria-label="Log file lines"
          selectionBehavior="replace"
          selectionMode="multiple"
          className="max-h-full overflow-auto"
          maxTableHeight={maxTableHeight}
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
                {() => (
                  <TableCell>
                    <span className="whitespace-pre-wrap opacity-70">
                      {item.content}
                    </span>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
