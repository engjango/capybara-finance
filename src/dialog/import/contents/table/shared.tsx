import { buttonClasses } from "@mui/material";
import { Greys } from "../../../../styles/colours";

export const DIALOG_IMPORT_TABLE_HEADER_STYLES = {
    color: "#fff",
    background: "#67656a",
    borderBottom: "2px solid #67656a",

    position: "sticky",
    top: 0,
    zIndex: 2,
} as const;

export const DIALOG_IMPORT_TABLE_ROW_STYLES = {
    borderTop: "1px solid " + Greys[300],
} as const;

export const DIALOG_IMPORT_TABLE_ICON_BUTTON_STYLES = {
    padding: 0,

    [`& .${buttonClasses.endIcon}`]: {
        marginLeft: "-1px !important",
    },
} as const;
