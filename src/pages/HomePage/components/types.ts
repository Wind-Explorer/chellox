export interface LogEntry {
  key: string;
  lineNumber: number;
  content: string;
}

export interface LogFileInputProps {
  userInput: string;
  onUserInputChange: (value: string) => void;
  numLines: number | undefined;
  onNumLinesChange: (value: number | undefined) => void;
  onSubmit: () => void;
}

export interface LogTableProps {
  rows: LogEntry[];
  selectedLogEntries: any;
  onSelectionChange: (selection: any) => void;
}
