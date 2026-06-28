import Layout from './components/Layout';
import PostHogPageViewTracker, { ScrollDepthTracker } from './utils/helpers/tracker';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <a className="skip-to-content" href="#main-content">
        Skip to content
      </a>
      <PostHogPageViewTracker />
      <ScrollDepthTracker />
      <Layout />
    </div>
  );
};

export default App;
