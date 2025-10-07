'use client'
import SearchBar from "@/component/SearachBar";
import CustomizeSearch from "@/component/CustomizeSearch";
import { useSelectedLayoutSegments } from 'next/navigation'
export default function BookViewsLayout({children}:{children:React.ReactNode}){
    const segments = useSelectedLayoutSegments()
    return (
        <>
        <div className="flex flex-col flex-grow">
        {segments.length===0 && <SearchBar/>}
        <div className="flex flex-grow">
        {segments.length===0 && <CustomizeSearch/>}
        {children}
        </div>
        </div>
        </>

    )
}