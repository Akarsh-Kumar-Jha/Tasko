import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
<ThemeProvider>
    <Toaster position="top-center" richColors />
    <App />
</ThemeProvider>

</BrowserRouter>

)
