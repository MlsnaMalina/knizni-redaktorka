import { Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
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
        <Route path="/knihy" element={<Navigate to="/knihovna" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
