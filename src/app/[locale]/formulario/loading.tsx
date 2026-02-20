export default function FormularioLoading() {
  return (
    <div className="min-h-screen bg-[#FFFAF7] py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 animate-pulse">
          <div className="h-8 w-48 bg-warm-gray-100 rounded-lg mx-auto mb-3" />
          <div className="h-3 w-64 bg-warm-gray-100 rounded mx-auto mb-8" />
          <div className="h-7 w-72 bg-warm-gray-100 rounded-lg mx-auto mb-3" />
          <div className="h-4 w-80 bg-warm-gray-100 rounded mx-auto" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={`skeleton-${i}`} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#F7F3F0] animate-pulse">
              <div className="h-5 w-40 bg-warm-gray-100 rounded mb-5" />
              <div className="space-y-4">
                <div className="h-11 bg-warm-gray-100 rounded-xl" />
                <div className="h-11 bg-warm-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
