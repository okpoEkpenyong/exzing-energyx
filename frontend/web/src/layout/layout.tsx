// exzing-energyx/frontend/web/src/layout/layout.tsx

import { Stack } from '@fluentui/react';
import { FC, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import * as itemActions from '../actions/itemActions';
import { ItemActions } from '../actions/itemActions';
import * as listActions from '../actions/listActions';
import { ListActions } from '../actions/listActions';
import { EnergyxContext } from '../components/energyxContext';
import { EnergyxItem, EnergyxList } from '../models';
import { AppContext } from '../models/applicationState';
// import HomePage from '../pages/homePage';
import { headerStackStyles, mainStackStyles, rootStackStyles, sidebarStackStyles } from '../ux/styles';
import Header from './header';
import Sidebar from './sidebar';
import EnergyxItemDetailPane from '../components/energyxItemDetailPane';
import { bindActionCreators } from '../actions/actionCreators';
import DashboardPage from '../pages/dashboardPage';
import useIsMobile from '../hooks/useIsMobile';  // <-- NEW

const Layout: FC = (): ReactElement => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();  
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDetailPane, setShowDetailPane] = useState(false);

    const appContext = useContext<AppContext>(EnergyxContext)
    const actions = useMemo(() => ({
        lists: bindActionCreators(listActions, appContext.dispatch) as unknown as ListActions,
        items: bindActionCreators(itemActions, appContext.dispatch) as unknown as ItemActions,
    }), [appContext.dispatch]);

    // Load initial lists
    useEffect(() => {
        if (!appContext.state.lists) {
            actions.lists.list();
        }
    }, [actions.lists, appContext.state.lists]);

    const onListCreated = async (list: EnergyxList) => {
        const newList = await actions.lists.save(list);
        navigate(`/lists/${newList.id}`);
    }

    const onItemEdited = (item: EnergyxItem) => {
        actions.items.save(item.listId, item);
        actions.items.select(undefined);
        navigate(`/lists/${item.listId}`);
    }

    const onItemEditCancel = () => {
        if (appContext.state.selectedList) {
            actions.items.select(undefined);
            navigate(`/lists/${appContext.state.selectedList.id}`);
        }
    }

    return (
        <Stack styles={rootStackStyles}>
            <Stack.Item styles={headerStackStyles}>
                <Header
                  isMobile={isMobile}
                  onToggleSidebar={() => setShowSidebar(prev => !prev)}
                  onToggleDetailPane={() => setShowDetailPane(prev => !prev)}
                />
            </Stack.Item>
            <Stack horizontal={!isMobile} wrap={isMobile} grow={1}> {/* Responsive */}
               {( !isMobile || showSidebar ) && (
                    <Stack.Item styles={sidebarStackStyles}>
                        <Sidebar
                            selectedList={appContext.state.selectedList}
                            lists={appContext.state.lists}
                            onListCreate={onListCreated}
                        />
                    </Stack.Item>
                )}

                <Stack.Item grow={1} styles={mainStackStyles}>
                    <Routes>
                        <Route path="/lists/:listId/items/:itemId" element={<DashboardPage />} />
                        <Route path="/lists/:listId" element={<DashboardPage />} />
                        <Route path="/lists" element={<DashboardPage />} />
                        <Route path="/" element={<DashboardPage />} />
                    </Routes>
                </Stack.Item>

               {( !isMobile || showDetailPane ) && (
                    <Stack.Item styles={sidebarStackStyles}>
                        <EnergyxItemDetailPane
                            item={appContext.state.selectedItem}
                            onEdit={onItemEdited}
                            onCancel={onItemEditCancel}
                        />
                    </Stack.Item>
                )}
            </Stack>
        </Stack>
    );
}

export default Layout;

