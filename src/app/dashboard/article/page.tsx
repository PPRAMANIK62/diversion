import Hero from "@/components/article/Hero";
import Demo from "@/components/article/Demo";

import "./globals.css";

const App = () => {
  return (
    <main >
      <div className="main">
        <div className="gradient text-white" />
      </div>

      <div className="app">
        <Hero />
        <Demo />
      </div>
    </main>
  );
};

export default App;
