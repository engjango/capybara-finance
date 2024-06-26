import { Help } from '@mui/icons-material';
import { Button, Checkbox, IconButton, StepContent, Tooltip, Typography } from '@mui/material';
import { handleTextFieldChange } from '../../../shared/events';
import { DialogStatementParseState } from '../../../state/app/statementTypes';
import {
    canGoToStatementMappingScreen,
    changeStatementParsing,
    goToStatementMappingScreen,
    removeAllStatementFiles,
    toggleStatementHasHeader,
} from '../../../state/logic/statement';
import { Greys } from '../../../styles/colours';
import {
    DialogImportActionsBox,
    DialogImportInputTextField,
    DialogImportOptionBox,
    DialogImportOptionsContainerBox,
    DialogImportOptionTitleContainerBox,
} from './shared';
import { useLanguage } from '../../../languages/languages-context';

export const DialogImportParseStepContent: React.FC<{ state: DialogStatementParseState }> = ({ state }) => {
    const { language, translations } = useLanguage();
    return (
        <StepContent>
            <DialogImportOptionsContainerBox>
                <DialogImportOptionBox>
                    <Typography variant="body2" style={{ color: '#67656a' }}>
                        {translations[language].headerRows}
                    </Typography>
                    <Checkbox
                        checked={state.parse.header}
                        onClick={toggleStatementHasHeader}
                        size="small"
                        color="primary"
                    />
                </DialogImportOptionBox>
                <DialogImportOptionBox>
                    <Typography variant="body2" style={{ color: '#67656a' }}>
                        {translations[language].delimiter}
                    </Typography>
                    <DialogImportInputTextField
                        variant="standard"
                        placeholder=","
                        size="small"
                        value={state.parse.delimiter || ''}
                        onChange={changeDelimiter}
                    />
                </DialogImportOptionBox>
                <DialogImportOptionBox>
                    <DialogImportOptionTitleContainerBox>
                        <Typography variant="body2" style={{ color: '#67656a' }}>
                            {translations[language].dateFormat}
                        </Typography>
                        <Tooltip title="See format strings">
                            <IconButton
                                size="small"
                                href="https://github.com/moment/luxon/blob/master/docs/parsing.md#table-of-tokens"
                                target="_blank"
                            >
                                <Help fontSize="small" htmlColor={'#67656a'} />
                            </IconButton>
                        </Tooltip>
                    </DialogImportOptionTitleContainerBox>
                    <DialogImportInputTextField
                        variant="standard"
                        placeholder="yyyy-MM-dd"
                        size="small"
                        value={state.parse.dateFormat || ''}
                        onChange={changeDateFormat}
                    />
                </DialogImportOptionBox>
            </DialogImportOptionsContainerBox>
            <DialogImportActionsBox>
                <Button color="error" variant="outlined" size="small" onClick={removeAllStatementFiles}>
                    {translations[language].back}
                </Button>
                <Tooltip title={canGoToStatementMappingScreen(state) || ''}>
                    <div>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={canGoToStatementMappingScreen(state) !== null}
                            onClick={goToStatementMappingScreen}
                        >
                            {translations[language].mapColumns}
                        </Button>
                    </div>
                </Tooltip>
            </DialogImportActionsBox>
        </StepContent>
    );
};

const changeDelimiter = handleTextFieldChange(value => changeStatementParsing({ delimiter: value || undefined }));
const changeDateFormat = handleTextFieldChange(value => changeStatementParsing({ dateFormat: value || undefined }));
