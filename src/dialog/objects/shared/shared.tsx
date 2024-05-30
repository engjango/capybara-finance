import styled from '@emotion/styled';
import { AddCircleOutline } from '@mui/icons-material';
import { Button } from '@mui/material';
import { upperFirst } from 'lodash';
import React from 'react';
import { withSuppressEvent } from '../../../shared/events';
import { useAllObjects } from '../../../state/data/hooks';
import { BasicObjectName, BasicObjectType } from '../../../state/data/types';
import { ID } from '../../../state/shared/values';
import { useLanguage } from '../../../languages/languages-context';
export { ObjectEditContainer } from './edit';
export { getUpdateFunctions } from './update';

export interface DialogObjectSelectorProps<Name extends BasicObjectName> {
    type: Name;
    exclude?: ID[];
    createDefaultOption?: () => BasicObjectType[Name];
    onAddNew?: () => void;
    render: (option: BasicObjectType[Name]) => React.ReactNode;
}

export const useObjectsWithExclusionList = <Name extends BasicObjectName>(type: Name, exclude?: ID[]) => {
    const options = useAllObjects(type);
    return exclude ? options.filter(({ id }) => !exclude.includes(id)) : options;
};

export const DialogObjectOptionsBox = styled('div')({
    overflowY: 'auto',
    flexGrow: 1,
    marginTop: 5,
});

export const DialogSelectorAddNewButton: React.FC<{ onClick: () => void; type: string }> = ({ onClick, type }) => {
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
        <DialogSelectorBottomButton
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={withSuppressEvent<HTMLButtonElement>(onClick)}
        >
            {`${translations[language].add} ${getTranslatedType(type)}`}
        </DialogSelectorBottomButton>
    );
};
const DialogSelectorBottomButton = styled(Button)({ margin: 20 });
