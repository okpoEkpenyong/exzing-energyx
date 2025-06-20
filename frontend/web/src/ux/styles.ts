// exzing-energyx/frontend/web/src/ux/styles.ts

import { getTheme, IStackItemTokens, IStackStyles, IStackTokens } from '@fluentui/react'
const theme = getTheme();

export const rootStackStyles: IStackStyles = {
    root: {
        height: '100vh'
    }
}

export const headerStackStyles: IStackStyles = {
    root: {
        height: 48,
        // background: theme.palette.themeDarker
        backgroundColor: '#a67c00', // dark navy base
    }
}

export const listItemsStackStyles: IStackStyles = {
    root: {
        padding: '10px'
    }
}

export const mainStackStyles: IStackStyles = {
    root: {
    }
}

export const sidebarStackStyles: IStackStyles = {
    root: {
        minWidth: 300,
        background: theme.palette.neutralPrimary,
        boxShadow: theme.effects.elevation8
    }
}

export const titleStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        background: theme.palette.neutralPrimaryAlt,
    }
}

export const stackPadding: IStackTokens = {
    padding: 10
}

export const stackGaps: IStackTokens = {
    childrenGap: 10
}

export const stackItemPadding: IStackItemTokens = {
    padding: 10
}

export const stackItemMargin: IStackItemTokens = {
    margin: 10
}

export const dashboardPanelStyles: IStackStyles = {
  root: {
    background: theme.palette.neutralLighter,
    padding: 20,
    borderRadius: 6,
    boxShadow: theme.effects.elevation4,
  },
};
