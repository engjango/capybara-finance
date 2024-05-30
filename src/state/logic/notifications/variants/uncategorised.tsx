import { Payment } from '@mui/icons-material';
import { isEqual } from 'lodash';
import { CapybaraDispatch } from '../../..';
import { Intents } from '../../../../styles/colours';
import { AppSlice, DefaultPages } from '../../../app';
import {
    DataState,
    PLACEHOLDER_CATEGORY_ID,
    ensureNotificationExists,
    removeNotification,
    updateUserData,
} from '../../../data';
import { StubUserID } from '../../../data/types';
import { DefaultDismissNotificationThunk, NotificationContents, OrangeNotificationText } from '../shared';
import { NotificationRuleDefinition, UNCATEGORISED_NOTIFICATION_ID } from '../types';
import { useLanguage } from '../../../../languages/languages-context';

const update = (data: DataState) => {
    const { uncategorisedTransactionsAlerted } = data.user.entities[StubUserID]!;

    const uncategorised = data.transaction.ids.filter(id => {
        const tx = data.transaction.entities[id]!;
        return tx.category === PLACEHOLDER_CATEGORY_ID && tx.value;
    }).length;

    const notification = data.notification.entities[UNCATEGORISED_NOTIFICATION_ID];

    if (uncategorised === 0) {
        updateUserData(data, { uncategorisedTransactionsAlerted: false });
        removeNotification(data, UNCATEGORISED_NOTIFICATION_ID);
    } else if (!uncategorisedTransactionsAlerted || notification) {
        updateUserData(data, { uncategorisedTransactionsAlerted: true });
        ensureNotificationExists(data, UNCATEGORISED_NOTIFICATION_ID, '' + uncategorised);
    }
};

export const UncategorisedNotificationDefinition: NotificationRuleDefinition = {
    id: UNCATEGORISED_NOTIFICATION_ID,
    display: alert => {
        const { language, translations } = useLanguage();
        const uncategorisedText = translations[language].uncategorizedTransactionsText.replace(
            '{value}',
            alert.contents
        );
        return {
            icon: Payment,
            title: translations[language].uncategorizedTransactions,
            dismiss: DefaultDismissNotificationThunk(alert.id),
            colour: Intents.warning.main,
            buttons: [{ text: translations[language].viewTransactions, onClick: viewUncategorisedTransactions }],
            children: <NotificationContents>{uncategorisedText}</NotificationContents>,
        };
    },
    maybeUpdateState: (previous, current) => {
        if (!isEqual(previous?.category, current.category)) update(current);
    },
};

const viewUncategorisedTransactions = () => {
    CapybaraDispatch(
        AppSlice.actions.setPageState({
            ...DefaultPages.transactions,
            table: {
                filters: {
                    ...DefaultPages.transactions.table.filters,
                    category: [PLACEHOLDER_CATEGORY_ID],
                },
                state: DefaultPages.transactions.table.state,
            },
        })
    );
};
