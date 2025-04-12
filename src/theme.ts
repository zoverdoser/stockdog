'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0386f4',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#eaeaea',
      paper: '#ffffff',
    },
  },
})

export default theme
