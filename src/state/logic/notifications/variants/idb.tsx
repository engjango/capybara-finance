import { FileDownloadOff } from "@mui/icons-material";
import { Intents } from "../../../../styles/colours";
import { ensureNotificationExists, removeNotification } from "../../../data";
import { NotificationContents } from "../shared";
import { IDB_NOTIFICATION_ID, NotificationRuleDefinition } from "../types";
import { useLanguage } from "../../../../languages/languages-context";

let iDBConnectionExists = false;
export const setIDBConnectionExists = (value: boolean) => (iDBConnectionExists = value);

export const IDBNotificationDefinition: NotificationRuleDefinition = {
    id: IDB_NOTIFICATION_ID,
    display: () => {
        const {language, translations} = useLanguage();
        return ({
            icon: FileDownloadOff,
            title: translations[language].dataSaveFailed,
            colour: Intents.danger.main,
            children: (
                <NotificationContents>
                    {translations[language].dataSaveFailedTip}
                </NotificationContents>
            ),
        });
    },
    maybeUpdateState: (_, current) => {
        if (iDBConnectionExists) removeNotification(current, IDB_NOTIFICATION_ID);
        else ensureNotificationExists(current, IDB_NOTIFICATION_ID, "");
    },
};
