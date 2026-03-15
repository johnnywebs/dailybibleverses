import QuoteSwiper from "../components/QuoteSwiper";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 bg-gradient-to-r from-blue-200 to-sky-300">
      <div className="w-full max-w-sm space-y-6">
        {/* Page title */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Daily Bible Verse
        </h1>

        {/* Quote swiper */}
        <QuoteSwiper />
      </div>
    </main>
  );
}