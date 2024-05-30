import { Page } from '../../components/layout';
import { useLanguage } from '../../languages/languages-context';
import { CategoriesPageSummary } from './summary';
import { CategoryTable } from './table';

export const CategoriesPage: React.FC = () => {
    const { language, translations } = useLanguage();
    return (
        <Page title={ translations[language].categories }>
            <CategoriesPageSummary />
            <div style={{height: "36px", width: "36px"}}/>
            <CategoryTable />
        </Page>
    );
};
