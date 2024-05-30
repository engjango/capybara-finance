import { useCallback } from "react";
import { TypedUseSelectorHook, useSelector as useSelectorRaw } from "react-redux";
import { CapybaraState } from "..";
import { changeCurrencyValue } from "../data";
import { useCurrencyMap, useDefaultCurrency } from "../data/hooks";
import { ID, SDate } from "./values";

export const useSelector: TypedUseSelectorHook<CapybaraState> = useSelectorRaw;

export const useLocaliseCurrencies = () => {
    const userDefaultCurrency = useDefaultCurrency();
    const currencies = useCurrencyMap();
    return useCallback(
        (value: number, currency: ID, date: SDate) =>
            changeCurrencyValue(userDefaultCurrency, currencies[currency]!, value, date),
        [userDefaultCurrency, currencies]
    );
};
