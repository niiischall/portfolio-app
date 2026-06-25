import Layout from './components/Layout';
import PostHogPageViewTracker from './utils/helpers/tracker';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PostHogPageViewTracker />
      <Layout />
    </div>
  );
};

export default App;
