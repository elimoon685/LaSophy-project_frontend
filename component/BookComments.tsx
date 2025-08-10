import { useState, useEffect, useRef, RefObject } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { BiLike } from "react-icons/bi";
import { CommentDataForm } from "@/inference/BookCommentRequestType";
import { GetCommentResponse } from "@/inference/BookCommentResponseType";
import { insertReplyRecursive } from "@/lib/insertReplyRecursive";
import BookApi from "@/api/book";
import toast from "react-hot-toast";
import { timeAgo } from "@/lib/CalculateTime";
import { RepliesCount } from "@/lib/CalculateCommentsCount";
import { RiArrowDownWideFill } from "react-icons/ri";
import { RiArrowUpWideLine } from "react-icons/ri";
import LikeOrCollectApi from "@/api/like_or_collect";
import { UpdateCommentLikesCount } from "@/lib/Booklikeupdate";
import { DeleteComment } from "@/lib/DeleteComment";
interface BookCommentPros {
  bookId: number | null
  bookComments: GetCommentResponse[],
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>,
  userId: string | undefined
}
const BookComments = ({ bookId, bookComments, setBookComments, userId }: BookCommentPros) => {

  const [newComment, setNewcomment] = useState<CommentDataForm>({
    bookId: bookId,
    content: "",
    parentCommentId: null
  })
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isReplyFocused, setIsReplyFocused] = useState<boolean>(false)
  //const [newReply, setNewReply] = useState<string>("")
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<number>()
  const [openMenuId, setOpenMenuId] = useState<number>()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenMenuId(undefined);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSubmit = async () => {

    try {
      const response = await BookApi.createComments(newComment)
      setBookComments(prev => [response.data.data, ...prev])
      setNewcomment(prev => ({ ...prev, content: "" }))
      setIsFocused(prev => !prev)
      toast.success(response.data.message)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  const handleReplySubmit = async () => {
    if (!activeReplyId) return;
    const content = replyInputs[activeReplyId];
    if (!content?.trim()) return;
    try {
      const replyResponse = await BookApi.createReply({
        bookId: bookId,
        content: content,
        parentCommentId: activeReplyId
      })
      const createdReply = replyResponse.data.data;
      setBookComments(prev => insertReplyRecursive(prev, activeReplyId, createdReply))
      setReplyInputs(prev => ({ ...prev, [activeReplyId]: "" }))
      setActiveReplyId(undefined)
      toast.success(replyResponse.data.message)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }
  const handleCommentLike = async (commentId: number) => {
    try {
      const commentLikeResponse = await LikeOrCollectApi.getCurrentCommentLike(commentId)
      setBookComments(prev => UpdateCommentLikesCount(prev, commentId, commentLikeResponse.data.data))
      toast.success(commentLikeResponse.data.message)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }
  const handleCommentDelete = async (commentId: number) => {
    try {
      const deleteResponse = await BookApi.DeleteComment(commentId)
      setBookComments(prev => DeleteComment(prev, commentId))
      toast.success(deleteResponse.data.message)
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please log in first.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }
  return (
    <div className="w-full flex flex-col ml-4 space-y-5 mb-4">
      <h1 className="text-2xl">Comments</h1>
      <div className="flex gap-3">
        <RxAvatar className="w-9 h-9" />
        <div className="w-full max-w-[600px] flex flex-col gap-2">
          <input
            placeholder="Add the comment"
            value={newComment.content}
            onChange={(e) => setNewcomment({ ...newComment, content: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !newComment.content.trim() && setIsFocused(false)}
            className="w-full max-w-[600px] p-1 border-b border-black focus:outline-none"
          ></input>
          {isFocused &&
            <div className="flex justify-end gap-4">
              <button className=" p-1 text-sm hover:font-bold hover:bg-gray-100 rounded-xl"
                onClick={() => {
                  setIsFocused(false)
                  setNewcomment({ ...newComment, content: "" })
                }}
              >Cancel</button>
              {!newComment.content.trim() ?
                <button className="px-2 py-1 text-sm bg-gray-100 rounded-2xl text-gray-600"
                >Comment</button> : <button
                  className="px-2 py-1 text-sm bg-black rounded-2xl text-gray-300 hover:font-bold"
                  onClick={handleSubmit}>
                  Comment</button>
              }
            </div>
          }
        </div>
      </div>

      <div className="flex flex-col">
        {bookComments.map((comment) => (
          <div className="max-w-[650px] flex flex-col mt-3" key={comment.commentsId}>
            <div className="flex gap-3">
              <RxAvatar className="w-7 h-7" />
              <div className="flex flex-grow flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <h3 className="text-m font-bold">@{comment.createdBy}</h3>
                  <span className="text-sm font-bold text-gray-500">{timeAgo(comment.createdAt)}</span>
                </div>
                <div>
                  <h1>{comment.content}</h1>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1">
                    <BiLike onClick={() => handleCommentLike(comment.commentsId)} />
                    <span>{comment.commentLikesCount}</span>
                  </div>
                  <button className="text-sm hover:font-bold"
                    onClick={() => setActiveReplyId(comment.commentsId)}
                  >Reply</button>
                </div>
                {activeReplyId == comment.commentsId &&
                  <div className="flex gap-3">
                    <RxAvatar className="w-7 h-7 mt-2" />
                    <div className="flex flex-grow flex-col gap-2">
                      <input className="px-0.5 pt-1 pb-0 border-b border-black focus:outline-none"
                        placeholder="Add the reply"
                        value={replyInputs[comment.commentsId] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({
                            ...prev,
                            [comment.commentsId]: e.target.value,
                          }))

                        }
                        onFocus={() => setIsReplyFocused(true)}
                        onBlur={() => !replyInputs[comment.commentsId].trim() && setIsReplyFocused(false)}
                      >
                      </input>
                      <div className="flex justify-end gap-4">
                        <button className="text-sm hover:font-bold"
                          onClick={() => {
                            setActiveReplyId(undefined)
                            setReplyInputs((prev) => ({
                              ...prev,
                              [comment.commentsId]: ""
                            }))
                          }}
                        >Cancel</button>
                        <button className="text-sm hover:font-bold"
                          onClick={handleReplySubmit}
                        >Reply</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className="">
                <HiOutlineDotsVertical
                  className="cursor-pointer"
                  onClick={() => setOpenMenuId(comment.commentsId)}
                />
                {openMenuId === comment.commentsId && (
                  <div
                    ref={ref}
                    className="absolute bg-white border border-gray-300 rounded shadow-md z-10 px-2 py-1 text-sm"
                  >
                    <div className="flex flex-col">
                      {comment.userId === userId && (
                        <button onClick={() => handleCommentDelete(comment.commentsId)} className="text-black hover:font-bold">
                          Delete
                        </button>
                      )}
                      <button className="text-black hover:font-bold">
                        Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col ml-9 gap-2">
              {
                comment.replies.length > 0 && (
                  <CommentsReplies
                    key={comment.commentsId}
                    comment={comment}
                    activeReplyId={activeReplyId}
                    setActiveReplyId={setActiveReplyId}
                    replyInputs={replyInputs}
                    setReplyInputs={setReplyInputs}
                    setIsReplyFocused={setIsReplyFocused}
                    handleReplySubmit={handleReplySubmit}
                    handleCommentLike={handleCommentLike}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    handleCommentDelete={handleCommentDelete}
                    popupRef={ref}
                    userId={userId}
                    depth={1}
                  />
                )
              }
            </div>
          </div>
        )


        )}
      </div>

    </div>
  )
}
interface CommentsRepliesPros {
  comment: GetCommentResponse,
  activeReplyId: number | undefined,
  setActiveReplyId: React.Dispatch<React.SetStateAction<number | undefined>>,
  replyInputs: Record<number, string>,
  setReplyInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>,
  setIsReplyFocused: React.Dispatch<React.SetStateAction<boolean>>,
  handleReplySubmit: () => void,
  handleCommentLike: (commentId: number) => void,
  handleCommentDelete: (commentId: number) => void,
  openMenuId: number | undefined,
  setOpenMenuId: React.Dispatch<React.SetStateAction<number | undefined>>
  popupRef: RefObject<HTMLDivElement | null>;
  userId: string | undefined,
  depth: number,
}
const CommentsReplies = ({ comment, activeReplyId, setActiveReplyId, replyInputs, setReplyInputs, setIsReplyFocused, handleReplySubmit, depth, handleCommentLike, handleCommentDelete, setOpenMenuId, openMenuId, popupRef, userId }: CommentsRepliesPros) => {
  const [showMoreReplies, setShowMoreReplies] = useState<boolean>(false)
  return (
    <>
      {!showMoreReplies ? (<button className="flex items-center gap-2 text-sm hover:font-bold text-blue-500"
        onClick={() => setShowMoreReplies(prev => !prev)}>
        <RiArrowDownWideFill className="w-5 h-5" />{RepliesCount(comment)} replies</button>) : (
        <>
          <button className="flex items-center gap-2 text-sm hover:font-bold"
            onClick={() => setShowMoreReplies(prev => !prev)}><RiArrowUpWideLine className="w-5 h-5" />{RepliesCount(comment)} replies</button>
          {comment.replies.map((reply) => (
            <div className="flex flex-col">
              <div className="w-full flex gap-3">
                <RxAvatar className="w-7 h-7" />
                <div className="flex flex-col flex-grow gap-1">
                  <div className="flex gap-4 items-center">
                    <h3 className="text-m font-bold">@{reply.createdBy}</h3>
                    <span className="text-sm text-gray-500 font-bold">{timeAgo(reply.createdAt)}</span>
                  </div>
                  <div>
                    <h1>{depth >= 2 && <span className="text-sm text-gray-600">Reply @{comment.createdBy}: </span>}{reply.content}</h1>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-1">
                      <BiLike onClick={() => handleCommentLike(reply.commentsId)} />
                      <span>{reply.commentLikesCount}</span>
                    </div>
                    <button className="text-sm hover:font-bold"
                      onClick={() => setActiveReplyId(reply.commentsId)}
                    >Reply</button>
                  </div>
                  {activeReplyId == reply.commentsId &&
                    <div className="flex gap-3">
                      <RxAvatar className="w-7 h-7 mt-2" />
                      <div className="flex flex-grow flex-col gap-2">
                        <input className="px-0.5 pt-1 pb-0 border-b border-black focus:outline-none"
                          placeholder={`@${reply.createdBy}`}
                          value={replyInputs[reply.commentsId] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [reply.commentsId]: e.target.value
                            }))
                          }
                          onFocus={() => setIsReplyFocused(true)}
                          onBlur={() => !replyInputs[reply.commentsId].trim() && setIsReplyFocused(false)}
                        >
                        </input>
                        <div className="flex justify-end gap-4">
                          <button className="text-sm hover:font-bold"
                            onClick={() => {
                              setActiveReplyId(undefined)
                              setReplyInputs((prev) => ({
                                ...prev,
                                [reply.commentsId]: ""
                              }))
                            }}
                          >Cancel</button>
                          <button className="text-sm hover:font-bold"
                            onClick={handleReplySubmit}
                          >Reply</button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div className="">
                  <HiOutlineDotsVertical
                    className="cursor-pointer"
                    onClick={() => setOpenMenuId(reply.commentsId)} />
                  {openMenuId === reply.commentsId && (
                    <div
                      ref={popupRef}
                      className="absolute bg-white border border-gray-300 rounded shadow-md z-10 px- py-1 text-sm"
                    >
                      <div className="flex flex-col">
                        {reply.userId === userId && (
                          <button onClick={() => handleCommentDelete(reply.commentsId)} className="text-black hover:font-bold">
                            Delete
                          </button>
                        )}
                        <button className="text-black hover:font-bold">
                          Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {reply.replies.length > 0 &&
                <CommentsReplies
                  key={reply.commentsId}
                  comment={reply}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                  replyInputs={replyInputs}
                  setReplyInputs={setReplyInputs}
                  setIsReplyFocused={setIsReplyFocused}
                  handleReplySubmit={handleReplySubmit}
                  depth={depth + 1}
                  handleCommentLike={handleCommentLike}
                  handleCommentDelete={handleCommentDelete}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  popupRef={popupRef}
                  userId={userId}
                />}

            </div>
          ))}
        </>)}
    </>
  )
}
export default BookComments