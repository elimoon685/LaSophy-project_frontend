import { GetCommentResponse } from "@/inference/BookCommentResponseType"
export function findPathInRoot(root: GetCommentResponse, targetId: number): number[] {
    const path: number[] = [];
    const dfs = (n: GetCommentResponse): boolean => {
      path.push(n.commentsId);
      if (n.commentsId === targetId) return true;
      for (const ch of n.replies ?? []) if (dfs(ch)) return true;
      path.pop();
      return false;
    };
    return dfs(root) ? path : [];
  }