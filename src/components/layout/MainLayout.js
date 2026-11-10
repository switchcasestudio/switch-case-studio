import CursorComponent from '../ui/CursorComponent';
import Header from './Header';
import Footer from './Footer';
import ScrollTriggerRefresher from '../util/ScrollTriggerRefresher';

// Skip link (2026-11-10): the first Tab stop on every page. A keyboard user
// took 18 to 28 Tab presses to get past the header. Focus moves in script, so
// the URL keeps its hash and the router does not treat it as a navigation.
const skipToContent = (e) => {
  e.preventDefault();
  const main = document.getElementById('main');
  if (!main) return;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: 'start' });
};

const MainLayout = ({ children }) => {
  return (
    <>
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <ScrollTriggerRefresher />
      <CursorComponent />
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
