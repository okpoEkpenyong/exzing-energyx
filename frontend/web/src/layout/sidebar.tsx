import { FC, ReactElement } from 'react';
// import energyxListMenu from '../components/energyxListMenu';
import { energyxList } from '../models/energyxList';

interface SidebarProps {
    selectedList?: energyxList
    lists?: energyxList[];
    onListCreate: (list: energyxList) => void
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