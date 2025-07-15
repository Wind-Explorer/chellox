import { Button, Input, NumberInput } from "@heroui/react";
import type { LogFileInputProps } from "./types";

export default function LogFileInput({
  userInput,
  onUserInputChange,
  numLines,
  onNumLinesChange,
  onSubmit,
}: LogFileInputProps) {
  return (
    <div className="flex gap-4 items-center p-4">
      <Input
        label="Path to log file"
        value={userInput}
        onValueChange={onUserInputChange}
        size="sm"
      />
      <div className="flex flex-row gap-4 min-w-80">
        <NumberInput
          value={numLines}
          onValueChange={onNumLinesChange}
          min={1}
          label="Last N lines (optional)"
          size="sm"
        />
        <Button size="lg" radius="sm" color="primary" onPress={onSubmit}>
          Load
        </Button>
      </div>
    </div>
  );
}
