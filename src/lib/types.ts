export type TaskStatus = "pending" | "running" | "success" | "error";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  url?: string;
  command?: string;
};

export type UploadedFileRef = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string; // optional text for preview
};
