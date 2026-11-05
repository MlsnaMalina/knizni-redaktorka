import { Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { SiteFooter } from './components/SiteFooter';
import { ToTop } from './components/ToTop';
import { COOKIES_PATH, PRIVACY_PATH } from './data/site';
import Cookies from './pages/Cookies';
import Zasady from './pages/Zasady';
import Uvod from './pages/Uvod';
import Sluzby from './pages/Sluzby';
import Knihovna from './pages/Knihovna';
import OMne from './pages/OMne';
import Kontakt from './pages/Kontakt';
import RevizeAI from './pages/RevizeAI';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Uvod />} />
        <Route path="/sluzby" element={<Sluzby />} />
        <Route path="/knihovna" element={<Knihovna />} />
        <Route path="/o-mne" element={<OMne />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/revize-ai-textu" element={<RevizeAI />} />
        <Route path={COOKIES_PATH} element={<Cookies />} />
        <Route path={PRIVACY_PATH} element={<Zasady />} />
        <Route path="/knihy" element={<Navigate to="/knihovna" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter />
      <ToTop />
    </>
  );
}
