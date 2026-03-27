import { Suspense } from "react";
import Navbar from "../components/Navbar";
import ContentBrowser from "../components/ContentBrowser";

export default function ShowsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Suspense
        fallback={
          <div className="px-8 pt-32 pb-12 text-gray-400">
            Loading shows...
          </div>
        }
      >
        <ContentBrowser
          pageTitle="Shows"
          pageDescription="Browse all show content on MigoPlay."
          contentType="show"
        />
      </Suspense>
    </main>
  );
}