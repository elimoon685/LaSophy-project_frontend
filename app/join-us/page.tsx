'use client'
import { useEffect, useState } from 'react'

const JoinUs=()=>{
    const [animate, setAnimate] = useState(false)
    useEffect(() => {
        // trigger on first paint
        requestAnimationFrame(() => setAnimate(true))
      }, [])
return(
<div className="flex flex-col flex-grow min-w-0">
<div className="bg-gray-300 h-[200px] relative group [transform-style:preserve-3d]">
<div className="absolute top-[60%] left-[10%]">
    <h1 className="font-libre text-4xl">Join us</h1></div>
{/* /<div className="absolute top-0 right-0 w-0 h-0 border-r-[80px] border-r-transparent border-b-[80px] border-b-amber-700 origin-top-right transition-transform duration-5000 group-hover:[transform: rotate3d(1, 1, 0, 180deg);]"></div> */}

<div className="absolute top-0 right-0 w-[100px] h-[100px] [perspective:800px] bg-gray-300">
<div className="
    absolute inset-0
    -translate-x-[3px] translate-y-[3px]
    bg-black/15
    [transition:clip-path_800ms_ease-out]
    blur-sm
  " 
  style={{clipPath: animate
    ? 'polygon(0% 100%, 100% 100%, 0% 0%)'
    : 'polygon(15% 15%, 100% 100%, 0% 0%)',
   }}
  />
<div
          className={[
            "absolute inset-0 bg-amber-700",
            "[clip-path:polygon(0_100%,100%_100%,0_0)]",
            "origin-bottom-right [transform-style:preserve-3d] [backface-visibility:hidden]",
            "transition-transform motion-safe:duration-1000 motion-safe:ease-out",
            // start at 180deg, end at 0deg around the diagonal axis
            animate
              ? "[transform:rotate3d(1,1,0,20deg)]"
              : "[transform:rotate3d(1,1,0,180deg)]",
          ].join(" ")}
        />
        {/* back face (shows momentarily during flip; different color if you want) */}
       
</div>

</div>
<div className="mt-5 ml-10 max-w-[1000px] max-h-[400px] mb-10 overflow-y-auto shadow-lg drop-shadow-md shadow-black/30 py-5 px-5">
<p className="font-libre text-2xl indent-8">We welcome anyone with an independent perspective on history—people who can form their own systematic way of understanding the past. You should neither overlook large-scale historical trends, nor become obsessed with trivial, microscopic events. You should be able to use your own framework to judge the nature of historical events, to anticipate historical developments, and even to interpret the political behaviour of contemporary states.</p>
<br/>
<p className="font-libre text-2xl indent-8">You should also be capable of understanding the language and context of different civilizations and intellectual traditions—for example, Qing-dynasty Confucian thought, modern Marxism, Islamic civilization, contemporary Europe, modern Britain, the U.S. Democratic Party, the Republican Party, and so on.</p>
<br/>
<p className="font-libre text-2xl indent-8">If you feel you meet these criteria, you may send your own work to <u><strong>linsophymoon@gmail.com</strong></u>
. Please note that your submission must not display a clear civilizational bias; it should instead explain your theories, views, and perspectives in an objective and detailed manner.</p>
<br/>
<p className="font-libre text-2xl indent-8">We look forward to reading your work!</p>
</div>
</div>
)
}
export default JoinUs