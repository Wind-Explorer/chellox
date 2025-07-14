import { Button, Input, NumberInput } from "@heroui/react";
import { useState } from "react";
import { commands } from "../../bindings";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [numLines, setNumLines] = useState<number | undefined>(undefined);
  const [submissionResponse, setSubmissionResponse] = useState("");

  const handleSubmit = async () => {
    if (numLines !== undefined && numLines !== null && numLines > 0) {
      const result = await commands.readLastLines(userInput, numLines);
      if (result.status === "ok") {
        setSubmissionResponse(result.data.join("\n"));
      } else {
        setSubmissionResponse(`Error: ${result.error}`);
      }
    } else {
      const result = await commands.readFileByPath(userInput);
      if (result.status === "ok") {
        setSubmissionResponse(result.data);
      } else {
        setSubmissionResponse(`Error: ${result.error}`);
      }
    }
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          label="Path to log file"
          value={userInput}
          onValueChange={setUserInput}
        />
        <NumberInput
          value={numLines}
          onValueChange={setNumLines}
          min={1}
          label="Last N lines (optional)"
          className="min-w-12"
        />
        <Button size="lg" color="primary" onPress={handleSubmit}>
          Submit
        </Button>
      </div>
      <textarea
        className="size-full p-4 bg-default-500/10 rounded-xl shadow-small"
        value={submissionResponse}
        onChange={(e) => setSubmissionResponse(e.target.value)}
      />
    </div>
  );
}
