
import { GiSpellBook } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
interface BookInfoPros {
  title: string | undefined,
  author: string | undefined,
  year: string | undefined,
  handleLike: (likeOrNot:boolean) => void,
  handleCollect: (collectorNot:boolean) => void,
  isLikeClicked: boolean,
  isCollectClicked: boolean,
  setLike: React.Dispatch<React.SetStateAction<boolean>>,
  setCollect: React.Dispatch<React.SetStateAction<boolean>>,
  likeCount:number,
  collectCount:number
}

const BookInfo = ({ title, author, year, handleCollect, handleLike, isCollectClicked, isLikeClicked, setLike, setCollect, likeCount, collectCount}: BookInfoPros) => {

  return (
    <div className="w-full flex pl-5 mt-3 mb-8 max-w-[700px]">
      <div className="flex flex-grow-[3] gap-5 ">
        <GiSpellBook className="w-10 h-10 shrink-0" />
        <div className="flex flex-col space-y-5 justify-end">

          <h1 className="text-2xl pt-3">{title}</h1>
          <div className="flex gap-3">
            <h1 className="flex gap-2"><span className="font-bold">by</span>{author}</h1>
            <h1><span className="font-bold">Publication date:</span> {year}</h1>
          </div>
        </div>
      </div>
      <div className="flex pt-3 flex-grow gap-5">
        <div className="flex flex-col items-center">
          {!isLikeClicked ?
            <FaRegHeart className="h-6 w-6"
              onClick={() => {
                setLike(prev => !prev)
                handleLike(true)
              }}
            /> : <FaHeart
              className="h-6 w-6"
              onClick={() => {
                setLike(prev =>!prev)
                handleLike(false)
              }}
            />
          }
          <h1>{likeCount}</h1>
        </div>
        <div className="flex flex-col items-center">
          {!isCollectClicked? 
            <FaRegStar className="h-6 w-6"
              onClick={() => {
                setCollect(prev => !prev)
                handleCollect(true)
              }}
            />:
            <FaStar className="h-6 w-6"
        onClick={()=>{
          setCollect(prev=>!prev)
          handleCollect(false)
        }}
        />
          }
          <h1>{collectCount}</h1>
        </div>
      </div>
    </div>
  )
}
export default BookInfo