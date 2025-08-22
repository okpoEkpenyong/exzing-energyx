// frontend/web/src/App.tsx

import { useReducer, FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/layout';
import './App.css';
import { AppContext, ApplicationState, getDefaultState } from './models/applicationState';
import appReducer from './reducers';
import { EnergyxContext } from './components/energyxContext';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import Telemetry from './components/telemetry';
import { ThemeProviderWrapper } from './contexts/themeContext';
import React from 'react';


initializeIcons(undefined, { disableWarnings: true });

const App: FC = () => {
  const defaultState: ApplicationState = getDefaultState();
  const [applicationState, dispatch] = useReducer(appReducer, defaultState);
  const initialContext: AppContext = { state: applicationState, dispatch: dispatch }

  return (
    <ThemeProviderWrapper>
      <EnergyxContext.Provider value={initialContext}>
        <BrowserRouter>
          <Telemetry>
            <Layout />
          </Telemetry>
        </BrowserRouter>
      </EnergyxContext.Provider>
    </ThemeProviderWrapper>
  );
};

export default App;


