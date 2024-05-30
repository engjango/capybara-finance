import {
    Box,
    Button,
    Collapse,
    MenuItem,
    TextField,
    Typography,
    buttonClasses,
    unstable_createMuiStrictModeTheme as createMuiTheme,
    keyframes,
} from '@mui/material';
import { AppColours, Greys, Intents, WHITE } from './colours';
import styled from '@emotion/styled';
import { Description, Edit } from '@mui/icons-material';

// declare module "@mui/material/styles" {
//     interface Palette {
//         neutral: Palette["primary"];
//     }
//     interface PaletteOptions {
//         neutral: PaletteOptions["primary"];
//     }
// }

// // This is necessary to ensure that the DefaultTheme used by typescript fully inherits everything from Theme
// declare module "@mui/styles/defaultTheme" {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface DefaultTheme extends Theme {}
// }

export const APP_BACKGROUND_COLOUR = Greys[100];

export const CapybaraTheme = createMuiTheme({
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'outlined', color: 'inherit' },
                    style: {
                        borderColor: `rgba(0, 0, 0, 0.23)`,
                    },
                },
            ],
        },
    },
    palette: {
        app: {
            ...AppColours.summary,
            contrastText: 'white',
        },
        white: {
            main: WHITE,
        },
        background: {
            default: APP_BACKGROUND_COLOUR,
        },
        primary: {
            main: Intents.primary.main,
        },
        secondary: {
            main: Intents.danger.main,
        },
        // neutral: {
        //     main: Greys[700],
        // },
        success: {
            main: Intents.success.main,
        },
        warning: {
            main: Intents.warning.main,
        },
        error: {
            main: Intents.danger.main,
        },
    },
    spacing: 1,
    // This messes with the default MUI component styling - better to manage manually
    // shape: {
    //     borderRadius: 1,
    // },
});

export const getThemeTransition = CapybaraTheme.transitions.create;

export const DEFAULT_BORDER_RADIUS = 4;

declare module '@mui/material/styles' {
    interface Palette {
        app: Palette['primary'];
        white: Palette['primary'];
    }
    interface PaletteOptions {
        app: PaletteOptions['primary'];
        white: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        app: true;
        white: true;
    }
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsColorOverrides {
        app: true;
        white: true;
    }
}

/* ----- ACCOUNTS PAGE -------------------------------------------------------------------------------------*/

export const ACCOUNT_TABLE_LEFT_PADDING = 19;

export const AccountsTableIconSx = {
    height: 40,
    flex: '0 0 40px',
    margin: '30px 17px 30px 27px',
    borderRadius: '5px',
    '@media screen and (max-width: 1024px)': {
        height: "80px",
        width: "80px",
        margin: '16px 8px 8px 8px',
    }
};

export const AccountsTableInstitutionBox = styled('div')({
    flex: '3 0 100px',
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 0,
    '@media screen and (max-width: 1024px)': {
        height: "min-content",
        margin: '16px 8px 8px 8px',
        fontSize: '1.5rem',
        alignItems: 'center',
    }
});

export const AccountsTableAccountsBox = styled('div')({
    flex: '1 1 850px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: 16,
});


export const InstitutionInnerBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const IconBox = styled('div')({
    ...AccountsTableIconSx,
    color: '#fff',
});

export const AccountsBox = styled(AccountsTableAccountsBox)({ 
    flexDirection: 'row',
 });

 export const AccountInnerBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: ACCOUNT_TABLE_LEFT_PADDING - 16,
    flexGrow: 1,
    '@media screen and (max-width: 1280px)': {
        paddingLeft: ACCOUNT_TABLE_LEFT_PADDING,
    },
    '@media screen and (max-width: 768px)': {
        paddingLeft: ACCOUNT_TABLE_LEFT_PADDING,
    }
});

export const ActionsBox = styled('div')({
    paddingLeft: 10,
});

export const ActionMenuItem = styled(MenuItem)({
    width: 250,
    height: 48,
});

