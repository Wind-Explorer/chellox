import type { Selection } from "@heroui/react";
import { useState } from "react";
import { commands } from "../../bindings";
import { LogEntry } from "./components/types";
import LogFileInput from "./components/LogFileInput";
import LogTable from "./components/LogTable";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [numLines, setNumLines] = useState<number | undefined>(undefined);
  const [submissionResponse, setSubmissionResponse] = useState<string[]>([]);
  const [selectedLogEntries, setSelectedLogEntries] = useState<Selection>(
    new Set([])
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
  const rows: LogEntry[] = submissionResponse.map((line, idx) => ({
    key: idx.toString(),
    lineNumber: idx + 1,
    content: line,
  }));

  return (
    <div className="size-full flex flex-col">
      <LogFileInput
        userInput={userInput}
        onUserInputChange={setUserInput}
        numLines={numLines}
        onNumLinesChange={setNumLines}
        onSubmit={handleSubmit}
      />
      <LogTable
        rows={rows}
        selectedLogEntries={selectedLogEntries}
        onSelectionChange={setSelectedLogEntries}
      />
    </div>
  );
}
