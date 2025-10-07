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
const NavbarFooterWrapper=({children}:Readonly<{children: React.ReactNode}>)=>{

     const pathName=usePathname()
     const hiddenRouter=['/login','/signup','/reset-password','/forget-password',"/admin_signup","/check-email"]
     const hiddenLayout=hiddenRouter.includes(pathName)
     const isHome = pathName === '/';
     const url=`wss://${process.env.NEXT_PUBLIC_LASOPHY_NOTIFICATION_BACKEND_API_URL}/ws`;
     const token= Cookies.get("token");
     const auth=!!token && (
       ()=>{try {
            const { exp } = jwtDecode<JwtPayload>(token);
            return exp * 1000 > Date.now();
          } catch {
            return false;
          }}
     )();
return (
    <>
    <WebsocketProvider url={url} auth={auth}>
     {!hiddenLayout && <Navbar auth={auth} /> }
     
     {(!hiddenLayout && !isHome) && <SubNavbar/>}
     <div className="flex-grow flex flex-col">
      {children}
      </div>
     {!hiddenLayout && <Footer/>}
     </WebsocketProvider>
    </>
)

}
export default NavbarFooterWrapper