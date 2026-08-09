import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRouter from '@/routes/AppRouter';
import ScrollToTop from '@/components/common/ScrollToTop';

/**
 * App — root composition: router → theme → auth → route tree.
 */
const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <ScrollToTop />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
