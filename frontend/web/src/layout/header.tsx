import { FontIcon, getTheme, IconButton, IIconProps, IStackStyles, mergeStyles, Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import { FC, ReactElement } from 'react';

const theme = getTheme();


interface HeaderProps {
  isMobile: boolean;
  onToggleSidebar: () => void;
  onToggleDetailPane: () => void;
}

const logoStyles: IStackStyles = {
    root: {
        width: '300px',
        background: theme.palette.themePrimary,
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

const iconProps: IIconProps = {
    styles: {
        root: {
            fontSize: 16,
            color: theme.palette.white
        }
    }
}

const Header:  FC<HeaderProps> = ({ isMobile, onToggleSidebar }): ReactElement => {
    // const Header: FC<HeaderProps> = ({ isMobile, onToggleSidebar }) => {
    return (
        
        <Stack horizontal>
            {isMobile && (
                <IconButton
                iconProps={{ iconName: 'GlobalNavButton' }} // hamburger icon
                ariaLabel="Toggle sidebar"
                onClick={onToggleSidebar}
                styles={{ root: { marginRight: 8 } }}
                />
            )}
            <Stack horizontal styles={logoStyles}>
                <FontIcon aria-label="Check" iconName="SkypeCircleCheck" className={logoIconClass} />
                <Text variant="xLarge">Exzing EnergyX</Text>
            </Stack>
            <Stack.Item grow={1}>
                <div></div>
            </Stack.Item>
            <Stack.Item>
                <Stack horizontal styles={toolStackClass} grow={1}>
                    <IconButton aria-label="Add" iconProps={{ iconName: "Settings", ...iconProps }} />
                    <IconButton aria-label="Add" iconProps={{ iconName: "Help", ...iconProps }} />
                    <Persona size={PersonaSize.size24} text="Sample User" />
                    {/* <Toggle label="Dark Mode" inlineLabel styles={{ root: { marginBottom: 0 } }} onChange={changeTheme} /> */}
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

export default Header;