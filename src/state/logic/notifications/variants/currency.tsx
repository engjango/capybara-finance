import { CloudOff } from '@mui/icons-material';
import { CapybaraDispatch } from '../../..';
import { Intents } from '../../../../styles/colours';
import { AppSlice } from '../../../app';
import { NotificationContents } from '../shared';
import { CURRENCY_NOTIFICATION_ID, NotificationRuleDefinition } from '../types';
import { useLanguage } from '../../../../languages/languages-context';

export const CurrencyNotificationDefinition: NotificationRuleDefinition = {
    id: CURRENCY_NOTIFICATION_ID,
    display: () => {
        const { language, translations } = useLanguage();
        return {
            icon: CloudOff,
            title: translations[language].currencySyncFailed,
            colour: Intents.danger.main,
            buttons: [{ text: translations[language].manageConfig, onClick: goToSyncConfig }],
            children: <NotificationContents>{translations[language].currencySyncFailedTip}</NotificationContents>,
        };
    },
};

const goToSyncConfig = () =>
    CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: 'settings', settings: 'currency' }));
