import { CloudOff } from "@mui/icons-material";
import { CapybaraDispatch } from "../../..";
import { Intents } from "../../../../styles/colours";
import { AppSlice } from "../../../app";
import { NotificationContents } from "../shared";
import { DROPBOX_NOTIFICATION_ID, NotificationRuleDefinition } from "../types";
import { useLanguage } from "../../../../languages/languages-context";

export const DropboxNotificationDefinition: NotificationRuleDefinition = {
    id: DROPBOX_NOTIFICATION_ID,
    display: () => {
        const {language, translations} = useLanguage();
        return ({
            icon: CloudOff,
            title: translations[language].dropboxSyncFailed,
            colour: Intents.danger.main,
            buttons: [{ text: translations[language].manageConfig, onClick: goToSyncConfig }],
            children: (
                <NotificationContents>
                    {translations[language].dropboxSyncFailedTip}                    
                </NotificationContents>
            ),
        });
    },
};

const goToSyncConfig = () => CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: "settings", settings: "storage" }));
