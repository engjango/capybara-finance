import styled from "@emotion/styled";
import { Box, BoxProps } from "@mui/system";
import React from "react";
import { stopEventPropagation } from "../../shared/events";
import { Greys } from "../../styles/colours";

/**
 * Dialog Layout Components
 */
export const DialogMain = styled("div")({    
    display: "flex",
    backgroundColor: "#242020",
    minHeight: 0,
    flexGrow: 1,    
    height: "100%",
    "@media screen and (max-width: 768px)": {        
        display: "grid",
        alignContent: "flex-start",
    }
});

export const DIALOG_OPTIONS_WIDTH = 312;
export const DialogOptions = styled("div")({
    display: "flex",
    flexDirection: "column",
    width: DIALOG_OPTIONS_WIDTH,
    flexShrink: 0,
    background: "linear-gradient(-90deg, #242020, #080707)",    
    "@media screen and (max-width: 768px)": {
        maxHeight: "230px",      
        width: "100%",
        background: "linear-gradient(0deg, #080707, #242020, #242020)",
        borderRight: "none",
    }
});

const DialogContentsBox = styled(Box)({
    color: "#67656a",
    display: "flex",
    justifyContent: "stretch",
    flexDirection: "column",
    margin: "8px 0 8px 0",
    backgroundColor: "#242020",
    borderRadius: "5px",
    flexGrow: 1,
    overflow: "hidden",
    //border: "1px solid yellow",
    textAlignLast: "center",
    height: "100%",
    "@media screen and (max-width: 768px)": {
        flexGrow: 1,
        height: 'auto'
    }
    
});

export const DialogContents: React.FC<BoxProps> = (props) => (
    <DialogContentsBox onClick={stopEventPropagation} {...props} />
);
