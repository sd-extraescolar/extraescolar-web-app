import { Layout } from "@/components/Layout";
import { NotFound } from "@/components/NotFound";
import { SEO } from "@/components/SEO";
import { AboutPage } from "@/features/about/page/AboutPage";
import { HomePage } from "@/features/home/page/HomePage";
import LoginPage from "@/features/login/page/LoginPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <SEO />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;