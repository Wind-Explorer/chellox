import { Button, Input } from "@heroui/react";
import type { LogFileInputProps } from "./types";

export default function LogFileInput({
  userInput,
  onUserInputChange,
  numLines,
  onNumLinesChange,
  onSubmit,
}: LogFileInputProps) {
  return (
    <div className="flex gap-2 items-center p-2">
      <Input
        placeholder="Path to log file"
        value={userInput}
        onValueChange={onUserInputChange}
        size="sm"
      />
      <div className="flex flex-row gap-2 items-center min-w-80">
        <Input
          placeholder="Last N lines (optional)"
          type="number"
          min={1}
          /// @ts-ignore
          value={numLines}
          /// @ts-ignore
          onValueChange={onNumLinesChange}
          size="sm"
        />
        <Button size="sm" radius="sm" color="primary" onPress={onSubmit}>
          Load
        </Button>
      </div>
    </div>
  );
}
