import Payment from "@/component/Payment"
const Donate=()=>{
return <div className="flex flex-col">
<div className="bg-gray-300 h-[200px] relative">
<div className="absolute top-[60%] left-[10%]">
    <h1 className="font-libre text-4xl">Donate</h1></div>
<div className="absolute top-0 right-0 w-0 h-0 border-r-[80px] border-r-transparent border-b-[80px] border-b-amber-700"></div>
</div>
<div className="flex mt-5 ml-10 mb-10 overflow-auto justify-center">
    <p className="font-libre text-2xl flex-grow max-w-[800px]">I only put together a rough version of the donation feature. The idea is to include it as one of the basic functions many personal websites have while also giving me a chance to practice my programming skills. If people can visit the site, I’m already very happy.</p>
    <Payment/>
</div>
</div>
}
export default Donate