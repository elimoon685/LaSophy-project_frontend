
interface SwitchBox{
isCheck:boolean,
check:()=>void

}
const SwitchBox=({isCheck, check}:SwitchBox)=>{

    
return (
    <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={isCheck}
    onChange={check}
    className="sr-only peer"
  />
  <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-black border-1 border-gray-300 transition-colors duration-800 ease-in-out"></div>
  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-1000 transform peer-checked:translate-x-4 ease-in-out"></div>
</label>
)
}
export default SwitchBox