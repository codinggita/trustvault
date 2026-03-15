import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { lightTheme, darkTheme } from './theme/theme'

// Check for saved theme preference or use system preference
const getThemeMode = () => {
  const savedTheme = localStorage.getItem('themeMode')
  if (savedTheme) return savedTheme
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themeMode = getThemeMode()
const theme = themeMode === 'dark' ? darkTheme : lightTheme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
