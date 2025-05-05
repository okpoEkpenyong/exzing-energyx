import { Text, DatePicker, Stack, TextField, PrimaryButton, DefaultButton, Dropdown, IDropdownOption, FontIcon } from '@fluentui/react';
import { useEffect, useState, FC, ReactElement, MouseEvent, FormEvent } from 'react';
import { EnergyxItem, EnergyxItemState } from '../models';
import { stackGaps, stackItemMargin, stackItemPadding, titleStackStyles } from '../ux/styles';

interface EnergyxItemDetailPaneProps {
    item?: EnergyxItem;
    onEdit: (item: EnergyxItem) => void
    onCancel: () => void
}

export const EnergyxItemDetailPane: FC<EnergyxItemDetailPaneProps> = (props: EnergyxItemDetailPaneProps): ReactElement => {
    const [name, setName] = useState(props.item?.name || '');
    const [description, setDescription] = useState(props.item?.description);
    const [dueDate, setDueDate] = useState(props.item?.dueDate);
    const [state, setState] = useState(props.item?.state || EnergyxItemState.energyx);

    useEffect(() => {
        setName(props.item?.name || '');
        setDescription(props.item?.description);
        setDueDate(props.item?.dueDate ? new Date(props.item?.dueDate) : undefined);
        setState(props.item?.state || EnergyxItemState.energyx);
    }, [props.item]);

    const saveEnergyxItem = (evt: MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();

        if (!props.item?.id) {
            return;
        }

        const energyxItem: EnergyxItem = {
            id: props.item.id,
            listId: props.item.listId,
            name: name,
            description: description,
            dueDate: dueDate,
            state: state,
        };

        props.onEdit(energyxItem);
    };

    const cancelEdit = () => {
        props.onCancel();
    }

    const onStateChange = (_evt: FormEvent<HTMLDivElement>, value?: IDropdownOption) => {
        if (value) {
            setState(value.key as EnergyxItemState);
        }
    }

    const onDueDateChange = (date: Date | null | undefined) => {
        setDueDate(date || undefined);
    }

    const energyxStateOptions: IDropdownOption[] = [
        { key: EnergyxItemState.energyx, text: 'To Do' },
        { key: EnergyxItemState.InProgress, text: 'In Progress' },
        { key: EnergyxItemState.Done, text: 'Done' },
    ];

    return (
        <Stack>
            {props.item &&
                <>
                    <Stack.Item styles={titleStackStyles} tokens={stackItemPadding}>
                        <Text block variant="xLarge">{name}</Text>
                        <Text variant="small">{description}</Text>
                    </Stack.Item>
                    <Stack.Item tokens={stackItemMargin}>
                        <TextField label="Name" placeholder="Item name" required value={name} onChange={(_e, value) => setName(value || '')} />
                        <TextField label="Description" placeholder="Item description" multiline size={20} value={description || ''} onChange={(_e, value) => setDescription(value)} />
                        <Dropdown label="State" options={energyxStateOptions} required selectedKey={state} onChange={onStateChange} />
                        <DatePicker label="Due Date" placeholder="Due date" value={dueDate} onSelectDate={onDueDateChange} />
                    </Stack.Item>
                    <Stack.Item tokens={stackItemMargin}>
                        <Stack horizontal tokens={stackGaps}>
                            <PrimaryButton text="Save" onClick={saveEnergyxItem} />
                            <DefaultButton text="Cancel" onClick={cancelEdit} />
                        </Stack>
                    </Stack.Item>
                </>
            }
            {!props.item &&
                <Stack.Item tokens={stackItemPadding} style={{ textAlign: "center" }} align="center">
                    <FontIcon iconName="WorkItem" style={{ fontSize: 24, padding: 20 }} />
                    <Text block>Select an item to edit</Text>
                </Stack.Item>}
        </Stack >
    );
}

export default EnergyxItemDetailPane;