import Payment from "@/component/Payment"
import Sider from "@/component/Sider"
const Donate = () => {
  return <div className="flex flex-grow">
    <Sider />
    <div className="flex flex-col flex-grow">
      <div className="bg-gray-300 h-[200px] relative">
        <div className="absolute top-[60%] left-[10%]">
          <h1 className="font-libre text-4xl">Donate</h1>
        </div>
        <div className="absolute top-0 right-0 w-0 h-0 border-r-[80px] border-r-transparent border-b-[80px] border-b-amber-700">
        </div>
      </div>
      <div className="flex py-5 px-10 gap-20">
        <p className="hidden sm:block font-libre text-2xl min-w-0 flex-1 max-w-[800px] max-h-[400px] shadow-lg drop-shadow-md shadow-black/30 py-5 px-5 indent-8 overflow-auto">I only put together a rough version of the donation feature. The idea is to include it as one of the basic functions many personal websites have while also giving me a chance to practice my programming skills. If people can visit the site, I’m already very happy.</p>
        <Payment />
      </div>
    </div>
  </div>
}
export default Donate