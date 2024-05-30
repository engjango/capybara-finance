import styled from '@emotion/styled';
import { ChevronRight, Description, Edit, FolderOpen, OpenInNew, Payment } from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';
import { useCallback } from 'react';
import { NonIdealState } from '../../components/display/NonIdealState';
import { Section } from '../../components/layout';
import { CapybaraDispatch } from '../../state';
import { AppSlice } from '../../state/app';
import { DefaultDialogs } from '../../state/app/defaults';
import { useAccountPageAccount } from '../../state/app/hooks';
import { Account, Statement } from '../../state/data';
import { useAllStatements } from '../../state/data/hooks';
import { ID } from '../../state/shared/values';
import { Greys } from '../../styles/colours';
import { useLanguage } from '../../languages/languages-context';

export const AccountStatementTable: React.FC = () => {
    const account = useAccountPageAccount();
    const statements = useAllStatements().filter(statement => statement.account === account.id);
    const { language, translations } = useLanguage();

    const uploadStatementView = useCallback(
        () =>
            CapybaraDispatch(
                AppSlice.actions.setDialogPartial({ id: 'import', import: { ...DefaultDialogs.import, account } })
            ),
        [account]
    );

    if (statements.length === 0) {
        return (
            <Section title={translations[language].statements} PaperSx={{ display: 'flex', flexDirection: 'column' }}>
                <NonIdealState
                    icon={FolderOpen}
                    title={translations[language].noStatements}
                    subtitle={translations[language].noStatementsDesc}
                    action={
                        <Button onClick={uploadStatementView} startIcon={<OpenInNew />}>
                            {translations[language].importStatement}
                        </Button>
                    }
                />
            </Section>
        );
    }

    return (
        <Section
            title={translations[language].statements}
            headers={
                <CreateButton
                    size="small"
                    endIcon={<ChevronRight />}
                    onClick={openUploadStatementDialog(account)}
                    key="create"
                >
                    {translations[language].addNew}
                </CreateButton>
            }
        >
            <TableBox>
                {statements.map(statement => (
                    <StatementBox key={statement.id}>
                        <DescriptionIcon />
                        <TextBox>
                            <Typography variant="subtitle2" noWrap={true} style={{ color: '#67656a' }}>
                                {statement.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                noWrap={true}
                                component="p"
                                style={{ color: '#67656a', fontStyle: 'italic' }}
                            >
                                {statement.date}
                            </Typography>
                        </TextBox>
                        <ActionsBox>
                            <IconButton
                                size="small"
                                style={{ marginTop: "3px", color: '#67656a', border: "1px solid #67656a" }}
                                onClick={filterTableToStatement(statement.id)}
                            >
                                <PaymentIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                style={{ marginTop: "3px", color: '#67656a', border: "1px solid #67656a" }}
                                onClick={openEditStatementDialog(statement)}
                            >
                                <EditIcon />
                            </IconButton>
                        </ActionsBox>
                    </StatementBox>
                ))}
            </TableBox>
        </Section>
    );
};

const openUploadStatementDialog = (account: Account) => () =>
    CapybaraDispatch(
        AppSlice.actions.setDialogPartial({ id: 'import', import: { page: 'file', rejections: [], account } })
    );
const openEditStatementDialog = (statement: Statement) => () =>
    CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: 'statement', statement }));
const filterTableToStatement = (statement: ID) => () =>
    CapybaraDispatch(AppSlice.actions.setAccountTableStatement(statement));

const CreateButton = styled(Button)({
    color: "#67656a",
});

const TableBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px',
    overflowY: 'auto',
});

const StatementBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    height: 40,
    '&:not(:last-child)': {
        marginBottom: 18,
    },
});

const DescriptionIcon = styled(Description)({
    color: '#67656a',
    background: '#080707',
    borderRadius: '50%',
    padding: 7,
    marginRight: 10,
    height: 32,
    width: 32,
});

const TextBox = styled('div')({
    flex: '1 1 0',
    width: 0,
    '& > *': {
        lineHeight: 1.2,
    },
});

const ActionsBox = styled('div')({
    display: 'flex',
    marginLeft: 30,
    '& > :not(:last-child)': {
        marginRight: 10,
    },
});

const PaymentIcon = styled(Payment)({
    padding: 2,
});

const EditIcon = styled(Edit)({
    padding: 2,
});
