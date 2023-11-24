import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from './context/MedisimContext';
import { UserSessionContextProvider } from './context/UserSessionContext';
import UpdateContextProvider from './context/OrgUpadateContext'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <UpdateContextProvider>
    <ContextProvider>
      <Router>
      <UserSessionContextProvider>
        <App />
      </UserSessionContextProvider>
      </Router>
    </ContextProvider>
   </UpdateContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
