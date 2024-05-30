import { Button, Typography } from "@mui/material";
import { CapybaraDispatch } from "../../state";
import { DataSlice } from "../../state/data";
import { useUserData } from "../../state/data/hooks";
import { Greys } from "../../styles/colours";
import { EditValueContainer } from "../shared";
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from "./shared";
import { useLanguage } from "../../languages/languages-context";

const ActionSx = { textAlign: "center", width: 100, height: 61 } as const;
const ItalicsSx = { fontStyle: "italic", color: "#67656a", textAlignLast: "left" } as const;

export const DialogDebugContents: React.FC = () => {
    const generation = useUserData((user) => user.generation);
    const {language, translations} = useLanguage();

    return (
        <SettingsDialogPage title={translations[language].debug}>
            <Typography variant="body2">
                {translations[language].debugDesc}
            </Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <EditValueContainer
                    label={
                        <Button variant="outlined" disabled={false}>
                            {generation}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                    {translations[language].schemeVersion}
                    </Typography>
                </EditValueContainer>
                <EditValueContainer
                    label={
                        <Button sx={ActionSx} variant="outlined" onClick={refreshCaches}>
                            {translations[language].refreshCaches}
                        </Button>
                    }
                >
                    <Typography variant="body2" sx={ItalicsSx}>
                        {translations[language].refreshCachesDesc}
                    </Typography>
                </EditValueContainer>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const refreshCaches = () => CapybaraDispatch(DataSlice.actions.refreshCaches());
