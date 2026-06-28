const PageSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-light animate-pulse">
    <div className="px-4 py-8 md:px-8 md:py-12 flex justify-between items-center max-w-4xl mx-auto w-full">
      <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray shrink-0" />
      <div className="hidden md:flex gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-4 w-16 bg-gray rounded" />
        ))}
      </div>
      <div className="md:hidden h-6 w-6 bg-gray rounded" />
    </div>
    <main id="main-content" className="flex-1 px-4 md:px-8 max-w-4xl mx-auto w-full pt-6 space-y-4">
      <div className="h-10 w-56 bg-gray rounded" />
      <div className="h-4 w-full max-w-xl bg-gray rounded" />
      <div className="h-4 w-full max-w-lg bg-gray rounded" />
      <div className="h-4 w-2/3 max-w-md bg-gray rounded" />
      <div className="h-10 w-36 bg-gray rounded mt-4" />
    </main>
    <div className="px-4 pb-24 md:px-8">
      <div className="max-w-4xl mx-auto border-t border-gray pt-12 space-y-3">
        <div className="h-6 w-40 bg-gray rounded" />
        <div className="h-4 w-56 bg-gray rounded" />
        <div className="h-4 w-44 bg-gray rounded" />
      </div>
    </div>
  </div>
);

export default PageSkeleton;
