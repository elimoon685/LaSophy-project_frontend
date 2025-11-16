'use client'
import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";
import Footer from "./footer";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { WebsocketProvider } from "@/provider/WebsocketProvider";
import AppProviders from "@/store/provider";
import Cookies from "js-cookie";
import { JwtPayload } from "@/inference/UserResponseType";
import { useState, useEffect} from "react";
import { pathToFileURL } from "url";
const NavbarFooterWrapper=({children}:Readonly<{children: React.ReactNode}>)=>{
  
     const [auth, setAuth] = useState<boolean>(false);
     const pathName=usePathname()
     const hiddenRouter=['/login','/signup','/reset-password','/forget-password',"/admin_signup","/check-email"]
     const hiddenLayout=hiddenRouter.includes(pathName)
     const isHome = pathName === '/';
     const url=`wss://${process.env.NEXT_PUBLIC_LASOPHY_NOTIFICATION_WS_BACKEND_API_URL}/ws`;
    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        setAuth(false);
        return;
      }
      try {
        const { exp } = jwtDecode<JwtPayload>(token);
        // 检查是否过期
        setAuth(exp * 1000 > Date.now());
      } catch {
        setAuth(false);
      }
    }, [pathName]);

return (
    <>
    <WebsocketProvider url={url} auth={auth}>
     {!hiddenLayout && <Navbar auth={auth} /> }
     
     {(!hiddenLayout && !isHome) && <SubNavbar/>}
     {/* <div className="flex-grow flex flex-col"> */}
      {children}
      {/* </div> */}
     {!hiddenLayout && <Footer/>}
     </WebsocketProvider>
    </>
)

}
export default NavbarFooterWrapper