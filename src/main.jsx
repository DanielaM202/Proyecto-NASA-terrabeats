import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.jsx'
import { PACK_VERSION } from './data/packVersion.js'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`/sw.js?v=${PACK_VERSION}`))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
