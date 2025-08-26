// frontend/web/src/layout/layout.tsx
import React from "react";
import { Stack } from "@fluentui/react";
import { FC, ReactElement, useContext, useEffect, useMemo} from "react";
import { Route, Routes } from "react-router-dom";
import * as itemActions from "../actions/itemActions";
import { ItemActions } from "../actions/itemActions";
import * as listActions from "../actions/listActions";
import { ListActions } from "../actions/listActions";
import { EnergyxContext } from "../components/energyxContext";
import { AppContext } from "../models/applicationState";
import { headerStackStyles, mainStackStyles, rootStackStyles } from "../ux/styles";
import Header from "./header";
import { bindActionCreators } from "../actions/actionCreators";
import DashboardPage from "../pages/dashboardPage";
import useIsMobile from "../hooks/useIsMobile";
import ReportsPage from "../pages/reportsPage";
import DocumentationPage from "../pages/documentationPage";
import LoginPage from "../pages/loginPage";
import VoyageLog from "../pages/voyageLog";
import AddVessel from "../pages/addVessel";
import CreditsDashboard from "../pages/creditsDashboard";
import VesselSnapshot from "../pages/vesselSnapshot";
import LandingPage from "../pages/landingPage";
import SatelliteStub from "../pages/satelliteStub";
import AuditorDashboard from "../pages/auditorDashboard";
import CreditDetail from "../pages/creditDetail";

const Layout: FC = (): ReactElement => {
  const isMobile = useIsMobile();
//   const [showSidebar, setShowSidebar] = useState(false);

  const appContext = useContext<AppContext>(EnergyxContext);
  const actions = useMemo(
    () => ({
      lists: bindActionCreators(listActions, appContext.dispatch) as unknown as ListActions,
      items: bindActionCreators(itemActions, appContext.dispatch) as unknown as ItemActions,
    }),
    [appContext.dispatch]
  );

  useEffect(() => {
    if (!appContext.state.lists) {
      actions.lists.list();
    }
  }, [actions.lists, appContext.state.lists]);

  return (
    <Stack styles={rootStackStyles}>
      <Stack.Item styles={headerStackStyles}>
        <Header isMobile={isMobile} />
      </Stack.Item>

      <Stack horizontal={!isMobile} wrap={isMobile} grow={1}>
        <Stack.Item grow={1} styles={mainStackStyles}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/voyage" element={<VoyageLog />} />
            <Route path="/vessels/add" element={<AddVessel />} />
            <Route path="/vessels" element={<VesselSnapshot />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/credits" element={<CreditsDashboard />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/credits/:id" element={<CreditDetail />} />
            <Route path="/auditor" element={<AuditorDashboard />} />
            <Route path="/satellite-stub" element={<SatelliteStub />} />

            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default Layout;
