import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home/page/HomePage";
import { AboutPage } from "@/features/about/page/AboutPage";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/Layout";
import { NotFound } from "@/components/NotFound";

function App() {
  return (
    <Router>
      <SEO />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
