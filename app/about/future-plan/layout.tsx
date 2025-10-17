import Sider from "@/component/Sider"

export default function FutureLayout({children}:{children:React.ReactNode}){

    return (
        <div className="flex flex-col flex-grow">
        <div className="flex flex-grow">
        <Sider/>
        {children}
        </div>
        </div>

    )
}