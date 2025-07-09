'use client'
import Footer from "@/component/footer";
import Image from "next/image";
import ThemeOverviews from "@/component/themeOverviews";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiLoginCircleLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { apiComment } from "@/lib/apiClient";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { decode } from "punycode";
export default function Home() {
  
  return (

    <>
   <ThemeOverviews/>
    
    </>
  );
}