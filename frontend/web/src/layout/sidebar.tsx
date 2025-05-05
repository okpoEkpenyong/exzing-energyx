import { FC, ReactElement } from 'react';
// import energyxListMenu from '../components/energyxListMenu';
import { EnergyxList } from '../models/energyxList';

interface SidebarProps {
    selectedList?: EnergyxList
    lists?: EnergyxList[];
    onListCreate: (list: EnergyxList) => void
}

const Sidebar: FC<SidebarProps> = (props: SidebarProps): ReactElement => {
    return (
        <div>
            <energyxListMenu
                selectedList={props.selectedList}
                lists={props.lists}
                onCreate={props.onListCreate} />
        </div>
    );
};

export default Sidebar;