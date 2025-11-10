import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 

import App from './App.tsx'

import { AuthProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { ProductProvider } from './context/ProductContext.tsx'
import NotificationContainer from './components/NotificationProvider.tsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './estilos.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <ProductProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationContainer />
              <App />
            </CartProvider>
          </AuthProvider>
        </ProductProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>,
)