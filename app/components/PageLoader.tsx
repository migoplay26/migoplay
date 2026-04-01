export default function PageLoader() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-1 rounded-full border-2 border-purple-500 border-t-pink-400 animate-spin" />
          <div className="absolute inset-4 rounded-full border border-pink-400/30" />
        </div>
        <p className="text-gray-500 text-xs tracking-widest uppercase">Loading...</p>
      </div>
    </main>
  );
}