import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import App from './App';
import Admin from './pages/Admin';
import AutoPass from './pages/AutoPass';
import Landing from './pages/Landing';
import PasswordReset from './pages/PasswordReset';
import Register from './pages/Register';
import RegisterSpecial from './pages/RegisterSpecial';
import SubmittedPending from './pages/SubmittedPending';

// biome-ignore lint/style/noNonNullAssertion: The root element is guaranteed to exist in the HTML
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-special" element={<RegisterSpecial />} />
          <Route path="/submitted-pending" element={<SubmittedPending />} />
          <Route path="/auto-pass" element={<AutoPass />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
