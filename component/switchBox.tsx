
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
  <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-black transition-colors duration-300"></div>
  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-4"></div>
</label>
)
}
export default SwitchBox