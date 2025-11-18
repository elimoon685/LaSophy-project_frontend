import { Suspense } from "react";
import BookArea from "@/component/BookArea";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
        </div>
      }
    >
      <BookArea />
    </Suspense>
  );
}