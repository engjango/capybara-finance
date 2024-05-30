import { CheckCircle } from "@mui/icons-material";
import { Button, Card, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { CapybaraDispatch } from "../../state";
import { DataSlice } from "../../state/data";
import { useUserData } from "../../state/data/hooks";
import { redirectToDropboxAuthURI } from "../../state/logic/dropbox";
import { Greys, Intents } from "../../styles/colours";
import DropboxLogo from "./dropbox.svg";
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from "./shared";
import { useLanguage } from "../../languages/languages-context";

export const DialogStorageContents: React.FC = () => {
    const config = useUserData((user) => user.dropbox);
    const {language, translations} = useLanguage();

    return (
        <SettingsDialogPage title={translations[language].cloudDataStorage}>
            <Typography variant="body2">
                {translations[language].cloudDataStorageDesc}                
            </Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        margin: "10px 50px",
                        padding: "20px 0 40px 0",
                        flexShrink: 0,
                        "& > img:first-of-type": {
                            width: 150,
                            padding: "16px 0",
                        },
                        "& > button": {
                            marginTop: 10,
                        },
                    }}
                >
                    <img src={DropboxLogo} />
                    {config === "loading" ? (
                        <CircularProgress />
                    ) : config ? (
                        <>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="subtitle2" marginRight={10}>
                                    {config.name}
                                </Typography>
                                <CheckCircle htmlColor={Intents.success.light} fontSize="small" />
                            </Box>
                            <Typography variant="caption" color={Greys[700]}>
                                {config.email}
                            </Typography>
                            <Button onClick={removeDropboxSync}>Remove</Button>
                        </>
                    ) : (
                        <Button size="large" onClick={redirectToDropboxAuthURI} variant="outlined">
                            {translations[language].linkAccount}
                        </Button>
                    )}
                </Card>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const removeDropboxSync = () => CapybaraDispatch(DataSlice.actions.removeDropoxSync());