export const ContainerSx = {
    //height: '64px',
    borderRadius: '10px',
    textTransform: 'inherit' as const,
    margin: '4px',
    flexDirection: 'row',
    padding: '8px',
    alignSelf: 'flex-end',
    border: '1px solid #242020',
    width: '100%',

    '&:hover': {
        border: '1px solid #67656a',
        //backgroundColor: "#080707",
    },
    '&:last-child': {
        marginBottom: 0,
    },

    '@media screen and (max-width: 768px)': {
        alignSelf: 'center',
        flexDirection: 'column',
        width: '100%',
        height: 'min-content',
        background: 'linear-gradient(180deg, #242020, #080707)',
    },
};

export const AccountNameContainerBox = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '160px',
    marginRight: '30px',
    '& > *': {
        width: '100%',
    },
    '@media screen and (max-width: 768px)': {
        width: '100%',
        margin: 0,
        marginBottom: '8px',
        textAlign: 'center',
    },
});

export const AccountSubContainer = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: 'black',
    '@media screen and (max-width: 768px)': {
        display: 'grid',
        flexDirection: 'column',
        height: 'min-content',
    },
});

export const SubValueTypography = styled(Typography)({
    color: '#67656a',
});

export const ChartContainerBox = styled('div')({
    height: '50px',
    width: '230px',    
    '@media screen and (max-width: 768px)': {
        width: '100%',
        margin: '8px',
        padding: '4px',
        background: '#080707',
    },
});

export const AccountValueContainerBox = styled('div')({
    marginLeft: '30px',
    width: '140px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: '10px',
    overflow: 'hidden',
    '@media screen and (max-width: 768px)': {
        margin: 0,
        width: '100%',
        alignItems: 'center',
        marginBottom: '16px',
    },
});

export const AccountValueSummaryBox = styled('div')({
    display: 'flex',
    width: '100%',
    '@media screen and (max-width: 768px)': {
        justifyContent: 'center',
    },
});

export const AccountIconSx = {
    color: '#67656a',
    backgroundColor: Greys[300],
    height: '44px',
    width: '44px',
    padding: '8px',
    borderRadius: '50%',
};

export const DescriptionAccountIcon = styled(Description)(AccountIconSx);

export const EditAccountIcon = styled(Edit)(AccountIconSx);

export const AccountUpdateContainerBox = styled('div')({
    width: '144px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
    '@media screen and (max-width: 768px)': {
        alignItems: 'center',
        textAlign: 'center',
    },
});

export const AccountUpdateActionsBox = styled('div')({
    display: 'flex',
    alignItems: 'flex-end',

    // To prevent accidental clicks of the outer button
    margin: '-2px',
    padding: '2px',

    '& > button': {
        minWidth: '24px',
        width: '24px',
        height: '24px',
        marginRight: '8px',
        padding: "8px",

        '&:hover': {
            backgroundColor: '#080707',
        },

        [`& .${buttonClasses.startIcon}`]: {
            margin: 0,
        },
    },

    '@media screen and (max-width: 768px)': {
        '& > button': {
            minWidth: '34px',
            width: '34px',
            height: '34px',
            marginRight: '8px',
            padding: "8px",
    
            '&:hover': {
                backgroundColor: '#080707',
            },
    
            [`& .${buttonClasses.startIcon}`]: {
                margin: 0,
            },
        },
    },
});

/* ----- SUMMARY PAGE --------------------------------------------------------------------------------------*/

export const ContainerBox = styled('div')({
    display: 'flex',
    '@media screen and (max-width: 1024px)': {
        display: 'grid',
    },
});

export const SummaryColumnBox = styled('div')({
    flexGrow: 1,
    //marginRight: '16px',
});

export const SummaryRowBox = styled('div')({
    flexGrow: 1,
    width: '38.2%',
    '@media screen and (max-width: 1024px)': {
        width: '100%',
        paddingRight: '16px',
    },
});

export const SummaryContainer = styled('div')({
    display: 'flex',
    width: '100%',
    height: '100%',
    '@media screen and (max-width: 1024px)': {
        display: 'grid',
    },
});

export const NotificationColumnSx = {
    flexShrink: 0,
    alignSelf: 'flex-start',

    '& > div': {
        padding: 0,
        minHeight: 0,
        display: 'flex',
    },
};

/* ----- NOTIFICATIONS  ------------------------------------------------------------------------------------*/

export const NotificationsPopBox = styled(Box)({
    overflowY: 'auto',
    width: '100%',
    background: '#242020',
});

export const ContainerCollapse = styled(Collapse)({
    marginBottom: 20,
    '&:first-of-type': { marginTop: 20 },
});

