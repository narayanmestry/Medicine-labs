import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { Theme, createTheme } from '@mui/material';
import { themeOptions } from './theme/customTheme';
import { ThemeProvider } from '@emotion/react';
import { ToastContainer } from 'react-toastify';
import AllRoutes from './utils/AllRoutes';

function App() {
  const [theme, setTheme] = useState<Theme>(createTheme(themeOptions))

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ToastContainer position='top-right' autoClose={3000} hideProgressBar={true} theme={'colored'}/>
        <AllRoutes/>
      </div>
    </ThemeProvider>
  );
}

export default App;
