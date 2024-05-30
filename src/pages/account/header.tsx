import styled from "@emotion/styled";
import { Edit, OpenInNew } from "@mui/icons-material";
import { IconButton, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { max, min } from "lodash";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { getInstitutionIcon } from "../../components/display/ObjectDisplay";
import { Section } from "../../components/layout";
import { CapybaraDispatch } from "../../state";
import { AppSlice } from "../../state/app";
import { useAccountPageAccount } from "../../state/app/hooks";
import { useInstitutionByID } from "../../state/data/hooks";
import { AccountTypeMap } from "../../state/data/types";
import { parseDate } from "../../state/shared/values";
import { Greys } from "../../styles/colours";
import { useLanguage } from "../../languages/languages-context";

export const AccountPageHeader: React.FC = () => {
    const account = useAccountPageAccount();
    const institution = useInstitutionByID(account.institution);
    const {language, translations} = useLanguage();

    const openEditView = useCallback(
        () => CapybaraDispatch(AppSlice.actions.setDialogPartial({ id: "account", account })),
        [account]
    );

    const getTranslatedType = (title: string) => {
        switch (title) {
            case 'Asset':
                return translations[language].accountTypeAsset;
            case 'Investment Account':
                return translations[language].accountTypeInvestment;
            case 'Transaction Account':
                return translations[language].accountTypeTransaction;
            default:
                return title;
        }
    };

    return (
        <Section>            
            <ContainerBox>
                <ColourBox sx={{ backgroundColor: institution.colour }} />
                <InstitutionBox>
                    <Typography variant="h4" noWrap={true}>
                        {institution.name}
                    </Typography>
                    {getInstitutionIcon(institution, IconSx)}
                </InstitutionBox>
                <AccountBox>
                    <AccountMainBox>
                        <div>
                            <Typography variant="h4">{account.name}</Typography>
                            <AccountTypeTypography variant="subtitle2">
                                {getTranslatedType(AccountTypeMap[account.category].name)}
                            </AccountTypeTypography>
                        </div>
                        <div style={{color: "#fff", border: "1px solid #fff", borderRadius: "50%"}}>
                            <IconButton onClick={openEditView} size="large">
                                <Edit htmlColor="#fff"/>
                            </IconButton>
                        </div>
                    </AccountMainBox>
                    <AccountSecondaryBox>
                        <div>
                            <Typography variant="h6">{translations[language].openDate}</Typography>
                            <Typography variant="body1">
                                {parseDate(min([account.openDate, account.firstTransactionDate])!).toLocaleString(
                                    DateTime.DATE_FULL
                                )}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h6">
                                {account.isInactive ? translations[language].inactiveSince : translations[language].lastUpdate}
                            </Typography>
                            <Typography variant="body1">
                                {parseDate(max([account.lastUpdate, account.lastTransactionDate])!).toLocaleString(
                                    DateTime.DATE_FULL
                                )}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h6">{translations[language].website}</Typography>
                            {account.website ? (
                                <AccountLink href={account.website} target="_blank" underline="hover">
                                    <OpenInNew fontSize="small" />
                                    <Typography variant="body1" noWrap={true}>
                                        {getDomainFromURL(account.website)}
                                    </Typography>
                                </AccountLink>
                            ) : (
                                <MissingTypography variant="body1" noWrap={true}>
                                    {translations[language].noWebsite}
                                </MissingTypography>
                            )}
                        </div>
                    </AccountSecondaryBox>
                </AccountBox>
            </ContainerBox>
        </Section>
    );
};

const DomainRegex = /(https?:\/\/)?(www\.)?([^/]+)/;

const getDomainFromURL = (url: string) => {
    const match = url.match(DomainRegex);
    return (match && match[3]) || url;
};

const ContainerBox = styled("div")({
    display: "flex",
    position: "relative",
    alignItems: "stretch",
    margin: -20,
    paddingBottom: "32px",
    overflow: "hidden",   
    "@media screen and (max-width: 1024px)": {
        display: "grid",
        justifyItems: "center",
    }
});

const ColourBox = styled(Box)({
    position: "absolute",
    opacity: 0.2,
    transform: "rotate(-60deg)",
    top: -80,
    left: -45,
    height: 260,
    width: 310,
    borderRadius: "50px",
});

const InstitutionBox = styled("div")({ flexGrow: 1, padding: "25px 30px" });
const IconSx = {
    marginTop: 15,
    width: 80,
    height: 80,
    borderRadius: "5px",
};

const AccountBox = styled("div")({ flexGrow: 3 });
const AccountMainBox = styled("div")({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "25px 25px 25px 0",    
    "& > div": { 
        marginRight: "8px",
    },
});

const AccountTypeTypography = styled(Typography)({ color: Greys[600] });
const AccountSecondaryBox = styled("div")({
    display: "flex",
    "& > div": { 
        width: 220,
    },
    "@media screen and (max-width: 1024px)": {        
        "& > div": { 
            padding: "8px",
            width: "max-content",
        },
    },
    "@media screen and (max-width: 768px)": {
        display: "grid",
        "& > div": { 
            //placeSelf: "center",
            width: "max-content",
        },
    }
});

const AccountLink = styled(Link)({
    width: "100%",
    display: "flex",
    alignItems: "center",

    "& > svg": { marginRight: 10 },
});
const MissingTypography = styled(Typography)({ color: Greys[500], fontStyle: "italic" });
