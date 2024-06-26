import { FilterList } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";
import { upperFirst } from "lodash";
import React, { ReactNode } from "react";
import { withSuppressEvent } from "../../../shared/events";
import { IconType } from "../../../shared/types";
import { Intents } from "../../../styles/colours";
import { getThemeTransition } from "../../../styles/theme";

export const FilterIcon: React.FC<{
    ButtonProps?: IconButtonProps;
    badgeContent: ReactNode;
    margin?: "left" | "right" | "none";
    Icon?: IconType;
    onRightClick?: () => void;
}> = ({ ButtonProps = {}, badgeContent, margin = "left", Icon = FilterList, onRightClick }) => (
    <IconButton
        size="small"
        {...ButtonProps}
        style={{
            padding: 3,
            border: "1px solid " + (badgeContent ? Intents.primary.main : "transparent"),
            transition: getThemeTransition("border-color"),
            ...ButtonProps.style,
            ...(margin !== "none" ? { ["margin" + upperFirst(margin)]: 10 } : undefined),
            color: "#fff",
        }}
        onContextMenu={onRightClick && withSuppressEvent<HTMLButtonElement>(onRightClick)}
    >
        <Icon fontSize="small" color={badgeContent ? "primary" : "disabled"} style={{color: "#fff"}} />
    </IconButton>
);
