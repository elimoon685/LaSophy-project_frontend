import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RxAvatar } from "react-icons/rx";
import { BiLike } from "react-icons/bi";
import { CommentDataForm } from "@/inference/BookCommentRequestType";
import { GetCommentResponse } from "@/inference/BookCommentResponseType";
import { insertReplyRecursive } from "@/lib/insertReplyRecursive";
import BookApi from "@/api/book";
import toast from "react-hot-toast";
import { timeAgo } from "@/lib/CalculateTime";
interface BookCommentPros {
  bookId: number | null
  bookComments: GetCommentResponse[],
  setBookComments: React.Dispatch<React.SetStateAction<GetCommentResponse[]>>
}
const BookComments = ({ bookId, bookComments, setBookComments }: BookCommentPros) => {

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

  const handleSubmit = async () => {

    try {
      const response = await BookApi.createComments(newComment)
      console.log("new comment", response.data.data)
      setBookComments(prev => [response.data.data, ...prev])
      setNewcomment(prev => ({ ...prev, content: "" }))
      setIsFocused(prev=>!prev)
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
 try{
    const replyResponse = await BookApi.createReply({
      bookId: bookId,
      content: content,
      parentCommentId: activeReplyId
    })
    console.log("reply", replyResponse.data.data)
    const createdReply = replyResponse.data.data;
    setBookComments(prev => insertReplyRecursive(prev, activeReplyId, createdReply))
    setReplyInputs(prev => ({ ...prev, [activeReplyId]: "" }))
    setActiveReplyId(undefined)
  }catch(err:any){
    if (err.response?.status === 401) {
      toast.error("Please log in first.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
  }
  const handleCommentLike = async () => {

  }
  const handleCommentDelete = async () => {

  }
  return (
    <div className="w-full flex flex-col ml-4 space-y-5">
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
          <div className="max-w-[650px] flex mt-3">
            <div className="flex flex-grow gap-3">
              <RxAvatar className="w-7 h-7" />
              <div className="flex flex-grow flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <h3 className="text-m font-bold">@{comment.createdBy}</h3>
                  <span className="text-sm font-bold text-gray-300">{timeAgo(comment.createdAt)}</span>
                </div>
                <div>
                  <h1>{comment.content}</h1>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1">
                    <BiLike />
                    <span>0</span>
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
                {
                  comment.replies.length > 0 && (
                    <CommentsReplies
                      comment={comment}
                      activeReplyId={activeReplyId}
                      setActiveReplyId={setActiveReplyId}
                      replyInputs={replyInputs}
                      setReplyInputs={setReplyInputs}
                      setIsReplyFocused={setIsReplyFocused}
                      handleReplySubmit={handleReplySubmit}
                      depth={1}
                    />
                  )
                }
              </div>
            </div>
            <div className="">
              <HiOutlineDotsVertical />
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
  depth: number
}
const CommentsReplies = ({ comment, activeReplyId, setActiveReplyId, replyInputs, setReplyInputs, setIsReplyFocused, handleReplySubmit, depth }: CommentsRepliesPros) => {
  return (
    <>
      {comment.replies.map((reply) => (
        <div className="flex flex-col">
          <div className="w-full flex gap-3">
            <RxAvatar className="w-7 h-7" />
            <div className="flex flex-col flex-grow gap-1">
              <div className="flex gap-4 items-center">
                <h3 className="text-m font-bold">@{reply.createdBy}</h3>
                <span className="text-sm text-gray-300 font-bold">{timeAgo(reply.createdAt)}</span>
              </div>
              <div>
                <h1>{depth >= 2 && <span className="text-sm text-gray-600">Reply @{comment.createdBy}: </span>}{reply.content}</h1>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1">
                  <BiLike />
                  <span>0</span>
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
          </div>
          {reply.replies.length > 0 &&
            <CommentsReplies
              comment={reply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              replyInputs={replyInputs}
              setReplyInputs={setReplyInputs}
              setIsReplyFocused={setIsReplyFocused}
              handleReplySubmit={handleReplySubmit}
              depth={depth + 1}
            />}
        </div>
      ))}
    </>
  )
}
export default BookComments