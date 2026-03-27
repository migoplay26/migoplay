import { Suspense } from "react";
import Navbar from "../components/Navbar";
import ContentBrowser from "../components/ContentBrowser";

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Suspense
        fallback={
          <div className="px-8 pt-32 pb-12 text-gray-400">
            Loading movies...
          </div>
        }
      >
        <ContentBrowser
          pageTitle="Movies"
          pageDescription="Browse all movie content on MigoPlay."
          contentType="movie"
        />
      </Suspense>
    </main>
  );
}