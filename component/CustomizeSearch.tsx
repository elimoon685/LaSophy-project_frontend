const CustomizeSearch=()=>{

return(
    <div className="flex not-even:lg:w-[300px] bg-gray-200 md:w-[150px] relative">

        <div className="hidden left-[0%] md:flex flex flex-col absolute top-[100px] lg:left-[10%] gap-5">
            <h1 className="font-libre text-xl">Custom year range</h1>
            <div className="flex">
                <span className="flex-grow text-center">From</span>
                <input className="max-w-[50px] bg-white border-gray-300 focus:outline-black rounded-md px-1 flex-grow"/>
                <span className="flex-grow text-center">to</span>
                <input className="max-w-[50px] bg-white border-gray-300 focus:outline-black rounded-md px-1 flex-grow"/>
            </div>
            <button className="bg-white rounded-md w-[60px] self-center hover:bg-black hover:text-gray-300 cursor-pointer">Apply</button>
        </div>
    </div>
)
}
export default CustomizeSearch