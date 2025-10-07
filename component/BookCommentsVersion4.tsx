'use client'
import { useState, useEffect, useRef, memo} from "react";
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
import toast from "react-hot-toast";
type CommentDataForm = {
  bookId: number | null;
  content: string;
}
type NewBookCommentsPros = {
  bookId: number | null;
  bookComments: GetCommentResponse[];
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>;
  userId: string | undefined,
}
type Props = {
  parent: GetCommentResponse,
  userId: string | undefined,
  bookId: number | null,
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>,
};
type FlatItem = { note: GetCommentResponse; depth: number; parent?: GetCommentResponse };
const NewBookCommentsVersion = ({ bookId, bookComments, setBookComments, userId }: NewBookCommentsPros) => {
  
  const [commentIsFocused, setCommentIsFocused] = useState<boolean>();
  const [newComment, setNewComment] = useState<CommentDataForm>({
    bookId: bookId,
    content: "",
  });
  console.log("new comment")
  const submitFirstLayerComment= async (bookId:number|null, content:string)=>{
    if(!content.trim()) return;
    try{
      const commentResponse=await BookApi.createComments({bookId, content})
      const createdComment = commentResponse.data.data;
      setBookComments(prev=>([createdComment, ...prev]));
      setNewComment(prev=>({...prev, content:""}))
      setCommentIsFocused(prev=>prev=false);
    }catch(err:any){
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }

  return (
    <div className="flex flex-col max-w-[600px]">
      <h1 className="text-2xl mb-5">Comment</h1>
      <div className="flex mb-10 flex-col">
        <div className="flex">
          <RxAvatar className="w-10 h-10 shrink-0" />
          <input className="border-b border-black focus:outline-none px-2 flex-grow"
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
      <div className="flex max-w-[600px] flex-col">
        {bookComments.map(parent =>
          <RenderCommentNote
            key={parent.commentsId}
            parent={parent}
            userId={userId}
            bookId={bookId}
            setBookComments={setBookComments}
          />)}
      </div>
    </div>
  )
}

const RenderCommentNote = ({ parent, userId, bookId, setBookComments }: Props) => {
  const refMenu = useRef<HTMLDivElement>(null);
  const [newReply, setNewReply] = useState<Record<number, string>>({});
  const [commentLike, setCommnetLike] = useState<Record<number, boolean>>({});
  const [tailVisibleByParent, setTailVisibleByParent] = useState<Record<number, number>>({})
  const [activeReplyId, setActiveReplyId] = useState<number>()
  const [activeDeleteMenu, setActiveDeleteMenu] = useState<number>();


  //useEffect
  useEffect(() => {
    const handleMenuOnBlur = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setActiveDeleteMenu(undefined)
      }
    }
    document.addEventListener("mousedown", handleMenuOnBlur)
    return () => document.removeEventListener("mousedown", handleMenuOnBlur)
  }, [])


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
  const deleteComment = (commentId: number) => {
    setBookComments(prev => DeleteComment(prev, commentId))
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

  // for every comment and reply render 
  const singleCommentRender = (comment: GetCommentResponse, depth = 0, parent?: GetCommentResponse) => {
    return (
      <React.Fragment key={comment.commentsId}>
        <div className={`flex mb-3 ${depth >= 1 && "ml-10"}`} key={comment.commentsId}>
          <RxAvatar className="w-8 h-8 shrink-0" />
          <div className="flex flex-col flex-grow ml-3">
            <div className="flex items-center gap-5">
              <span className="text-m font-bold">@{comment.createdBy}</span>
              <span className="text-sm font-bold text-gray-500">{timeAgo(comment.createdAt)}</span>
            </div>
            <p>{depth > 1 && <span className="text-gray-600 text-sm font-bold">Reply @{parent?.createdBy}:</span>}{comment.content}</p>
            <div className="flex self-end items-center gap-5">
              <span className="flex items-center">
                {comment.commentLikedByMe ?
                  <BiSolidLike className="mr-2 cursor-pointer" onClick={() => {}} /> :
                  <BiLike className="mr-2 cursor-pointer" onClick={() => {}} />}
                {comment.commentLikesCount}</span>
              <button className="font-bold cursor-pointer hover:bg-gray-300 hover:font-bold rounded-2xl px-2 py-1"
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
                    className="font-bold cursor-pointer hover:bg-gray-300 hover:font-bold rounded-2xl px-2 py-1"
                    onClick={() => submitReply(bookId, newReply[comment.commentsId], activeReplyId)}>
                    Reply
                  </button>
                </div>
              </>
            }
          </div>
          <div className="relative">
            <div className="rounded-full active:bg-gray-300">
              <HiOutlineDotsVertical className="shrink-0 cursor-pointer"
                onClick={() => setActiveDeleteMenu(comment.commentsId)} />
            </div>
            {activeDeleteMenu === comment.commentsId && (
              <div ref={refMenu} className="absolute bg-gray-200 rounded-xl flex flex-col left-[100%] bottom-[40%] py-1">
                <div className="px-2 hover:font-bold cursor-pointer"><span className="text-sm">Report</span></div>
                {comment.userId === userId && <div className="px-2 hover:font-bold cursor-pointer"><span className="text-sm" onClick={() => deleteComment(comment.commentsId)}>Delete</span></div>}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }

  const parentCommentRender = singleCommentRender(parent);
  const firstReply = parent.replies?.[0];
  const firstLayerReplyRender = firstReply ? singleCommentRender(firstReply, 1, parent) : null;
  const flattenComments = flattenCommentsNode(parent);
  const tails = firstReply ? flattenComments.slice(1) : flattenComments;
  const visibleTailsCount = tailVisibleByParent[parent.commentsId] ?? 0;
  const visibleTails = tails.slice(0, visibleTailsCount);
  const remaining = Math.max(tails.length - visibleTailsCount, 0)


  return (
    <>
      {parentCommentRender}
      {firstLayerReplyRender}
      {visibleTails.map(tail => singleCommentRender(tail.note, tail.depth, tail.parent))}
      {remaining > 0 &&
        <div className="border-gray-300 border-t relative p-3 min-w-[330px] self-center">
          <span className="absolute flex -top-[60%] bg-white right-[50%] translate-x-1/2 px-1">
            <button className="hover:font-bold" onClick={() => showMoreReplies(parent.commentsId, tails.length)}>
              View {remaining} more repl{remaining === 1 ? "y" : "ies"}
            </button>
          </span>
        </div>
      }
    </>
  )
}
export default memo(NewBookCommentsVersion)