// Loading state. Mirrors the real layout — header, a heading, then index rows —
// so the page doesn't visibly reshape when content arrives.
const ROW_WIDTHS = ['w-3/5', 'w-1/2', 'w-2/3'];

const PageSkeleton = () => (
  <div className="min-h-screen flex flex-col animate-pulse motion-reduce:animate-none" aria-busy="true">
    <div className="px-4 py-3 md:px-8 md:py-4 border-b border-rule">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray shrink-0" />
        <div className="hidden md:flex gap-6">
          <div className="h-3 w-12 rounded bg-gray" />
          <div className="h-3 w-12 rounded bg-gray" />
        </div>
        <div className="h-8 w-[5.5rem] rounded-full bg-gray" />
      </div>
    </div>

    <main id="main-content" tabIndex={-1} className="flex-1 px-4 md:px-8 pt-10 md:pt-16">
      <div className="max-w-4xl mx-auto w-full">
        <div className="h-12 w-48 rounded bg-gray" />
        <div className="mt-6 h-4 w-full max-w-md rounded bg-gray" />

        <div className="mt-16 flex items-center justify-between border-b border-rule pb-3">
          <div className="h-3 w-20 rounded bg-gray" />
          <div className="h-3 w-20 rounded bg-gray" />
        </div>
        <ul>
          {ROW_WIDTHS.map((width) => (
            <li key={width} className="flex items-center justify-between gap-10 border-b border-rule py-5">
              <div className={`h-4 rounded bg-gray ${width}`} />
              <div className="hidden sm:block h-3 w-1/4 rounded bg-gray" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  </div>
);

export default PageSkeleton;
