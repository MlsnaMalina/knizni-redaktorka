import { Routes, Route } from "react-router-dom";
import { Nav, Footer, ScrollToTop, RevealManager } from "./ui";
import Home from "./pages/Home";
import Sluzby from "./pages/Sluzby";
import Knihy from "./pages/Knihy";
import OMne from "./pages/OMne";
import Kontakt from "./pages/Kontakt";
import RevizeAI from "./pages/RevizeAI";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sluzby" element={<Sluzby />} />
        <Route path="/knihy" element={<Knihy />} />
        <Route path="/o-mne" element={<OMne />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/revize-ai-textu" element={<RevizeAI />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <RevealManager />
      <Footer />
    </>
  );
}
