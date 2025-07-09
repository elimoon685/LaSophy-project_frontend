'use client'
import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";
import Footer from "./footer";
import { usePathname } from "next/navigation";

const NavbarFooterWrapper=({children}:Readonly<{children: React.ReactNode}>)=>{

     const pathName=usePathname()
     const hiddenRouter=['/login','/signup','/resetPassword','/forgetPassword',"/admin_signup"]
     const hiddenLayout=hiddenRouter.includes(pathName)

return (
    <>
     {!hiddenLayout && <Navbar/> }
     {!hiddenLayout && <SubNavbar/>}
      {children}
     {!hiddenLayout && <Footer/>}
    </>
)
}
export default NavbarFooterWrapper