import { styled, Typography } from "@mui/material";
import { CapybaraDispatch } from "../..";
import { FCWithChildren } from "../../../shared/types";
import { Intents } from "../../../styles/colours";
import { DataSlice } from "../../data";

export const DefaultDismissNotificationThunk = (id: string) => () =>
    CapybaraDispatch(DataSlice.actions.deleteNotification(id));

export const GreenNotificationText = styled("strong")({ color: Intents.success.main });

export const OrangeNotificationText = styled("strong")({ color: Intents.warning.main });

export const NotificationContents: FCWithChildren = ({ children }) => (
    <Typography variant="body2" component="span" style={{color: '#67656a', fontWeight: "400"}}>
        {children}
    </Typography>
);
