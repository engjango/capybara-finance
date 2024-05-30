import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { noop, omit } from 'lodash-es';
import React from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Provider } from 'react-redux';
import { CapybaraDialog } from '../dialog';
import { FCWithChildren } from '../shared/types';
import { CapybaraStore } from '../state';
import { handleStatementFileUpload } from '../state/logic/statement';
import { CapybaraTheme } from '../styles/theme';
import { PageErrorBoundary } from './error';
import { PopupDisplay } from './popups';
import { CapybaraTutorial } from './tutorial';

export const FileHandlerContext = React.createContext<{
    openFileDialog: () => void;
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    isDragActive: boolean;
    dropzoneRef: React.RefObject<HTMLElement> | null;
}>({
    openFileDialog: noop,
    acceptedFiles: [],
    fileRejections: [],
    isDragActive: false,
    dropzoneRef: null,
});

export const CapybaraContextProvider: FCWithChildren = ({ children }) => {
    const {
        open: openFileDialog,
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        rootRef: dropzoneRef,
    } = useDropzone({
        accept: { 'text/csv': ['.csv'] },
        onDrop: handleStatementFileUpload,
    });

    return (
        <>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <StyledEngineProvider injectFirst={true}>
                    <ThemeProvider theme={CapybaraTheme}>
                        <PopupDisplay>
                            <PageErrorBoundary>
                                <FileHandlerContext.Provider
                                    value={{
                                        openFileDialog,
                                        acceptedFiles,
                                        fileRejections,
                                        isDragActive,
                                        dropzoneRef,
                                    }}
                                >
                                    <Provider store={CapybaraStore}>
                                        <div {...omit(getRootProps(), ['onClick'])}>                                            
                                            {children}
                                            <CapybaraDialog />
                                            <CapybaraTutorial />
                                            <input
                                                id="file-upload-dropzone"
                                                {...getInputProps({ style: { display: 'none' } })}
                                            />
                                        </div>
                                    </Provider>
                                </FileHandlerContext.Provider>
                            </PageErrorBoundary>
                        </PopupDisplay>
                    </ThemeProvider>
                </StyledEngineProvider>
            </LocalizationProvider>
        </>
    );
};
