
const SearchBar=()=>{
return (
    <div className="h-[200px] bg-gray-300 relative">
    <div className="flex items-center justify-center gap-1 absolute inset-0">
    <span className="text-2xl font-libre">Search</span>
    <input id="searchBar" className="py-2 px-3 max-w-[500px] flex-grow border border-black  focus:outline-black rounded-3xl bg-white"></input>
    <button className="rounded-2xl bg-black text-gray-300 w-10 font-libre">Go</button>
    </div>
    </div>
)
}
export default SearchBar