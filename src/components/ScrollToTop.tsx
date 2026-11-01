import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Po přechodu na jinou stránku se vrátí nahoru; odkaz s # (například /#prace) dojede na danou část. */
export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
