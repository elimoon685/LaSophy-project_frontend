'use client'
import { useState, useEffect, useRef, memo, useCallback, useLayoutEffect, useMemo } from "react";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import BookApi from "@/api/book";
import React from "react";
import { timeAgo } from "@/lib/CalculateTime";
import { GetCommentResponse } from "@/inference/BookCommentResponseType";
import { insertReplyRecursive } from "@/lib/insertReplyRecursive";
import { DeleteComment } from "@/lib/DeleteComment";
import LikeOrCollectApi from "@/api/like_or_collect";
import toast from "react-hot-toast";
import { findPathInRoot } from "@/lib/findPathInRoot";
import { useRouter } from "next/navigation";
import { promoteTargetThread } from "@/lib/promoteTargetThread";
import { create } from "domain";
type CommentDataForm = {
  bookId: number | null;
  content: string;
}
type commentLikeInfo = { currentLike: boolean; count: number };
type NewBookCommentsPros = {
  bookId: number | null;
  bookComments: GetCommentResponse[];
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>;
  userId: string | undefined,
  commentlikes: Partial<Record<number, Record<number, commentLikeInfo>>>,
  setCommentLikes: React.Dispatch<React.SetStateAction<Partial<Record<number, Record<number, commentLikeInfo>>>>>,
  targetId: number | undefined;
}
type Props = {
  rootParent: GetCommentResponse,
  userId: string | undefined,
  bookId: number | null,
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>,
  setCommentLikes: React.Dispatch<React.SetStateAction<Partial<Record<number, Record<number, commentLikeInfo>>>>>,
  like: Partial<Record<number, commentLikeInfo>>;
  targetPath: number[];
  targetId: number | undefined;

};
type FlatItem = { note: GetCommentResponse; depth: number; parent?: GetCommentResponse };
const NewBookCommentsVersion = ({ bookId, bookComments, setBookComments, userId, commentlikes, setCommentLikes, targetId }: NewBookCommentsPros) => {
  const hasShownDeletedToast = useRef(false);
  const [commentIsFocused, setCommentIsFocused] = useState<boolean>();
  const [newComment, setNewComment] = useState<CommentDataForm>({
    bookId: bookId,
    content: "",
  });


  const { forRender, targetPath } = useMemo(() => {
    if (!targetId) return { forRender: bookComments, targetPath: [] };
    const { list, path } = promoteTargetThread(bookComments, targetId)
    return { forRender: list, targetPath: path };
  },
    [bookComments, targetId]
  );
  useEffect(() => {
    if (!targetId) return;
    if (targetPath.length > 0) return;
    if (hasShownDeletedToast.current) return;
  
    hasShownDeletedToast.current = true;
    toast.error("This comment has been deleted.");
  }, [targetId, targetPath.length]);

  useEffect(() => {
    if (!targetId) return;
    const el = document.getElementById(`comment-${targetId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      el.classList.add("animate-pulse", "bg-gray-100");

      setTimeout(() => {
        el.classList.remove("animate-pulse", "bg-gray-100");
      }, 2000);
    }
  }, [targetId, forRender]);

  const submitFirstLayerComment = async (bookId: number | null, content: string) => {
    if (!content.trim()) return;
    try {
      const commentResponse = await BookApi.createComments({ bookId, content })
      const createdComment = commentResponse.data.data;
      setBookComments(prev => ([createdComment, ...prev]));
      setNewComment(prev => ({ ...prev, content: "" }))
      setCommentIsFocused(prev => prev = false);
      setCommentLikes(prev => {
        return { ...prev, [createdComment.commentsId]: { [createdComment.commentsId]: { currentLike: false, count: 0 } } }
      })
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }

  return (
    <div className="flex flex-col max-w-[700px] pl-5">
      <h1 className="text-2xl mb-5">Comment</h1>
      <div className="flex mb-10 flex-col">
        <div className="flex">
          <RxAvatar className="w-10 h-10 shrink-0" />
          <input className="border-b border-black focus:outline-none px-2 flex-grow"
            id="comment"
            placeholder="Add your comment"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            onFocus={() => setCommentIsFocused(true)}
            onBlur={() => { !newComment.content.trim() && setCommentIsFocused(false) }}

          />
        </div>
        {commentIsFocused &&
          <div className="flex self-end mt-2">
            <button className="font-bold cursor-pointer hover:bg-gray-300 hover:font-bold rounded-2xl px-2 py-1"
              onClick={() => { setNewComment({ ...newComment, content: "" }); setCommentIsFocused(false) }}
            >
              Cancel
            </button>
            <button className={`font-bold cursor-pointer rounded-2xl px-2 py-1 ${!newComment.content.trim() && "bg-gray-200 text-gray-500"}`}
              onClick={() => submitFirstLayerComment(bookId, newComment.content)}
            >Comment</button>
          </div>
        }
      </div>
      <div className="flex max-w-[700px] flex-col">
        {forRender.map(parent => {
          const like = commentlikes[parent.commentsId] ?? {}//{currentLike:parent.commentLikedByMe, count:parent.commentLikesCount};
          return (
            <RenderCommentNote
              key={parent.commentsId}
              rootParent={parent}
              userId={userId}
              bookId={bookId}
              setBookComments={setBookComments}
              setCommentLikes={setCommentLikes}
              like={like}
              targetPath={targetPath}
              targetId={targetId}
            />
          )
        }
        )}
      </div>
    </div>
  )
}

const RenderCommentNote = React.memo(function RenderCommentNote({ rootParent, userId, bookId, setBookComments, setCommentLikes, like, targetPath, targetId }: Props) {
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [newReply, setNewReply] = useState<Record<number, string>>({});
  const [tailVisibleByParent, setTailVisibleByParent] = useState<Record<number, number>>({})
  const [activeReplyId, setActiveReplyId] = useState<number>()
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number>();
  const router = useRouter()
  //useEffect
  useEffect(() => {
    if (activeDeleteMenu == undefined) return;
    const handleMenuOnBlur = (e: MouseEvent) => {
      console.log(btnRefs.current[activeDeleteMenu])
      if (btnRefs.current[activeDeleteMenu] && !btnRefs.current[activeDeleteMenu].contains(e.target as Node)) {
        setActiveDeleteMenu(undefined)
      }
    }
    document.addEventListener("click", handleMenuOnBlur)
    return () => document.removeEventListener("click", handleMenuOnBlur)
  }, [activeDeleteMenu])

  useEffect(() => {
    if (targetPath && tailVisibleByParent[rootParent.commentsId] == null) {
      const init = Math.max(targetPath.length - 2, 0);
      setTailVisibleByParent(prev => ({ ...prev, [rootParent.commentsId]: init }));
    }
  }, [targetPath, rootParent.commentsId, setTailVisibleByParent, tailVisibleByParent]);


  // submit the reply or new layer 0 comment
  const submitReply = async (bookId: number | null, content: string, activeReplyId?: number) => {
    if (!activeReplyId && !content.trim()) return;
    try {
      const commentResponse = await BookApi.createReply({ bookId: bookId, content: content, parentCommentId: activeReplyId })
      const createdComment = commentResponse.data.data;
      const parentId = createdComment.parentCommentId

      setBookComments(prev => insertReplyRecursive(prev, parentId, createdComment))
      setNewReply(prev => {
        if (typeof activeReplyId !== 'number') return prev;
        const { [activeReplyId]: _, ...rest } = prev
        return rest
      })
      setCommentLikes(prev => {
        const curRoot = prev[rootParent.commentsId] ?? {};
        return { ...prev, [rootParent.commentsId]: { ...curRoot, [createdComment.commentsId]: { currentLike: false, count: 0 } } }
      })
      setActiveReplyId(undefined)

    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  //for cancel button 
  const cancelReply = (commentId: number) => {
    setNewReply(prev => {
      const { [commentId]: _, ...rest } = prev;
      return rest;
    });
    setActiveReplyId(undefined);
  }
  //delete the comment
  const deleteComment = async (commentId: number) => {
    setBookComments(prev => DeleteComment(prev, commentId))
    try {
      await BookApi.DeleteComment(commentId)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  // For reply input
  const onBlur = (e: React.FocusEvent<HTMLInputElement>, id: number) => {
    if (!e.currentTarget.value.trim()) {
      setActiveReplyId(undefined);
      setNewReply(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      })
    }
  }

  //flatten comment making comments to array
  const flattenCommentsNode = (root: GetCommentResponse, startDepth = 1, parent?: GetCommentResponse): FlatItem[] => {
    const result: FlatItem[] = [];
    for (const child of root.replies) {
      result.push({ note: child, depth: startDepth, parent: root })
      if (child.replies?.length) {
        result.push(...flattenCommentsNode(child, startDepth + 1, child))
      }
    }
    return result;
  }

  //show more replies button
  const showMoreReplies = (parentId: number, tails: number) =>
    setTailVisibleByParent((prev) => {
      const next = (prev[parentId] ?? 0) + 5;
      return { ...prev, [parentId]: Math.min(next, tails) }
    });

  //submit the comment like
  const submitCommentLike = async (parentId: number, commentId: number, likeOrNot: boolean) => {
    setCommentLikes(prev => {
      const curRoot = prev[parentId] ?? {};
      const baseCount = (curRoot[commentId]?.count ?? 0);
      const delta = likeOrNot ? 1 : -1;
      return { ...prev, [parentId]: { ...curRoot, [commentId]: { currentLike: likeOrNot, count: Math.max(0, baseCount + delta) } } }
    });
    try {

      const likeResponse = await LikeOrCollectApi.getCurrentCommentLike({ commentId: commentId, isLiked: likeOrNot })
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }
  const handleAvatarClick = (createdBy: string, targetedUserId: string) => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }
    if (!targetedUserId) {
      toast.error("User not exist");
      return;
    }
    router.push(`/profile/${targetedUserId}?username=${createdBy}`)
  }
  // for every comment and reply render 
  const singleCommentRender = (comment: GetCommentResponse, depth = 0, parent?: GetCommentResponse) => {
    return (

      <div className={`flex mb-3 ${depth >= 1 && "ml-10"}`} key={comment.commentsId} id={`comment-${comment.commentsId}`}

      >
        <RxAvatar className="w-8 h-8 shrink-0" onClick={() => handleAvatarClick(comment.createdBy, comment.userId)} />
        <div className="flex flex-col flex-grow ml-3">
          <div className="flex items-center gap-5">
            <span className="text-m font-bold">@{comment.createdBy}</span>
            <span className="text-sm font-bold text-gray-500">{timeAgo(comment.createdAtUtc)}</span>
          </div>
          <p>{depth > 1 && <span className="text-gray-600 text-sm font-bold">Reply @{parent?.createdBy}:</span>}{comment.content}</p>
          <div className="flex self-end items-center gap-5">
            <span className="flex items-center">
              {like[comment.commentsId]?.currentLike ?
                <BiSolidLike className="mr-2 cursor-pointer" onClick={() => { submitCommentLike(rootParent.commentsId, comment.commentsId, false) }} /> :
                <BiLike className="mr-2 cursor-pointer" onClick={() => { submitCommentLike(rootParent.commentsId, comment.commentsId, true) }} />}
              {like[comment.commentsId]?.count}</span>
            <button className="font-bold cursor-pointer hover:bg-gray-300 rounded-2xl px-2 py-1 transition-colors duration-600 ease-in-out"
              onClick={() => setActiveReplyId(comment.commentsId)}
            >Reply</button>
          </div>
          {activeReplyId === comment.commentsId &&
            <>
              <div className="flex">
                <RxAvatar className="w-8 h-8" />
                <input
                  className="border-b border-black focus:outline-none px-2 flex-grow"
                  placeholder={`${depth > 1 ? `Reply to @${comment.createdBy}` : "Add your comment"}`}
                  value={newReply[comment.commentsId] ?? ""}
                  onChange={(e) => { setNewReply(prev => ({ ...prev, [comment.commentsId]: e.target.value })) }}
                  onBlur={(e) => (onBlur(e, comment.commentsId))}
                  autoFocus
                />
              </div>
              <div className="flex self-end mt-2 gap-2">
                <button
                  className="font-bold cursor-pointer hover:bg-gray-300 hover:font-bold rounded-2xl px-2 py-1"
                  onClick={() => cancelReply(comment.commentsId)}>
                  Cancel
                </button>
                <button
                  className="font-bold cursor-pointer hover:bg-gray-300 hover:font-bold rounded-2xl px-2 py-1 transition-colors duration-1000"
                  onClick={() => submitReply(bookId, newReply[comment.commentsId], activeReplyId)}>
                  Reply
                </button>
              </div>
            </>
          }
        </div>
        <div className="relative">
          <button className="flex rounded-full w-8 h-8 items-center justify-center active:bg-gray-300 transition-colors duration-600 ease-out 
            " ref={el => { btnRefs.current[comment.commentsId] = el }}>
            <HiOutlineDotsVertical className="shrink-0 cursor-pointer h-6 w-6 rounded-full"
              onClick={() => setActiveDeleteMenu(prev => prev === comment.commentsId ? undefined : comment.commentsId)} />
          </button>
          {activeDeleteMenu === comment.commentsId && (
            <div className="absolute bg-gray-200 rounded-xl flex flex-col left-[100%] py-1 px-3 w-[80px] top-[0%]">
              <button className="hover:font-bold cursor-pointer p-0">Report</button>
              {comment.userId === userId && <button className="hover:font-bold cursor-pointer p-0" onClick={(e) => {e.preventDefault(); e.stopPropagation(); deleteComment(comment.commentsId)}}>Delete</button>}
            </div>
          )}
        </div>
      </div>
    )
  }

  const parentCommentRender = singleCommentRender(rootParent);
  const firstReply = rootParent.replies?.[0];
  const firstLayerReplyRender = firstReply ? singleCommentRender(firstReply, 1, rootParent) : null;
  const flattenComments = flattenCommentsNode(rootParent);
  const tails = firstReply ? flattenComments.slice(1) : flattenComments;
  const chainExtra = useMemo(() => {
    if (!targetPath || targetPath.length < 2) return 0;
    return Math.max(targetPath.length - 2, 0);
  }, [targetPath]);

  const visibleTailsCount = tailVisibleByParent[rootParent.commentsId] ?? chainExtra;
  const visibleTails = tails.slice(0, visibleTailsCount);
  const remaining = Math.max(tails.length - visibleTailsCount, 0)


  return (
    <>
      {parentCommentRender}
      {firstLayerReplyRender}
      {visibleTails.map(tail => singleCommentRender(tail.note, tail.depth, tail.parent))}
      {remaining > 0 &&
        <div className="border-gray-300 border-t relative p-3 min-w-[330px] self-center">
          <span className="absolute flex -top-[60%] bg-white right-[50%] translate-x-1/2 px-2 mx-2">
            <button className="hover:font-bold whitespace-nowrap" onClick={() => showMoreReplies(rootParent.commentsId, tails.length)}>
              View {remaining} more repl{remaining === 1 ? "y" : "ies"}
            </button>
          </span>
        </div>
      }
    </>
  )
})
export default memo(NewBookCommentsVersion)