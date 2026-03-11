export interface ExplainRequest {
  code: string;
}

export interface ExplainResponse {
  explanation: string;
}

export interface DebugRequest {
  code: string;
  error?: string;
}

export interface DebugResponse {
  debugging: string;
}

export interface GenerateRequest {
  language?: string;
  description: string;
}

export interface GenerateResponse {
  code: string;
}

export interface Tab {
  id: "explain" | "debug" | "generate";
  label: string;
  icon: string;
  gradient: string;
}

export interface FeatureGrid {
  title: string;
  description: string;
  icon: string;
}

export interface HistoryItem {
  id: string;
  type: "explain" | "debug" | "generate";
  input: string;
  output: string;
  timestamp: string;
}