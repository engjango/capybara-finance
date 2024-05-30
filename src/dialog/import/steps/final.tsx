import { Button, Checkbox, StepContent, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { handleCheckboxChange } from '../../../shared/events';
import { CapybaraDispatch, CapybaraStore } from '../../../state';
import { AppSlice } from '../../../state/app';
import { useDialogState } from '../../../state/app/hooks';
import { DialogStatementImportState } from '../../../state/app/statementTypes';
import {
    canImportStatementsAndClearDialog,
    goBackToStatementMapping,
    importStatementsAndClearDialog,
} from '../../../state/logic/statement';
import { DialogImportActionsBox, DialogImportOptionBox, DialogImportOptionsContainerBox } from './shared';
import { useLanguage } from '../../../languages/languages-context';

export const DialogImportImportStepContent: React.FC<{
    shouldDetectTransfers: boolean;
    setShouldDetectTransfers: (value: boolean) => void;
}> = ({ shouldDetectTransfers, setShouldDetectTransfers }) => {
    const [shouldRunRules, setShouldRunRules] = useState(true);
    const reversed = useDialogState('import', state => (state as DialogStatementImportState).reverse);
    const { language, translations } = useLanguage();

    return (
        <StepContent>
            <DialogImportOptionsContainerBox>
                <DialogImportOptionBox>
                    <Typography variant="body2" style={{ color: '#67656a' }}>
                        {translations[language].includeTransfers}
                    </Typography>
                    <Checkbox
                        checked={shouldDetectTransfers}
                        onChange={handleCheckboxChange(setShouldDetectTransfers)}
                        size="small"
                        color="primary"
                    />
                </DialogImportOptionBox>
                <DialogImportOptionBox>
                    <Typography variant="body2" style={{ color: '#67656a' }}>
                        {translations[language].runImportRules}
                    </Typography>
                    <Checkbox
                        checked={shouldRunRules}
                        onChange={handleCheckboxChange(setShouldRunRules)}
                        size="small"
                        color="primary"
                    />
                </DialogImportOptionBox>
                <DialogImportOptionBox>
                    <Typography variant="body2" style={{ color: '#67656a' }}>
                        {translations[language].reverseTransactionOrder}
                    </Typography>
                    <Checkbox checked={reversed} onChange={toggleReverseOrder} size="small" color="primary" />
                </DialogImportOptionBox>
            </DialogImportOptionsContainerBox>
            <DialogImportActionsBox>
                <Button color="error" variant="outlined" size="small" onClick={goBackToStatementMapping}>
                    {translations[language].back}
                </Button>
                <Tooltip title={canImportStatementsAndClearDialog() || ''}>
                    <div style={{ background: '#fff' }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => importStatementsAndClearDialog(shouldRunRules, shouldDetectTransfers)}
                            disabled={canImportStatementsAndClearDialog() !== null}
                        >
                            {translations[language].importFiles}
                        </Button>
                    </div>
                </Tooltip>
            </DialogImportActionsBox>
        </StepContent>
    );
};

const toggleReverseOrder = handleCheckboxChange(reverse => {
    const current = CapybaraStore.getState().app.dialog.import as DialogStatementImportState;
    CapybaraDispatch(
        AppSlice.actions.setDialogPartial({
            id: 'import',
            import: {
                ...current,
                reverse,
            },
        })
    );
});
