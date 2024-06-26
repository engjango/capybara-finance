import { FileRejection } from "react-dropzone";
import { CapybaraDispatch, CapybaraStore } from "../..";
import { AppSlice } from "../../app";
import { DefaultDialogs } from "../../app/defaults";
import { DialogStatementFileState } from "../../app/statementTypes";
import { addStatementFilesToDialog } from "./actions";
import { DialogFileDescription } from "./types";

export * from "./actions";
export * from "./types";

export const handleStatementFileUpload = (rawFiles: File[], rejections: FileRejection[]) => {
    const { import: state, id } = CapybaraStore.getState().app.dialog;
    const { account } = state as DialogStatementFileState;

    if (rejections.length) {
        CapybaraDispatch(
            AppSlice.actions.setDialogPartial({
                id: "import",
                import: { page: "file", account, rejections },
            })
        );
    } else if (rawFiles.length) {
        if (id !== "import" || state.page !== "parse")
            CapybaraDispatch(
                AppSlice.actions.setDialogPartial({
                    id: "import",
                    import: {
                        account: state.account,
                        ...DefaultDialogs.import,
                    },
                })
            );

        getFilesContents(rawFiles).then((files) => addStatementFilesToDialog(files));
    }
};

let id = 0;
export const getFilesContents = (files: File[]) =>
    Promise.all(
        files.map(
            (file) =>
                new Promise<DialogFileDescription>((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.onload = (event) => {
                        id++;

                        event.target
                            ? resolve({
                                  id: id + "",
                                  name: file.name,
                                  contents: event.target.result as string,
                              })
                            : reject();
                    };
                    fileReader.onerror = reject;
                    fileReader.readAsText(file);
                })
        )
    );
