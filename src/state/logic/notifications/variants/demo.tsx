import { ListAlt } from '@mui/icons-material';
import { CapybaraDispatch } from '../../..';
import { createAndDownloadFile } from '../../../../shared/data';
import { Intents } from '../../../../styles/colours';
import { AppSlice } from '../../../app';
import { Statement } from '../../../data';
import { NotificationContents } from '../shared';
import { DEMO_NOTIFICATION_ID, NotificationRuleDefinition } from '../types';
import { useLanguage } from '../../../../languages/languages-context';

export const DemoNotificationDefinition: NotificationRuleDefinition = {
    id: DEMO_NOTIFICATION_ID,
    display: ({ contents: file }) => {
        const parsedFile = JSON.parse(file) as Statement;
        const { language, translations } = useLanguage();

        return {
            icon: ListAlt,
            title: translations[language].demoData,
            colour: Intents.primary.main,
            buttons: [
                { text: translations[language].exampleStatement, onClick: () => downloadExampleStatement(parsedFile) },
                { text: translations[language].manageData, onClick: manageData },
            ],
            children: <NotificationContents>{translations[language].demoDataText}</NotificationContents>,
        };
    },
};

const manageData = () => {
    CapybaraDispatch(
        AppSlice.actions.setDialogPartial({
            id: 'settings',
            settings: 'import',
        })
    );
};

const downloadExampleStatement = (statement: Statement) => () =>
    createAndDownloadFile(statement.name, statement.contents);
