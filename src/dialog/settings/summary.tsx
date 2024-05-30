import styled from "@emotion/styled";
import { AccountBalanceWalletTwoTone, PaymentTwoTone, ShoppingBasketTwoTone } from "@mui/icons-material";
import { Link, Typography } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { shallowEqual } from "react-redux";
import { zipObject } from "../../shared/data";
import { CapybaraDispatch } from "../../state";
import { AppSlice } from "../../state/app";
import { useUserData } from "../../state/data/hooks";
import { useSelector } from "../../state/shared/hooks";
import { parseDate } from "../../state/shared/values";
import { AppColours } from "../../styles/colours";
import { SettingsDialogContents, SettingsDialogDivider, SettingsDialogPage } from "./shared";
import { useLanguage } from "../../languages/languages-context";

const StoredDataEntryBox = styled("div")({
    display: "flex",
    padding: 10,

    "& > svg": {
        marginTop: 3,
    },
});

const fields = ["account", "institution", "category", "currency", "rule", "transaction", "statement"] as const;

export const DialogSummaryContents: React.FC = () => {
    const start = parseDate(useUserData((user) => user.start)).toLocaleString(DateTime.DATE_FULL);
    const isDemo = useUserData((user) => user.isDemo);
    const {language, translations} = useLanguage();

    const counts = useSelector(
        (state) =>
            zipObject(
                fields,
                fields.map((f) => state.data[f].ids.length)
            ),
        shallowEqual
    );

    const intro = isDemo ? (
        <>
            {translations[language].isDemoDesc1}{' '}{start}{'. '}{translations[language].isDemoDesc2}{' '}
            <Link onClick={goToImportDataPage} href="#" underline="hover">
                {translations[language].importAndWipeData}
            </Link>
            {'. '}{translations[language].isDemoDesc3}{':'}
        </>
    ) : (
        `${translations[language].isDemoDesc4} ${start}. ${translations[language].isDemoDesc5}:`
    );

    return (
        <SettingsDialogPage title={isDemo ? translations[language].demoDataSummary : translations[language].dataSummary}>
            <Typography variant="body2">{intro}</Typography>
            <SettingsDialogDivider />
            <SettingsDialogContents>
                <StoredDataEntryBox>
                    <AccountBalanceWalletTwoTone style={{ color: AppColours.accounts.main }} />
                    <Table
                        points={[
                            [translations[language].accounts, counts.account],
                            [translations[language].institutions, counts.institution - 1],
                            [translations[language].statements, counts.statement - 1],
                        ]}
                    />
                </StoredDataEntryBox>
                <StoredDataEntryBox>
                    <PaymentTwoTone style={{ color: AppColours.transactions.main }} />
                    <Table
                        points={[
                            [translations[language].transactions, counts.transaction],
                            [translations[language].rules, counts.rule],
                            [translations[language].currencies, counts.currency],
                        ]}
                    />
                </StoredDataEntryBox>
                <StoredDataEntryBox>
                    <ShoppingBasketTwoTone style={{ color: AppColours.categories.main }} />
                    <Table points={[[translations[language].categories, counts.category - 2]]} />
                </StoredDataEntryBox>
            </SettingsDialogContents>
        </SettingsDialogPage>
    );
};

const goToImportDataPage = () => CapybaraDispatch(AppSlice.actions.setDialogPartial({ settings: "import" }));

const TableContainerBox = styled("div")({
    marginLeft: 20,
    marginRight: 10,
    marginTop: 3,
    flexGrow: 1,

    display: "flex",
    flexDirection: "column",
});
const TableRowBox = styled("div")({
    display: "flex",
    justifyContent: "space-between",
});

export const Table: React.FC<{ points: [string, number][] }> = ({ points }) => {
    return (
        <TableContainerBox>
            {points.map(([label, value], idx) => (
                <TableRowBox key={idx}>
                    <Typography variant={idx ? "body2" : "body1"} sx={idx ? undefined : { fontWeight: 500 }}>
                        {label}
                    </Typography>
                    <Typography variant={idx ? "body2" : "body1"} sx={idx ? undefined : { fontWeight: 500 }}>
                        {value}
                    </Typography>
                </TableRowBox>
            ))}
        </TableContainerBox>
    );
};
