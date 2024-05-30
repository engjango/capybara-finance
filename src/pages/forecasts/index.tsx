import { Page } from '../../components/layout';
import { useLanguage } from '../../languages/languages-context';
import { ForecastPageDebtCalculator } from './debt';
import { ForecastPageNetWorthCalculator } from './net';
import { ForecastPagePensionCalculator } from './pension';
import { ForecastPageRetirementCalculator } from './retirement';

export const ForecastPage: React.FC = () => {
    const { language, translations } = useLanguage();
    return (
        <Page title={translations[language].forecasts}>
            <ForecastPageNetWorthCalculator />
            <div style={{ height: '36px', width: '36px' }} />
            <ForecastPageDebtCalculator />
            <div style={{ height: '36px', width: '36px' }} />
            <ForecastPagePensionCalculator />
            <div style={{ height: '36px', width: '36px' }} />
            <ForecastPageRetirementCalculator />
        </Page>
    );
};
