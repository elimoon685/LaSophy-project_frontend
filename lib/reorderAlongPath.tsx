import { GetCommentResponse } from "@/inference/BookCommentResponseType";
import { moveToFrontImmutable } from "./moveToFront";
export function reorderAlongPath(
    node: GetCommentResponse,
    path: number[],
    i = 0
  ): GetCommentResponse {
    const curId = path[i];
    if (node.commentsId !== curId) return node;
  
    const nextId = path[i + 1];
  
    
    const cloned: GetCommentResponse = {
      ...node,
      replies: node.replies ? [...node.replies] : [],
    };
  
  
    if (nextId != null && cloned.replies.length) {
      const moved = moveToFrontImmutable(
        cloned.replies,
        (c) => c.commentsId === nextId
      );
      cloned.replies = moved;
  
      if (cloned.replies[0] && cloned.replies[0].commentsId === nextId) {
        cloned.replies[0] = reorderAlongPath(cloned.replies[0], path, i + 1);
      }
    }
  
    return cloned;
  }