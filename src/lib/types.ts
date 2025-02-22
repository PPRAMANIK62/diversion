import { type Result } from "@e2b/code-interpreter";
import { type ToolInvocation } from "ai";

export type ToolResult = (ToolInvocation & {
  result: Result;
})[];

export type CustomFiles = {
  name: string;
  contentType: string;
  content: string;
};
