import { GetCommentResponse } from "@/inference/BookCommentResponseType";
import { findPathInRoot } from "./findPathInRoot";
import { moveToFrontImmutable } from "./moveToFront";
import { reorderAlongPath } from "./reorderAlongPath";

type PromoteResult = {
  list: GetCommentResponse[];  
  path: number[];                  
};
export function promoteTargetThread(
    roots: GetCommentResponse[],
    targetId?: number
  ): PromoteResult{
    if (!targetId) return { list: roots, path: []};
  
  
    let hitIdx = -1;
    let path: number[] = [];
    for (let i = 0; i < roots.length; i++) {
      const p = findPathInRoot(roots[i], targetId);
      if (p.length) {
        hitIdx = i;
        path = p; 
        break;
      }
    }
    if (hitIdx === -1) return {list: roots, path: [], }
  
   
    const movedRoots = moveToFrontImmutable(
      roots,
      (r) => r.commentsId === roots[hitIdx].commentsId
    );
  
   
    const newTop = reorderAlongPath(movedRoots[0], path, 0);
  
    
    return {
       list: [newTop, ...movedRoots.slice(1)],
       path,
      }
  }