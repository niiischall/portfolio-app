import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Work from '../sections/Work';
import Writings from '../sections/Writings';
import NotFound from '../sections/NotFound';
import Footer from '../sections/Footer';
import PageSkeleton from './PageSkeleton';
import PageMeta from './PageMeta';
import StructuredData from './StructuredData';

import { useSanityData } from '../lib/sanity-client';
import { getRouteMeta, NOT_FOUND_META } from '../config/route-meta';

const StudioPage = lazy(() => import('../sanity/Studio'));

const StudioFallback = () => (
  <div className="min-h-screen bg-light flex items-center justify-center">
    <p className="font-sans text-primary text-sm">Loading Sanity Studio…</p>
  </div>
);

const PortfolioLayout = () => {
  const { pathname } = useLocation();
  const { data, isLoading, isError } = useSanityData();
  const routeMeta = getRouteMeta(pathname);

  if (isLoading) {
    return (
      <>
        <PageMeta meta={routeMeta} pathname={pathname} />
        <PageSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PageMeta meta={routeMeta} pathname={pathname} />
        <div className="min-h-screen flex flex-col bg-light">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 flex items-center justify-center px-4 text-center"
        >
          <p className="font-sans text-primary max-w-md">
            Something went wrong while loading the site. Please refresh and try again.
          </p>
        </main>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta meta={routeMeta} pathname={pathname} noIndex={routeMeta === NOT_FOUND_META} />
      <StructuredData
        email={data?.footer?.email}
        writings={data?.writings?.collection}
        pathname={pathname}
      />
      <Navigation data={data?.navigation} hero={data?.hero} />
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col bg-light">
        <Routes>
          <Route path="/" Component={() => <Hero data={data?.hero} footerEmail={data?.footer?.email} writings={data?.writings?.collection} />} />
          {/* Work is a section of About now, not its own page. */}
          <Route
            path="/about"
            Component={() => (
              <>
                <About data={data?.about} />
                <Work data={data?.work} />
              </>
            )}
          />
          <Route path="/writing" Component={() => <Writings data={data?.writings} />} />
          {/* Client-side counterparts of the vercel.json redirects: those never
              fire for in-app <Link> navigation, and don't exist in vite dev. */}
          <Route path="/writings" element={<Navigate to="/writing" replace />} />
          <Route path="/work" element={<Navigate to="/about" replace />} />
          {/* Experiments, talks and contact were removed; they fall through here. */}
          <Route path="*" Component={NotFound} />
        </Routes>
      </main>
      <Footer data={data?.footer} navigation={data?.navigation} heroSocials={data?.hero?.socials} />
    </div>
  );
};

export const Layout = () => {
  const { pathname } = useLocation();
  const isStudio = pathname.startsWith('/studio');
  const routeMeta = getRouteMeta(pathname);

  return (
    <>
      {isStudio ? <PageMeta meta={routeMeta} pathname={pathname} noIndex /> : null}
      <Routes>
      <Route
        path="/studio/*"
        element={
          <Suspense fallback={<StudioFallback />}>
            <StudioPage />
          </Suspense>
        }
      />
      <Route path="/*" element={<PortfolioLayout />} />
      </Routes>
    </>
  );
};

export default Layout;
