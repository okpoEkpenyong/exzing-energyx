// exzing-energyx/frontend/web/src/layout/sidebar.tsx

import { FC, ReactElement } from 'react';
import EnergyxListMenu  from '../components/energyxListMenu';
// import { IIconProps } from '@fluentui/react/lib/Icon';
import { EnergyxList } from '../models/energyxList';

interface SidebarProps {
    selectedList?: EnergyxList
    lists?: EnergyxList[];
    onListCreate: (list: EnergyxList) => void
}

const Sidebar: FC<SidebarProps> = (props: SidebarProps): ReactElement => {
    return (
        <div>
            <EnergyxListMenu
                selectedList={props.selectedList}
                lists={props.lists}
                onCreate={props.onListCreate} />
        </div>
    );
};

export default Sidebar;