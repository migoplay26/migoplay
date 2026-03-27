import Navbar from "./components/Navbar";
import HomeShowcase from "./components/HomeShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HomeShowcase />
    </main>
  );
}