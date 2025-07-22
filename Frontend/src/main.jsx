import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react'; 
import InitialLoader from './components/InitialLoader.jsx';
import './index.css';

const App = React.lazy(() => import('./App.jsx')); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<InitialLoader />}>
      <App />
    </Suspense>
  </StrictMode>
);