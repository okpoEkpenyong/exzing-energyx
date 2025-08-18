// frontend/web/src/layout/header.tsx
import React, { FC, ReactElement, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Stack,
  Text,
  IconButton,
  FontIcon,
  Persona,
  PersonaSize,
  Panel,
  PanelType,
  IStackStyles,
  getTheme,
  mergeStyles,
  IIconProps
} from "@fluentui/react";

const theme = getTheme();

interface HeaderProps {
  isMobile: boolean;
//   onToggleSidebar: () => void;
//   onToggleDetailPane?: () => void;
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

const navLinkStyle: React.CSSProperties = {
  color: theme.palette.neutralPrimary,
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 6,
  display: "inline-block"
};

const navLinkActiveStyle: React.CSSProperties = {
  ...navLinkStyle,
  background: theme.palette.themeLight,
  color: theme.palette.themeDarker,
  fontWeight: 600
};

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
  const [panelOpen, setPanelOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/reports", label: "Reports" },
    { to: "/documentation", label: "Documentation" }
  ];

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);

  return (
    <>
      <Stack horizontal verticalAlign="center" styles={{ root: { background: "#fff", borderBottom: "1px solid #eee" } }}>
        {/* Brand */}
        <Stack horizontal styles={logoStyles} verticalAlign="center">
          <FontIcon aria-label="Logo" iconName="SkypeCircleCheck" className={logoIconClass} />
          <Text variant="xLarge">Exzing EnergyX</Text>
        </Stack>

        {/* Inline nav (desktop) */}
        {!isMobile && (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { marginLeft: 12 } }}>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={location.pathname.startsWith(link.to) ? navLinkActiveStyle : navLinkStyle}
              >
                {link.label}
              </Link>
            ))}
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
              <IconButton ariaLabel="Settings" iconProps={{ iconName: "Settings", ...iconProps }} />
              <IconButton ariaLabel="Help" iconProps={{ iconName: "Help", ...iconProps }} />
              <Persona size={PersonaSize.size32} text="Ekpes" />
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
        isLightDismiss={true}
        closeButtonAriaLabel="Close"
        headerText="Menu"
      >
        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 8 } }}>
          {/* Nav links */}
          <Stack tokens={{ childrenGap: 8 }}>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closePanel}
                style={location.pathname.startsWith(link.to) ? navLinkActiveStyle : navLinkStyle}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" styles={{ root: { marginTop: 8 } }}>
            <IconButton ariaLabel="Settings" iconProps={{ iconName: "Settings", ...iconProps }} />
            <IconButton ariaLabel="Help" iconProps={{ iconName: "Help", ...iconProps }} />
            <Persona size={PersonaSize.size40} text="Ekpes" />
          </Stack>

          {/* Optional small quick actions */}
          <Stack tokens={{ childrenGap: 6 }} styles={{ root: { marginTop: 14 } }}>
            <Link to="/reports" onClick={closePanel} style={navLinkStyle}>Generate Report</Link>
            <Link to="/documentation" onClick={closePanel} style={navLinkStyle}>Documentation</Link>
          </Stack>
        </Stack>
      </Panel>
    </>
  );
};

export default Header;
