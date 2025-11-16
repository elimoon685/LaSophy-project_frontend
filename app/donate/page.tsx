'use client'
import Payment from "@/component/Payment"
import Sider from "@/component/Sider"
import { useEffect, useState } from 'react'
const Donate = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
      requestAnimationFrame(() => setAnimate(true))
    }, [])
  return <div className="flex flex-grow">
    <Sider />
    <div className="flex flex-col flex-grow min-w-0">
    <div className="bg-gray-300 h-[200px] relative group [transform-style:preserve-3d]">
<div className="absolute top-[60%] left-[10%]">
    <h1 className="font-libre text-4xl">Introduction</h1></div>
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
      <div className="flex py-5 px-5 gap-20">
        <p className="hidden sm:block font-libre text-2xl min-w-0 flex-1 max-w-[800px] max-h-[400px] shadow-lg drop-shadow-md shadow-black/30 py-5 px-5 indent-8 overflow-auto">I only put together a rough version of the donation feature. The idea is to include it as one of the basic functions many personal websites have while also giving me a chance to practice my programming skills. If people can visit the site, I’m already very happy.</p>
        <Payment />
      </div>
    </div>
  </div>
}
export default Donate