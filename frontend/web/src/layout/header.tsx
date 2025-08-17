// frontend\web\src\layout\header.tsx
import { FC, ReactElement } from 'react';
import { Link } from "react-router-dom";
import {
  FontIcon,
  getTheme,
  IconButton,
//   IIconProps,
  IStackStyles,
  mergeStyles,
  Stack,
  Text,
} from "@fluentui/react";

const theme = getTheme();


interface HeaderProps {
  isMobile: boolean;
//   onToggleSidebar: () => void;
//   onToggleDetailPane: () => void;
}

const logoStyles: IStackStyles = {
    root: {
        width: '300px',
        // background: exzingHeaderTheme.palette.themeExzing,
        // background: theme.palette.themePrimary,
        background: '#bf9b30',
        alignItems: 'center',
        padding: '0 20px'
    }
}

const logoIconClass = mergeStyles({
    fontSize: 20,
    paddingRight: 10
});

const toolStackClass: IStackStyles = {
    root: {
        alignItems: 'center',
        height: 48,
        paddingRight: 10
    }
}

// const iconProps: IIconProps = {
//     styles: {
//         root: {
//             fontSize: 16,
//             color: theme.palette.white
//         }
//     }
// }

const navLinkStyle: React.CSSProperties = {
    color: theme.palette.neutralPrimary,
    // background: '#bf9b30',
    // color: '#ffff',
    textDecoration: "none",
    padding: "8px 12px",
    // borderRadius: 6,
  };
  
  const activeLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    background: theme.palette.themeLight,
    color: '#bf9b30',
    fontWeight: 600,
  };


const Header:  FC<HeaderProps> = ({ isMobile }): ReactElement => {

    return (
        
        <Stack horizontal>
            {isMobile && (
                <IconButton
                iconProps={{ iconName: 'GlobalNavButton' }} // hamburger icon
                ariaLabel="Toggle sidebar"
                // onClick={onToggleSidebar}
                styles={{ root: { marginRight: 8 } }}
                />
            )}
            <Stack horizontal styles={logoStyles}>
                <FontIcon aria-label="Check" iconName="SkypeCircleCheck" className={logoIconClass} />
                <Text variant="xLarge">Exzing EnergyX</Text>
            </Stack>
            <Stack.Item>
                <Stack horizontal styles={toolStackClass} grow={1}>
                    <Link to="/dashboard" style={location.pathname.startsWith("/dashboard") ? activeLinkStyle : navLinkStyle}>
                        Dashboard
                    </Link>
                    <Link to="/documentation" style={location.pathname.startsWith("/dashboard") ? activeLinkStyle : navLinkStyle}>
                        Documentation
                    </Link>
                    <Link to="/register" style={ activeLinkStyle} >
                        Register
                    </Link>
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;
