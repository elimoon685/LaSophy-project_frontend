'use client'
import { useEffect, useState } from 'react'

const FuturePlan = () => {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    // trigger on first paint
    requestAnimationFrame(() => setAnimate(true))
  }, []);
  return (
    <>
      <div className="flex flex-col flex-grow">
        <div className="bg-gray-300 h-[200px] relative">
          <div className="absolute top-[60%] left-[10%]">
            <h1 className="font-libre text-4xl">Future plan</h1></div>
          <div className="absolute top-0 right-0 w-[100px] h-[100px] [perspective:1000px] bg-gray-300">
            <div className="
                 absolute inset-0
                 -translate-x-[3px] translate-y-[3px]
                bg-black/15
                 [transition:clip-path_850ms_ease-out]
                 blur-sm"
              style={{
                clipPath: animate
                  ? 'polygon(0% 100%, 100% 100%, 0% 0%)'
                  : 'polygon(15% 15%, 100% 100%, 0% 0%)',
              }}
            />

            <div
              className={[
                "absolute inset-0 z-10",
                "[clip-path:polygon(100%_0%,100%_100%,0_0)]",
                "origin-top-left [transform-style:preserve-3d]",
                "transition-transform duration-1000 ease-out",
                // start at 180deg, end at 0deg around the diagonal axis
                animate
                  ? "[transform:rotate3d(1,1,0,180deg)]"
                  : "[transform:rotate3d(1,1,0,0deg)]",
              ].join(" ")}
            >
              <div className='absolute inset-0  place-items-center rounded bg-gray-300 text-white
                    [backface-visibility:hidden]'>

              </div>
              {/* <div className="absolute inset-0 bg-yellow-400 text-black grid place-items-center
                    [transform:rotate3d(1,-1,0,180deg)] [xbackface-visibility:hidden]">

              </div> */}
              <div
                className={[
                  "absolute inset-0 bg-amber-700 text-black grid place-items-center",

                  "transition-opacity duration-200 ease-out",
                  animate ? "opacity-100 delay-[200ms]" : "opacity-0 delay-[0ms]",
                ].join(" ")}
              >
              </div>
            </div>


          </div>

        </div>
        <div className="mt-5 ml-10 max-w-[1000px] mb-10 overflow-auto py-5 px-5">
          <p className="font-libre text-xl indent-8">Right now, this website only has one section—the literature reading section—where you can bookmark, like, and comment on works. My energy is limited, and perhaps also because I’m not yet very skilled in the technical side, I can’t write or build very quickly, haha. But I will do my best to keep working on it.</p>
          <br></br>
          <p className="font-libre text-xl indent-8">In the future, I’d like to add a section on ancient scripts, covering a wide range of characters, reading methods, and comparisons of meanings across different historical periods. I believe that if I can make it happen, it will be amazing. But of course, that means I’ll have to learn a lot more things first, haha.</p>
        </div>
      </div>
    </>
  )
}
export default FuturePlan