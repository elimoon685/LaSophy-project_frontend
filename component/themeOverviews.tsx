'use client'
import Image from "next/image";
import Link from "next/link";

const ThemeOverviews=()=>{

return (
    <div className="h-full flex items-center justify-center gap-16 py-16">
    <div className=" flex flex-col items-center rounded-sm shadow-lg drop-shadow-md shadow-black/30">
    <Link href="/bookviews">
    <Image src='/themebook.png' alt="Theme Book" width={500}
        height={340}/>
    <h1 className="text-xl font-bold py-4 text-center">Transitions and rebellion, collapse and resurgence</h1>
    </Link>
    </div>
    <div className="rounded-sm shadow-lg drop-shadow-md shadow-black/30">
    
    <Image src='/thememap.png' alt="Theme Book" width={500}
        height={200}/>
    <h1 className="text-xl font-bold py-4 text-center">16-18th Maps(Coming soon...)</h1>
    </div>
    </div>
)
}
export default ThemeOverviews