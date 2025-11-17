"use client"
import { useRef, useState, createContext, useEffect, useMemo, useCallback } from "react"
import Cookies from "js-cookie";
type Ctx = { 
  connected: boolean, 
  close: (code?: number, reason?: string) => void, 
  reOpen:()=>void, 
  replymessage: WSReplyMsg[], 
  setReplyMessage: React.Dispatch<React.SetStateAction<WSReplyMsg[]>> 
  unReadMesCount:number,
  setUnReadCount:React.Dispatch<React.SetStateAction<number>>,
  commentLikeMessage: WSLikeMsg[], 
  setCommentLikeMessage: React.Dispatch<React.SetStateAction<WSLikeMsg[]>> 
}
type ReplyPayloadRaw = {
  BookId: number;
  CommentId: number;
  Content: string;
  CreatedAt: string;
  ParentCommentContent: string | null;
  ReplyUserId: string;
  ReplyUserName: string;
  SendUserId: string;
  PdfPath:string;
};
type CommentLikePayloadRaw={
  BookId: number;
  CommentId: number;
  CreatedAt: string;
  ReplyUserId: string;
  ReplyUserName: string;
  SendUserId: string;
  Content: string;
  PdfPath:string;

}
type ReplyMessageRaw = {
  type: "reply";
  data: ReplyPayloadRaw;
  ts: string; // ISO
};
type CommentLikeMessageRaw = {
  type: "like";
  data: CommentLikePayloadRaw;
  ts: string; // ISO
};
type UnknownMsg = { type: string } & Record<string, unknown>;
type WSReplyMsg = ReplyMessageRaw | UnknownMsg;
type WSLikeMsg = CommentLikeMessageRaw | UnknownMsg;
export const WSContext = createContext<Ctx | null>(null);
export function WebsocketProvider({ url, auth, children }: { url: string, auth: boolean, children: React.ReactNode }) {

  const idleMs = 90_000;
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [unreadCount, setUnreadCount]=useState<number>(0)
  //
  const [replyMessage, setReplyMessage] = useState<WSReplyMsg[]>([])
  const [commentLikeMessage, setCommentLikeMessage]=useState<WSLikeMsg[]>([])
  const closedByAppRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);
  const lastSeenRef = useRef<number>(0);

  const clearTimers = () => {
    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };
  const startWatchdog = () => {
    if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
    // check every 5s whether we've been quiet too long
    watchdogTimerRef.current = window.setInterval(() => {
      const s = wsRef.current;
      if (!s || s.readyState !== WebSocket.OPEN) return;
      if (Date.now() - lastSeenRef.current > idleMs) {
        // Force a clean close; onclose will schedule reconnect.
        try { s.close(1000, "Idle watchdog"); } catch { }
      }
    }, 5_000);
  };

  const scheduleReconnect = (immediate = false) => {
    if (closedByAppRef.current || !auth) return;
    const attempts = reconnectAttemptsRef.current;
    const base = Math.min(30_000, 1000 * 2 ** attempts); // 1s, 2s, 4s, ... cap 30s
    const jitter = base * (0.8 + Math.random() * 0.4);
    const delay = immediate ? 0 : jitter;
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = window.setTimeout(() => {
      if (navigator.onLine === false) {

        const handler = () => {
          scheduleReconnect(true);
        };
        window.addEventListener('online', handler, { once: true });
        return;
      }
      connect();
    }, delay);
    reconnectAttemptsRef.current = Math.min(30, attempts + 1);
  };
  const mintWsCookie = async () => {
    const token = Cookies.get("token");
    if (!token) throw new Error("no-access-token");
    try {
      await fetch(`https://lasophynotificationapi-adc7atgxdsbmc9ff.australiasoutheast-01.azurewebsites.net/api/Websocket/auth/ws-cookie`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })
    } catch (err) {

    }
  }
  const connect = useCallback(async () => {
    if (!auth) return;
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    closedByAppRef.current = false;
    try {
      await mintWsCookie();
    } catch (e) {
      scheduleReconnect(false);
      return;
    }
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectAttemptsRef.current = 0;
      if (reconnectTimerRef.current) { clearTimeout(reconnectTimerRef.current); reconnectTimerRef.current = null; }

      lastSeenRef.current = Date.now();
      startWatchdog();
    }

    ws.onmessage = (e) => {
      lastSeenRef.current = Date.now();
      if (typeof e.data === "string") {
        try {
          const msg = JSON.parse(e.data);
          //console.log("data", msg)
          if (msg?.type === "ping" ||  msg?.type === "connection") {
            ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
            return;
          }else{
            if(msg?.type==="like"){
              setCommentLikeMessage(prev=>[msg,...prev])
              setUnreadCount(prev=>prev+1)
            }else if(msg?.type==="reply"){
              setReplyMessage(prev => [msg, ...prev])
              setUnreadCount(prev=>prev+1)
            }
          }
        
        } catch {

        }
      }
    }
    ws.onclose = (e) => {
      setConnected(false);
      //console.log("disconnected", e.code, e.reason)
      clearTimers();
      wsRef.current = null;
      const shouldReconnect = !closedByAppRef.current && auth &&
        (e.code === 1006 || !e.wasClean || e.code === 1011 || e.code === 1012 || e.code === 1013);

      if (shouldReconnect) scheduleReconnect(e.code === 1006)
    }
    ws.onerror = () => {

    }
  }, [auth])

  useEffect(() => {
    if (auth) connect();
    else {
      closedByAppRef.current = true;
      clearTimers();
      wsRef.current?.close(1000, "auth off");
      wsRef.current = null;
      setConnected(false);
    }
    return () => {
      //console.log("[WS] effect CLEANUP", { t: Date.now() });
      closedByAppRef.current = true;
      clearTimers();
      const s = wsRef.current;
      if (s) {
        s.close(1000, "unmount")
        wsRef.current = null;
      }
    }
  }, [auth])
  const close = useCallback((code = 1000, reason = "manual") => {
    closedByAppRef.current = true;
    clearTimers();
    reconnectAttemptsRef.current = 0;
    wsRef.current?.close(code, reason);
    wsRef.current = null;
    setConnected(false)
  }, [])//what is probelm, suppose every re-render, close reference create, 
  const reopen = useCallback(() => {
     connect()
  }, [connect])
  const value = useMemo(() => (
    { connected: connected, 
      close: close, 
      reOpen:reopen, 
      replymessage: replyMessage, 
      setReplyMessage: setReplyMessage,
      unReadMesCount:unreadCount,
      setUnReadCount:setUnreadCount,
      commentLikeMessage:commentLikeMessage,
      setCommentLikeMessage:setCommentLikeMessage,
    }), 
      [connected, close, replyMessage,commentLikeMessage,unreadCount,reopen])
  //const value1={connected: connected, close:close}

  return <WSContext.Provider value={value}> {children}</WSContext.Provider>
} 