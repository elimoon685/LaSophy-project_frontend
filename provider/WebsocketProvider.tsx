"use client"
import { useRef, useState, createContext, useEffect, useMemo, useCallback} from "react"

type Ctx = { connected: boolean, close:(code?:number, reason?:string)=>void}
export const WSContext = createContext<Ctx | null>(null);
export function WebsocketProvider({url, auth, children}:{url:string, auth: boolean, children:React.ReactNode}) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const connect=()=>{
    if(wsRef.current && (wsRef.current.readyState=== WebSocket.OPEN || wsRef.current.readyState=== WebSocket.CONNECTING )) {
      return;
    } 
    const ws=new WebSocket(url);
    wsRef.current=ws;
    ws.onopen=()=>{setConnected(true);console.log("connect successfully")}
    ws.onmessage=(e)=>{
      const data = e.data === "string" ? JSON.parse(e.data) : e.data;
      console.log("data", data)
    }
    ws.onclose=(e)=>{setConnected(false); console.log("disconnected",e.code, e.reason)}
    ws.onerror 
  }
  useEffect(() => {
    if(auth) connect();
    return () => {
      console.log("[WS] effect CLEANUP", { t: Date.now() });
      const s=wsRef.current;
      if(s){
      s.close(1000, "unmount")
      wsRef.current=null;
      }
    }
  },[auth])
const close=useCallback((code=1000, reason="manual")=>{ wsRef.current?.close(code, reason);setConnected(prev=>prev=false)}, [])//what is probelm, suppose every re-render, close reference create, 
const value=useMemo(()=>({connected:connected, close:close}),[connected, close])
//const value1={connected: connected, close:close}

  return <WSContext.Provider value={value}> {children}</WSContext.Provider>
}