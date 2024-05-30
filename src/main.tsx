import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app';
import { setPopupAlert } from './app/popups';
import { initialiseAndGetDBConnection } from './state/logic/startup';
import { LanguageProvider, useLanguage } from './languages/languages-context';
import './styles/global.scss';
{
    /*import { ThemeProvider } from './styles/theme-context';*/
}

const Root: React.FC = () => (
    <LanguageProvider>
        {/*<ThemeProvider>*/}
        <App />
        {/*</ThemeProvider>*/}
    </LanguageProvider>
);

initialiseAndGetDBConnection().then(() => {
    const root = createRoot(document.getElementById('root')!);
    root.render(<Root />);
});

if ('serviceWorker' in navigator) {
    // && !/localhost/.test(window.location)) {
    const { language, translations } = useLanguage();
    const updateSW = registerSW({
        onNeedRefresh: () =>
            setPopupAlert({
                message: translations[language].newVersionAvailable,
                severity: 'info',
                duration: null,
                action: {
                    name: translations[language].refresh,
                    callback: () => updateSW(),
                },
            }),
        onOfflineReady: () =>
            setPopupAlert({
                message: translations[language].appReadyForOfflineUse,
                severity: 'info',
                duration: null,
            }),
    });
}
