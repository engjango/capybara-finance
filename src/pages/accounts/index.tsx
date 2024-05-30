import { Page } from "../../components/layout";
import { useLanguage } from "../../languages/languages-context";
import { AccountsPageSummary } from "./summary";
import { AccountsTable } from "./table";

export const AccountsPage: React.FC = () => {
    const {language, translations} = useLanguage();
    return (
        <Page title={translations[language].accounts}>
            <AccountsPageSummary />
            <div style={{height: "36px", width: "36px"}}/>
            <AccountsTable />
        </Page>
    )
};
