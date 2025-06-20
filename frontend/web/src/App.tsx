import { useReducer, FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/layout';
import './App.css';
import { DarkTheme } from './ux/theme';
import { AppContext, ApplicationState, getDefaultState } from './models/applicationState';
import appReducer from './reducers';
import { EnergyxContext } from './components/energyxContext';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider } from '@fluentui/react';
import Telemetry from './components/telemetry';

initializeIcons(undefined, { disableWarnings: true });

const App: FC = () => {
  const defaultState: ApplicationState = getDefaultState();
  const [applicationState, dispatch] = useReducer(appReducer, defaultState);
  const initialContext: AppContext = { state: applicationState, dispatch: dispatch }

  return (
    <ThemeProvider applyTo="body" theme={DarkTheme}>
      <EnergyxContext.Provider value={initialContext}>
        <BrowserRouter>
          <Telemetry>
            <Layout />
          </Telemetry>
        </BrowserRouter>
      </EnergyxContext.Provider>
    </ThemeProvider>
  );
};

export default App;
