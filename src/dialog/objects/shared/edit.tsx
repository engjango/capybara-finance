import styled from '@emotion/styled';
import { DeleteForeverTwoTone, DeleteTwoTone, SaveTwoTone } from '@mui/icons-material';
import { Button, TextField, Tooltip } from '@mui/material';
import { isEqual, upperFirst } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { handleTextFieldChange } from '../../../shared/events';
import { useDialogState } from '../../../state/app/hooks';
import { useDeleteObjectError } from '../../../state/data';
import { useObjectByID } from '../../../state/data/hooks';
import { BasicObjectName, BasicObjectType } from '../../../state/data/types';
import { Greys } from '../../../styles/colours';
import { getUpdateFunctions } from './update';
import { useLanguage } from '../../../languages/languages-context';
import { CustomTextField } from '../../../styles/theme';

export const ObjectEditContainer = <Type extends BasicObjectName>({
    type,
    children,
    subtitle,
    onReset,
    valid,
    actions,
}: React.PropsWithChildren<{
    type: Type;
    subtitle?: React.ReactNode;
    onReset?: () => void;
    valid?: boolean;
    actions?: React.ReactElement;
}>) => {
    const working = useDialogState(type) as BasicObjectType[Type];
    const actual = useObjectByID(type, working.id);

    const {
        handleNameChange,
        reset,
        destroy,
        save: saveRaw,
    } = useMemo(() => {
        const functions = getUpdateFunctions(type);
        return {
            handleNameChange: handleTextFieldChange(functions.update('name')),
            reset: () => {
                const actual = functions.get(working.id);
                functions.set(actual);
                if (actual && onReset) onReset();
            },
            destroy: () => functions.destroy(working.id),
            save: functions.save,
        };
    }, [type, working.id, onReset]);
    const save = useCallback(() => saveRaw(working), [saveRaw, working]);

    const deleteObjectError = useDeleteObjectError(type, working.id);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const enableDelete = useCallback(() => setDeleteEnabled(true), []);

    const { language, translations } = useLanguage();    

    const getTranslatedType = (type: string) => {
        switch (type) {
            case 'account':
                return translations[language].account;
            case 'institution':
                return translations[language].institution;
            case 'currency':
                return translations[language].currency;
            case 'rule':
                    return translations[language].rule;
            case 'statement':
                return translations[language].statement;
            case 'category':
                return translations[language].category;
            default:
                return upperFirst(type);
        }
    };

    return (
        <EditBox>
            <CustomTextField 
                label={`${getTranslatedType(type)}`} 
                value={working.name} 
                onChange={handleNameChange} 
                InputLabelProps={{style: {color: '#fff'}}}
                InputProps={{style: {color: '#fff'}}}
            />
            {subtitle || <StubSubtitleBox />}
            {/*<EditDividerBox />*/}
            <EditContainerBox>{children}</EditContainerBox>
            <ActionsBox>
                {actions || <div />}
                <ActionButtonContainer>
                    <Button
                        color="warning"
                        disabled={isEqual(working, actual)}
                        startIcon={<DeleteTwoTone fontSize="small" />}
                        onClick={reset}
                        style={{ color: '#fff' }}
                    >
                        {actual ? translations[language].reset : translations[language].discard}
                    </Button>
                    <Tooltip title={deleteObjectError || ''}>
                        <span>
                            <Button
                                color="error"
                                disabled={deleteObjectError !== undefined}
                                startIcon={<DeleteForeverTwoTone fontSize="small" />}
                                onClick={deleteEnabled ? destroy : enableDelete}
                                variant={deleteEnabled ? 'contained' : undefined}
                                style={{ color: '#fff' }}
                            >
                                {deleteEnabled ? translations[language].confirm : translations[language].delete}
                            </Button>
                        </span>
                    </Tooltip>
                    <Button
                        disabled={isEqual(working, actual) || valid === false}
                        variant="outlined"
                        startIcon={<SaveTwoTone fontSize="small" />}
                        onClick={save}
                        style={{ color: '#fff' }}
                    >
                        {translations[language].save}
                    </Button>
                </ActionButtonContainer>
            </ActionsBox>
        </EditBox>
    );
};

const EditBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 0,
    padding: '20px 20px 8px 20px',
    flexGrow: 1,
});

const EditDividerBox = styled('div')({
    flex: '0 0 1px',
    width: '80%',
    background: Greys[400],
    alignSelf: 'left',
    margin: '10px 25px',
});

const EditContainerBox = styled('div')({
    flexShrink: 1,
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: 30,
    "@media screen and (max-width: 768px)": {
        paddingRight: 4,
        //border: '1px solid #67656a',
        background: 'linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,0,255,0.05))'
    }
});

const ActionsBox = styled('div')({
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 8,
    '@media screen and (max-width: 768px)': {
        textAlign: 'center',
    }
});

const ActionButtonContainer = styled('div')({
    '& > *': {
        marginLeft: '10px !important',
    },
});

const StubSubtitleBox = styled('div')({ height: 15 });
