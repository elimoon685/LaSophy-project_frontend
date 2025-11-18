import { Suspense } from "react";
import ResetPassword from "@/component/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
        </div>
      }
    >
      <ResetPassword/>
    </Suspense>
  );
}