export const NotificationBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '3px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    padding: '0 17px',
    fontSize: 20,
});

export const ContentsBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    margin: '9px 0 7px 0',
});

export const BackdropBox = styled('div')({
    position: 'absolute',
    width: '240px',
    height: '240px',
    left: '-242.71px',
    top: '-97.83px',
    opacity: 0.1,
    borderRadius: '40px',
    transform: 'rotate(20deg)',
    transformOrigin: 'bottom left',
});

export const ButtonContainerBox = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    margin: 5,
    borderRadius: '8px',
});

export const SpacedButton = styled(Button)({
    marginLeft: 10,
});

/* ----- NAVBAR --------------------------------------------------------------------------------------------*/

/* ----- PAGE ----------------------------------------------------------------------------------------------*/

export const PageContainerBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1,
    height: '100%',
    width: '100%',
    background: 'rgba(18,14,22,1)',
    padding: '16px',
    maxWidth: '1280px',
    alignSelf: 'center',
    marginTop: '3px',
    '@media screen and (max-width: 1024px)': {
        padding: '16px',
    },
    '@media screen and (max-width: 768px)': {
        padding: '8px',
    },
});

export const TitleBox = styled('div')({
    height: '144px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '36px',
});

export const TitleButtonsBox = styled('div')({
    '& > button': {
        color: '#fff',
        borderRadius: '50%',
    },
});

export const underlineExpand = keyframes`
    0% {
        width: 0;
        opacity: 0;
    }
    100% {
        width: 97px;
        opacity: 1;
    }
`;

export const AnimatedUnderline = styled('div')`
    width: 0;
    height: 5px;
    border-radius: 3px;
    background: linear-gradient(to right, #9f55ff, #7000ff);
    box-shadow: 0px 0px 12px #9f55ff;
    animation: ${underlineExpand} 1.7s forwards;
    transform: translateY(-8px);
`;

/* ----- VIEW ----------------------------------------------------------------------------------------------*/

export const AppContainerBox = styled('div')({
    display: 'flex',
    color: '#fff',
    flexDirection: 'column',
    background: 'black',
    backgroundColor: 'black',
    '& *:focus': {
        outline: 'none',
    },
    overflow: 'hidden',
});

export const FootNoteContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1280px',
    alignSelf: 'center',
    background: 'linear-gradient(0deg, rgba(159,85,255,0.7), rgba(112,0,255,0.7), rgba(18,14,22,1))',
    paddingTop: '94px',
    zIndex: 0,
});

export const FootNoteTopLine = styled('div')({
    marginTop: '36px',
    alignSelf: 'center',
    height: '1px',
    width: '100%',
    borderTop: '1px solid #242020',
});

export const FootNote = styled('div')({
    width: '100%',
    fontSize: '0.8rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff',
    marginTop: '16px',
});

export const SocialIconsContainer = styled('div')({
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
});

export const SocialIcon = styled('a')({
    color: '#fff',
    textDecoration: 'none',
    padding: '8px',
    '&:hover': {
        opacity: 0.8,
    },
});

export const FooterImage = styled('img')({
    transform: 'rotate(180deg)',
    display: 'block',
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: 'min-content',
});

/* ----- OTHERS -------------------------------------------------------------------------------------*/

export const NonIdealContainerBox = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: 'auto',
    padding: '16px',
    color: '#fff',
});

export const NonIdealIconSx = {
    margin: '16px',
    height: '50px',
    width: '50px',
};

export const NonIdealSubtitleTypography = styled(Typography)({
    color: '#fff',
    opacity: 0.8,
    maxWidth: '320px',
    textAlign: 'center',
    margin: '5px 0 10px 0',
});

export const CustomTextField = styled(TextField)({
    '& label': {
        color: '#fff',
    },
    '& label.Mui-focused': {
        color: '#fff',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#fff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#67656a',
        },
        '&:hover fieldset': {
            borderColor: '#fff',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#fff',
        },
    },
    '& .MuiInputBase-input': {
        color: '#fff',
    },
    '& .MuiInputBase-input::placeholder': {
        color: '#67656a',
        opacity: 1,
    },
    '& .MuiInputBase-root': {
        backgroundColor: '#242020',
    },
});
