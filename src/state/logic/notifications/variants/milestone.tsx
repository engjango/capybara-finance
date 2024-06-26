import { TrendingUp } from '@mui/icons-material';
import { isEqual, sum, values } from 'lodash';
import { Intents } from '../../../../styles/colours';
import { DataState, ensureNotificationExists, removeNotification, updateUserData } from '../../../data';
import { useFormatValue } from '../../../data/hooks';
import { StubUserID } from '../../../data/types';
import { DefaultDismissNotificationThunk, GreenNotificationText, NotificationContents } from '../shared';
import { MILESTONE_NOTIFICATION_ID, NotificationRuleDefinition } from '../types';
import { useLanguage } from '../../../../languages/languages-context';

const update = (data: DataState) => {
    const user = data.user.entities[StubUserID]!;

    // Balance milestones
    const balance = sum(
        values(data.account.entities)
            .flatMap(account => values(account!.balances))
            .map(balance => balance.localised[0])
    );

    if (balance <= 0) {
        removeNotification(data, MILESTONE_NOTIFICATION_ID);
        updateUserData(data, { milestone: 0 });
        return;
    }

    let milestone = Math.pow(10, Math.floor(Math.log10(balance)));
    if (balance >= milestone * 5) milestone *= 5;
    else if (balance >= milestone * 2) milestone *= 2;

    if (milestone > user.milestone && milestone >= 10000) {
        ensureNotificationExists(data, MILESTONE_NOTIFICATION_ID, '' + milestone);
        updateUserData(data, { milestone });
    } else if (milestone < user.milestone) {
        removeNotification(data, MILESTONE_NOTIFICATION_ID);
        updateUserData(data, { milestone });
    }
};

export const MilestoneNotificationDefinition: NotificationRuleDefinition = {
    id: MILESTONE_NOTIFICATION_ID,
    display: alert => {
        const dismiss = DefaultDismissNotificationThunk(alert.id);
        const { language, translations } = useLanguage();

        return {
            icon: TrendingUp,
            title: translations[language].newMilestoneReached,
            dismiss: dismiss,
            colour: Intents.success.main,
            children: <NewMilestoneContents value={Number(alert.contents)} />,
        };
    },
    maybeUpdateState: (previous, current) => {
        if (
            !isEqual(previous?.account, current.account) ||
            !isEqual(previous?.user.entities[StubUserID]!.milestone, current.user.entities[StubUserID]!.milestone)
        ) {
            update(current);
        }
    },
};

const NewMilestoneContents: React.FC<{ value: number }> = ({ value }) => {
    const format = useFormatValue({ separator: '', decimals: 0, end: 'k' });
    const { language, translations } = useLanguage();
    const formattedValue = format(value);
    const milestoneText = translations[language].newMilestoneReachedText.replace('{value}', formattedValue);
    return <NotificationContents>{milestoneText}</NotificationContents>;
};
