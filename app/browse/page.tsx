import { Suspense } from "react";
import Navbar from "../components/Navbar";
import ContentBrowser from "../components/ContentBrowser";
import PageLoader from "../components/PageLoader";

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <ContentBrowser
          pageTitle="Browse"
          pageDescription="Explore all the content available on MigoPlay."
        />
      </Suspense>
    </main>
  );
}