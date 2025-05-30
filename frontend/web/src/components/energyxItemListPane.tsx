import { CheckboxVisibility, CommandBar, DetailsList, DetailsListLayoutMode, FontIcon, getTheme, IColumn, IDetailsGroupRenderProps, IGroup, IIconProps, IObjectWithKey, IStackStyles, Label, MarqueeSelection, SearchBox, Selection, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';
import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { EnergyxItem, EnergyxItemState, EnergyxList } from '../models';
import { stackItemPadding } from '../ux/styles';

interface EnergyxItemListPaneProps {
    list?: EnergyxList
    items?: EnergyxItem[]
    selectedItem?: EnergyxItem;
    disabled: boolean
    onCreated: (item: EnergyxItem) => void
    onDelete: (item: EnergyxItem) => void
    onComplete: (item: EnergyxItem) => void
    onSelect: (item?: EnergyxItem) => void
}

interface energyxDisplayItem extends IObjectWithKey {
    id?: string
    listId: string
    name: string
    state: EnergyxItemState
    description?: string
    dueDate: Date | string
    completedDate: Date | string
    data: EnergyxItem
    createdDate?: Date
    updatedDate?: Date
}

const addIconProps: IIconProps = {
    iconName: 'Add',
    styles: {
        root: {
        }
    }
};

const createListItems = (items: EnergyxItem[]): energyxDisplayItem[] => {
    return items.map(item => ({
        ...item,
        key: item.id,
        dueDate: item.dueDate ? new Date(item.dueDate).toDateString() : 'None',
        completedDate: item.completedDate ? new Date(item.completedDate).toDateString() : 'N/A',
        data: item
    }));
};

const stackStyles: IStackStyles = {
    root: {
        alignItems: 'center'
    }
}

const EnergyxItemListPane: FC<EnergyxItemListPaneProps> = (props: EnergyxItemListPaneProps): ReactElement => {
    const theme = getTheme();
    const navigate = useNavigate();
    const [newItemName, setNewItemName] = useState('');
    const [items, setItems] = useState(createListItems(props.items || []));
    const [selectedItems, setSelectedItems] = useState<EnergyxItem[]>([]);
    const [isDoneCategoryCollapsed, setIsDoneCategoryCollapsed] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selection = new Selection({
        onSelectionChanged: () => {
            const selectedItems = selection.getSelection().map(item => (item as energyxDisplayItem).data);
            setSelectedItems(selectedItems);
        }
    });

    // Handle list changed
    useEffect(() => {
        setIsDoneCategoryCollapsed(true);
        setSelectedItems([]);
    }, [props.list]);

    // Handle items changed
    useEffect(() => {
        const sortedItems = (props.items || []).sort((a, b) => {
            if (a.state === b.state) {
                return a.name < b.name ? -1 : 1;
            }

            return a.state < b.state ? -1 : 1;
        })
        setItems(createListItems(sortedItems || []));
    }, [props.items]);

    // Handle selected item changed
    useEffect(() => {
        if (items.length > 0 && props.selectedItem?.id) {
            selection.setKeySelected(props.selectedItem.id, true, true);
        }

        const doneItems = selectedItems.filter(i => i.state === EnergyxItemState.Done);
        if (doneItems.length > 0) {
            setIsDoneCategoryCollapsed(false);
        }

    }, [items.length, props.selectedItem, selectedItems, selection])

    const groups: IGroup[] = [
        {
            key: EnergyxItemState.energyx,
            name: 'energyx',
            count: items.filter(i => i.state === EnergyxItemState.energyx).length,
            startIndex: items.findIndex(i => i.state === EnergyxItemState.energyx),
        },
        {
            key: EnergyxItemState.InProgress,
            name: 'In Progress',
            count: items.filter(i => i.state === EnergyxItemState.InProgress).length,
            startIndex: items.findIndex(i => i.state === EnergyxItemState.InProgress)
        },
        {
            key: EnergyxItemState.Done,
            name: 'Done',
            count: items.filter(i => i.state === EnergyxItemState.Done).length,
            startIndex: items.findIndex(i => i.state === EnergyxItemState.Done),
            isCollapsed: isDoneCategoryCollapsed
        },
    ]

    const onFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (newItemName && props.onCreated) {
            const item: EnergyxItem = {
                name: newItemName,
                listId: props.list?.id || '',
                state: EnergyxItemState.energyx,
            }
            props.onCreated(item);
            setNewItemName('');
        }
    }

    const onNewItemChanged = (_evt?: FormEvent<HTMLInputElement>, value?: string) => {
        setNewItemName(value || '');
    }

    const selectItem = (item: energyxDisplayItem) => {
        navigate(`/lists/${item.data.listId}/items/${item.data.id}`);
    }

    const completeItems = () => {
        selectedItems.map(item => props.onComplete(item));
    }

    const deleteItems = () => {
        selectedItems.map(item => props.onDelete(item));
    }

    const columns: IColumn[] = [
        { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100 },
        { key: 'dueDate', name: 'Due', fieldName: 'dueDate', minWidth: 100 },
        { key: 'completedDate', name: 'Completed', fieldName: 'completedDate', minWidth: 100 },
    ];

    const groupRenderProps: IDetailsGroupRenderProps = {
        headerProps: {
            styles: {
                groupHeaderContainer: {
                    backgroundColor: theme.palette.neutralPrimary
                }
            }
        }
    }

    const renderItemColumn = (item: energyxDisplayItem, _index?: number, column?: IColumn) => {
        const fieldContent = item[column?.fieldName as keyof energyxDisplayItem] as string;

        switch (column?.key) {
            case "name":
                return (
                    <>
                        <Text variant="small" block>{item.name}</Text>
                        {item.description &&
                            <>
                                <FontIcon iconName="QuickNote" style={{ padding: "5px 5px 5px 0" }} />
                                <Text variant="smallPlus">{item.description}</Text>
                            </>
                        }
                    </>
                );
            default:
                return (<Text variant="small">{fieldContent}</Text>)
        }
    }

    return (
        <Stack>
            <Stack.Item>
                <form onSubmit={onFormSubmit}>
                    <Stack horizontal styles={stackStyles}>
                        <Stack.Item grow={1}>
                            <SearchBox value={newItemName} placeholder="Add an item" iconProps={addIconProps} onChange={onNewItemChanged} disabled={props.disabled} />
                        </Stack.Item>
                        <Stack.Item>
                            <CommandBar
                                items={[
                                    {
                                        key: 'markComplete',
                                        text: 'Mark Complete',
                                        disabled: props.disabled,
                                        iconProps: { iconName: 'Completed' },
                                        onClick: () => { completeItems() }
                                    },
                                    {
                                        key: 'delete',
                                        text: 'Delete',
                                        disabled: props.disabled,
                                        iconProps: { iconName: 'Delete' },
                                        onClick: () => { deleteItems() }
                                    }
                                ]}
                                ariaLabel="energyx actions" />
                        </Stack.Item>
                    </Stack>
                </form>
            </Stack.Item>
            {items.length > 0 &&
                <Stack.Item>
                    <MarqueeSelection selection={selection}>
                        <DetailsList
                            items={items}
                            groups={groups}
                            columns={columns}
                            groupProps={groupRenderProps}
                            setKey="id"
                            onRenderItemColumn={renderItemColumn}
                            selection={selection}
                            layoutMode={DetailsListLayoutMode.justified}
                            selectionPreservedOnEmptyClick={true}
                            ariaLabelForSelectionColumn="Toggle selection"
                            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                            checkButtonAriaLabel="select row"
                            checkboxVisibility={CheckboxVisibility.always}
                            onActiveItemChanged={selectItem} />
                    </MarqueeSelection>
                </Stack.Item>
            }
            {!props.items &&
                <Stack.Item align="center" tokens={stackItemPadding}>
                    <Label>Loading List Items...</Label>
                    <Spinner size={SpinnerSize.large} labelPosition="top" />
                </Stack.Item>
            }
            {props.items && items.length === 0 &&
                <Stack.Item align="center" tokens={stackItemPadding}>
                    <Text>This list is empty.</Text>
                </Stack.Item>
            }
        </Stack>
    );
};

export default EnergyxItemListPane;