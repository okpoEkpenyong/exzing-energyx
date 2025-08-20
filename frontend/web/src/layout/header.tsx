// frontend/web/src/layout/header.tsx
import React, { FC, ReactElement, useState, useContext } from "react";

import { Link, useLocation } from "react-router-dom";
import {
  Stack,
  Text,
  IconButton,
  FontIcon,
  Panel,
  PanelType,
  IStackStyles,
  getTheme,
  mergeStyles,
  IIconProps
} from "@fluentui/react";
import { ThemeToggleContext } from "../contexts/themeContext";

const theme = getTheme();

interface HeaderProps {
  isMobile: boolean;
}

const logoStyles: IStackStyles = {
  root: {
    minWidth: 200,
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    background: "#bf9b30"
  }
};

const logoIconClass = mergeStyles({
  fontSize: 20,
  paddingRight: 10
});


const navLinkBase = (theme: ReturnType<typeof getTheme>): React.CSSProperties => ({
  color: theme.palette.neutralPrimary,
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: 6,
  display: "inline-block",
  transition: "background 0.12s ease",
});

const activeNavLink = (theme: ReturnType<typeof getTheme>): React.CSSProperties => ({
  ...navLinkBase(theme),
  background: theme.palette.themePrimary,
  color: theme.palette.white,
  fontWeight: 600,
});


const headerRightStyles: IStackStyles = {
  root: {
    alignItems: "center",
    padding: "0 12px"
  }
};

const iconProps: IIconProps = {
  styles: {
    root: {
      fontSize: 16,
      color: theme.palette.neutralPrimary
    }
  }
};

const Header: FC<HeaderProps> = ({ isMobile }): ReactElement => {
  const location = useLocation();
  const { isDark, toggle } = useContext(ThemeToggleContext);
  const theme = getTheme();
  const [panelOpen, setPanelOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    // { to: "/reports", label: "Reports" },
    { to: "/documentation", label: "Documentation" },
    { to: "/voyage", label: "Voyage Log" },
    // { to: "/vessels", label: "Vessels" },
    // { to: "/credits", label: "Credits" },
    { to: "/login", label: "Login" },
  ];

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);
  
  const panelBackground = isDark ? theme.palette.neutralDark : theme.palette.white;

  return (
    <>
      <Stack horizontal verticalAlign="center" styles={{ root: { background: "#fff", border: "1px solid #bf9b30" } }}>
        {/* Brand */}
        <Stack horizontal styles={logoStyles} verticalAlign="center">
          <FontIcon aria-label="Logo" iconName="SkypeCircleCheck" className={logoIconClass} />
          <Text variant="xLarge">Exzing EnergyX</Text>
        </Stack>

        {/* Inline nav (desktop) */}
        {!isMobile && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginLeft: 12 } }}>
            {links.map((l) => {
              const isActive = location.pathname.startsWith(l.to) || (l.to === "/dashboard" && location.pathname === "/");
              return (
                <Link key={l.to} to={l.to} style={isActive ? activeNavLink(theme) : navLinkBase(theme)}>
                  {l.label}
                </Link>
              );
            })}
          </Stack>
        )}

        {/* spacer */}
        <Stack.Item grow={1}>
          <div />
        </Stack.Item>

        {/* Right tools - desktop: show icons, mobile: show hamburger */}
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={headerRightStyles}>
          {!isMobile ? (
            <>
              <IconButton ariaLabel="Toggle theme" iconProps={{ iconName: isDark ? "Sunny" : "ClearNight", ...iconProps }} onClick={() => toggle()} />
              <IconButton ariaLabel="Help" iconProps={{ iconName: "Help", ...iconProps }} />
              {/* <Persona size={PersonaSize.size32} text="Ekpes" />  */}
              
            </>
          ) : (
            <>
              {/* Mobile shows hamburger which opens a Panel containing nav + actions */}
              <IconButton
                ariaLabel="Open menu"
                iconProps={{ iconName: "GlobalNavButton", styles: { root: { fontSize: 20 } } }}
                onClick={openPanel}
              />
            </>
          )}
        </Stack>
      </Stack>

      {/* Panel used as responsive drawer for mobile */}
      <Panel
        isOpen={panelOpen}
        onDismiss={closePanel}
        type={PanelType.smallFixedFar}
        isLightDismiss
        closeButtonAriaLabel="Close"
        headerText="Menu"
        styles={{
          root: { background: panelBackground },
          content: { background: panelBackground },
          navigation: { background: panelBackground },
        }}
      >
        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 8 } }}>
          {/* Links */}
          <Stack tokens={{ childrenGap: 6 }}>
            {links.map((l) => {
              const isActive = location.pathname.startsWith(l.to) || (l.to === "/dashboard" && location.pathname === "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={closePanel}
                  style={isActive ? activeNavLink(theme) : { ...navLinkBase(theme), color: isDark ? theme.palette.white : theme.palette.neutralPrimary }}
                >
                  {l.label}
                </Link>
              );
            })}
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" styles={{ root: { marginTop: 8 } }}>
            <IconButton ariaLabel="Toggle theme" iconProps={{ iconName: isDark ? "Sunny" : "ClearNight", ...iconProps }} onClick={() => { toggle(); }} />
            <IconButton ariaLabel="Help" iconProps={{ iconName: "Help", ...iconProps }} />
            {/* <Persona size={PersonaSize.size40} text="Ekpes" /> */}
          </Stack>

          {/* <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginTop: 12 } }}>
            <Link to="/reports" onClick={closePanel} style={{ ...navLinkBase(theme), color: isDark ? theme.palette.white : theme.palette.neutralPrimary }}>
              Generate Report
            </Link>
            <Link to="/documentation" onClick={closePanel} style={{ ...navLinkBase(theme), color: isDark ? theme.palette.white : theme.palette.neutralPrimary }}>
              Documentation
            </Link>
          </Stack> */}
        </Stack>
      </Panel>
    </>
  );
};

export default Header;
