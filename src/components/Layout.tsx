import {Routes, Route} from 'react-router-dom';

import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Work from '../sections/Work';
import Experiments from '../sections/Experiments';
import Writings from '../sections/Writings';
import Contact from '../sections/Contact';
import Talks from '../sections/Talks';
import Footer from '../sections/Footer';
import StudioPage from '../sanity/Studio';

import {useSanityData} from '../lib/sanity-client';

const PortfolioLayout = () => {
  const {data, isLoading, isError} = useSanityData();

  if (isLoading || isError) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation data={data?.navigation} hero={data?.hero} />
      <main className="flex-1 flex flex-col bg-light">
        <Routes>
          <Route path="/" Component={() => <Hero data={data?.hero} />} />
          <Route path="/about" Component={() => <About data={data?.about} />} />
          <Route path="/work" Component={() => <Work data={data?.work} />} />
          <Route path="/experiments" Component={() => <Experiments data={data?.experiments} />} />
          <Route path="/writings" Component={() => <Writings data={data?.writings} />} />
          <Route path="/talks" Component={() => <Talks data={data?.talks} />} />
          <Route path="/contact" Component={() => <Contact data={data?.contact} />} />
        </Routes>
      </main>
      <Footer data={data?.footer} />
    </div>
  );
};

export const Layout = () => {
  return (
    <Routes>
      <Route path="/studio/*" element={<StudioPage />} />
      <Route path="/*" element={<PortfolioLayout />} />
    </Routes>
  );
};

export default Layout;
