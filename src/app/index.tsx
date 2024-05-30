import React from "react";
import { CapybaraContextProvider } from "./context";
import { View } from "./view";

export const App: React.FC = () => (
    <CapybaraContextProvider>
        <View />
    </CapybaraContextProvider>
);
