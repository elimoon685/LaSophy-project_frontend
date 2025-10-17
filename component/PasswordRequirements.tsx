'use client'
 const PasswordRequirements=({password}:{password:string})=>{

const rules=[
    {label:"At least 6 characters", test:(password:string)=>password.length>=6},
    {label:"Contains lowercase", test:(password:string)=>/[a-z]/.test(password)},
    {label:"Contains uppercase", test:(password:string)=>/[A-Z]/.test(password)},
    {label:"Contains number", test:(password:string)=>/\d/.test(password)},
    {label:"Contains special character", test:(password:string)=>/[^A-Za-z0-9]/.test(password)}
]   
return(
<ul className="mt-1 py-1 pl-2">
    {
        rules.map((r,i)=>{
            const ok=r.test(password)
            return (
             <li key={i} className={`text-sm ${ok ? "text-green-600" :"text-gray-500"} `}>
                <span>{ok ? "✓" : "•"}</span>  {r.label}
             </li>
            )
        }
    )
    }
</ul>
)
}
export default PasswordRequirements