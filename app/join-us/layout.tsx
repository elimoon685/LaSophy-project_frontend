import Sider from "@/component/Sider";

export  default function JoinUsLayout({children}:{children:React.ReactNode}){
return  <div className="flex flex-grow">
<Sider/>
{children}
</div>
}