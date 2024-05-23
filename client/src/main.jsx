import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='589769499767-m3ok4rsni6v9s5bp6smcmlndni0l6rr1.apps.googleusercontent.com'>
  <Providers>
    <App />
  </Providers>
  </GoogleOAuthProvider>
)