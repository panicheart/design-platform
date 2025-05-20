import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { LanguageProvider } from './contexts/LanguageContext';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ResourceLibrary from './components/ResourceLibrary';
import DevelopmentPlatform from './components/DevelopmentPlatform';
import Profile from './components/Profile';
import TaskProgress from './components/TaskProgress';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/development" element={<DevelopmentPlatform />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tasks" element={<TaskProgress />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default App;
