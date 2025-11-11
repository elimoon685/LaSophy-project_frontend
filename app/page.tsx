'use client'
import Footer from "@/component/footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RxMoon } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { UnifrakturMaguntia, IM_Fell_English } from 'next/font/google';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
const blackletter = UnifrakturMaguntia({ weight: '400', subsets: ['latin'] });
export default function Home() {
  const router = useRouter()
  const imgPath = ["/aboutImage.png", "/donateImage.png", "/joinUsImage.png"]
  const imgHover = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<number>(0)
  const [hover, setHover] = useState<Boolean>(false)

  const next = () => setIndex(i => (i + 1) % imgPath.length);
  const pre = () => setIndex(i => (i - 1 + imgPath.length) % imgPath.length);
  const mouseEnter = () => setHover(true)
  const mouseLeave = () => setHover(false)

  useEffect(() => {
    if (hover === false) {
      var timer = window.setInterval(() => setIndex(i => (i + 1) % imgPath.length), 2000)
    }
    return () => clearInterval(timer)
  }, [router, hover])

  //why using this? suppose when i enter the page and put the mouse on the img
  useEffect(() => {
    const el = imgHover.current
    if (!el) return;
    const hovering = [...document.querySelectorAll(':hover')]
    if (hovering.includes(el)) {
      console.log("hoverContent", hovering)
      setHover(true)
    }
  }, [])
  return (
    <>
      <div className="flex justify-center bg-gray-400">
        <div className="relative inline-block">
          <Image src="/homePage.png" alt="Homepage" width={1070} height={750}></Image>
          <div className="absolute top-[19.5%] left-[89.5%] w-[14%] -translate-x-1/2 -translate-y-1/2 hover:scale-110 group">
            <Link href="/bookviews">
              <Image src="/bookview.png" alt="BookView" width={150} height={150}
                className="">
              </Image>
              <div className="absolute inset-0 bg-[#8A7A55] opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <div className="text-black font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block"><span className="font-libre [text-shadow:5px_5px_5px_rgba(0,0,0,.5)] text-xs sm:text-xl md:text-2xl lg:text-2xl">Transitions and Rebellion</span></div>
            </Link>
          </div>
          <div className="absolute top-[42.7%] left-[85.9%] w-[14%] -translate-x-1/2 -translate-y-1/2 hover:scale-105 group/second">
            <Link href="/">
              <Image src="/wordsImage.png" alt="Words" width={160} height={150}
                className="">
              </Image>
              <div className="absolute inset-0 bg-[#8A7A55] opacity-0 group-hover/second:opacity-50 transition-opacity"></div>
              <div className="text-black font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover/second:block"><span className="font-libre [text-shadow:5px_5px_5px_rgba(0,0,0,.5)] text-xs sm:text-xl md:text-2xl lg:text-2xl">Coming soon!</span></div>
            </Link>
          </div>
        </div>
        {/*<ThemeOverviews/>*/}
    </div>
      <ul className="bg-black px-5 py-3 flex">
        <li className="text-gray-300 relative group text-2xl cursor-pointer flex-1"><div className="flex justify-center items-center"><span className="mr-3">About</span><RxMoon /></div>
          <ul className="absolute hidden group-hover:block bg-black left-0 bottom-[100%] ring-1 ring-gray-400 ring-opacity-5 rounded-md">
            <li className="px-4 py-2 hover:bg-gray-500 group/sub whitespace-nowrap rounded-md text-xl" onClick={() => router.push("/about/introduction")}>What is this website about
            </li>
            <li className="px-4 py-2 hover:bg-gray-500 group/sub rounded-md text-xl" onClick={() => router.push("/about/future-plan")}>Future plan
            </li>
          </ul>
        </li>
        {/*<li className="border-l-2 border-gray-300 flex-1 min-w-0"></li>*/}
        <li className="text-gray-300 relative text-2xl cursor-pointer flex-1"><div className="flex justify-center items-center"><span className="mr-3" onClick={() => router.push("/donate")}>Donate</span><FaHeart /></div></li>
        {/*<li className="border-l-2 border-gray-300 flex-1 min-w-0"></li>*/}
        <li className="text-gray-300 relative text-2xl cursor-pointer flex-1 "><div className="flex justify-center items-center"><span className="mr-3 whitespace-nowrap" onClick={() => router.push("/join-us")}>Join us</span><BsFillPeopleFill /></div></li>
      </ul>
      {/* how to achieve */}
      
        <div className="flex mt-10 ">
          <ul className="flex flex-col bg-black gap-2 flex-1 max-w-[400px] mr-10 ring-black">
            <li className="text-gray-300 relative group font-libre font-bold text-2xl hover:bg-white hover:text-black">Tartary
              <ul className="absolute hidden left-[100%] bottom-[0] group-hover:flex bg-white z-50 flex gap-5 w-[500px]">
                <li className="hover:bg-black hover:text-gray-300 group/sub relative flex-1 text-center">Invasion
                  <ul className="absolute group-hover/sub:flex hidden flex flex-col">
                    <li className="">One</li>
                    <li>Two</li>
                    <li>Three</li>
                  </ul>
                </li>
                <li className="hover:bg-black hover:text-gray-300 group/sub relative flex-1 text-center">Map</li>
                <li className="hover:bg-black hover:text-gray-300 group/sub relative flex-1 text-center">Introduction</li>
              </ul>
            </li>
            <li className="text-gray-300 relative group text-2xl font-libre font-bold hover:bg-white hover:text-black">Taiping rebellion
              <ul className="absolute hidden left-[100%] bottom-[0%] group-hover:flex bg-black border border-gray-400 rounded-md">
                <li>Origin</li>
                <li>Literature</li>
                <li>Failure</li>
              </ul>
            </li>
            <li className="text-gray-300 relative group text-2xl font-libre font-bold hover:bg-white hover:text-black">Vietnam</li>
            <li className="text-gray-300 relative group text-2xl font-libre font-bold hover:bg-white hover:text-black">Japan</li>
            <li className="text-gray-300 relative group text-2xl font-libre font-bold hover:bg-white hover:text-black">Ming</li>
          </ul>
          <div className="relative" ref={imgHover} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
            <Image src={imgPath[index]} alt={imgPath[index].toUpperCase()} width={500} height={300} className="transition-transform duration-500 ease-in-out">
            </Image>
            <div className="absolute inset-y-35 left-0 w-[5%] bg-gray-300 border border-black border-l-0 rounded-r-3xl"></div>
            <div className="absolute inset-y-35 right-0 w-[5%] bg-gray-300 border border-black border-r-0 rounded-l-3xl"></div>
            <div className="absolue inset-0 gray"></div>
            <MdOutlineArrowForwardIos className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={next}
            />
            <MdOutlineArrowBackIosNew className="absolute left-0 top-[50%] -translate-y-1/2 cursor-pointer"
              onClick={pre}
            />
            {/*
        <ul className="absolute top-[90%] left-[5%] flex gap-2">
          <li><button className="w-2 h-2 bg-amber-100 rounded-full cursor-pointer hover:rounded-2xl" onClick={()=>setIndex(pre=>pre=0)}></button></li>
          <li><button className="w-2 h-2 bg-amber-100 rounded-full cursor-pointer" onClick={()=>setIndex(pre=>pre=1)}></button></li>
          <li><button className="w-2 h-2 bg-amber-100 rounded-full cursor-pointer" onClick={()=>setIndex(pre=>pre=2)}></button></li>
        </ul>*/}
            <div className="absolute top-[90%] left-[5%] flex gap-2 z-10">
              {imgPath.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-current={i === index}
                  className={
                    "h-2 rounded-full transition-all duration-300 cursor-pointer " +
                    (i === index ? "w-4 bg-amber-200 drop-shadow-md"
                      : "w-2 bg-amber-100/60")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      
    </>
  );
}