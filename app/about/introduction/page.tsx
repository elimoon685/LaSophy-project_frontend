
'use client'
import { useEffect, useState } from 'react'

const Introduction=()=>{
    const [animate, setAnimate] = useState(false)
    useEffect(() => {
        // trigger on first paint
        requestAnimationFrame(() => setAnimate(true))
      }, [])
return(
<div className="flex flex-col flex-grow">
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
<div className="mt-5 ml-10 max-w-[1000px] max-h-[400px] mb-10 overflow-y-auto shadow-lg drop-shadow-md shadow-black/30 py-5 px-5">
<p className="font-libre text-2xl indent-8">As an enthusiast of ancient scripts and history, I enjoy reading all kinds of historical books, especially those that present different countries’ perspectives on the same historical events. How they view the same event is of great importance to historical research.</p>
<br></br>
<p className="font-libre text-2xl indent-8">The 17th century was destined to be a period of great upheaval. In East Asia, and indeed across the whole of Asia, an extremely significant event occurred—one that reshaped the regional order. This event still continues to influence China and Asia today in politics, diplomacy, culture, and many other fields: the invasion and occupation of the Ming dynasty by the Qing army.</p>
<br></br>
<p className="font-libre text-2xl indent-8">I will not go into unnecessary detail about the Ming dynasty here; there is a wealth of literature available for reference. Many times, I have imagined—if human history could be recorded continuously and truthfully, preserved intact, and if modern people could understand ancient writing without barriers, then many historical questions could be easily answered by simply consulting those records. But this is a naïve thought. In reality, writing is a carrier of ideology, and through long processes of evolution, much of its original and authentic meaning has been lost, leaving only colloquial or superficial senses.</p>
<br></br>
<p className="font-libre text-2xl indent-8">In addition, regimes with different ideologies have their own priorities: they delete, rewrite, or fabricate parts that benefit themselves to justify their rule. In this respect, the Qing dynasty was an expert. Many Ming-era archives and books have almost entirely disappeared today. No one truly knows the real history of the late Ming and early Qing periods—or perhaps more tragically, many no longer care, being immersed in the Qing dynasty’s narrative.</p>
<br></br>
<p className="font-libre text-2xl indent-8"> There is some good news. During the Ming dynasty, quite a few European missionaries lived in China and wrote extensively about the country, including accounts related to the Qing invasion. In the Qing dynasty, many missionaries also recorded authentic aspects of Qing society. In the 19th century, numerous missionaries were active in southern China, documenting the true history of the Taiping Heavenly Kingdom. These valuable works have been preserved.</p>
<br></br>
<p className="font-libre text-2xl indent-8">Thus, my website was born. I have collected many of these precious materials and made them available for readers. I want to thank the open-source site archive.org. When you browse my site, you will notice its resemblance to archive.org. Many of my materials come from there, and thanks to that site, my own could be built.</p>
</div>
</div>
)
}
export default Introduction