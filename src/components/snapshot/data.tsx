import { range, sum, toPairs, unzip, zip } from 'lodash';
import { useMemo } from 'react';
import { equalZip, takeWithDefault } from '../../shared/data';
import { useAllAccounts, useAllCategories, useAllCurrencies, useAllInstitutions } from '../../state/data/hooks';
import { TRANSFER_CATEGORY_ID } from '../../state/data/shared';
import { ID } from '../../state/shared/values';

export interface SnapshotSectionData {
    trends: {
        credits: number[];
        debits: number[];
    };
    net: number[];
    currency?: ID;
}

export const useAssetsSnapshot = (account?: ID, currency?: ID) => {
    // Obtém todas as contas disponíveis
    const accounts = useAllAccounts();

    return useMemo(
        () =>
            // Calcula os valores de ativos para exibição
            getSnapshotDisplayValues(
                accounts
                    // Filtra as contas com base na conta específica (se fornecida)
                    .filter(({ id }) => account === undefined || id === account)
                    .flatMap(({ balances }) =>
                        // Mapeia os saldos das contas para o formato desejado
                        toPairs(balances)
                            // Filtra os saldos com base na moeda específica (se fornecida)
                            .filter(([id, _]) => currency === undefined || currency === Number(id))
                            // Mapeia os saldos para o formato desejado
                            .map(([_, balance]) => balance[currency === undefined ? 'localised' : 'original'])
                    )
                    // Reduz os saldos para calcular os ativos finais
                    .reduce(
                        // Acumula os saldos em um único ativo
                        (accs, balances) =>
                            zip(accs, balances).map(([acc, bal]) => {
                                // Divide o ativo em parte positiva e negativa
                                const [pos, neg] = acc || ([0, 0] as [number, number]);
                                // Adiciona o saldo positivo à parte positiva e o saldo negativo à parte negativa
                                return (bal && bal > 0 ? [pos + bal, neg] : [pos, neg + (bal || 0)]) as [number, number];
                            }),
                        // Inicializa o acumulador como um array vazio
                        [] as [number, number][]
                    ),
                // Moeda específica usada para formatação
                currency,
            ),
        // Dependências do useMemo para evitar recálculos desnecessários
        [accounts, account, currency]
    );
};

export const useTransactionsSnapshot = (category?: ID): SnapshotSectionData => {
    // Obtém todas as categorias disponíveis
    const categories = useAllCategories();

    return useMemo(
        () =>
            // Calcula os valores de movimentações para exibição
            getSnapshotDisplayValues(
                unzip(
                    // Filtra as categorias, excluindo transferências e filtrando pela categoria especificada (se houver)
                    categories
                        .filter(({ id }) => id !== TRANSFER_CATEGORY_ID)
                        .filter(({ id }) => category === undefined || id === category)
                        // Extrai todas as transações das categorias filtradas
                        .flatMap(({ transactions }) => transactions)
                        // Reduz as transações para acumular créditos e débitos
                        .reduce(
                            // Acumuladores para créditos e débitos
                            ([accCredits, accDebits], { credits, debits }) =>
                                [
                                    // Soma os créditos atuais com os acumulados
                                    zip(accCredits, credits).map(([acc, val]) => (acc || 0) + (val || 0)),
                                    // Soma os débitos atuais com os acumulados (BUG: /2 adicionado, pois está duplicando)
                                    zip(accDebits, debits).map(([acc, val]) => (acc || 0) + (val || 0) / 2),
                                ] as [number[], number[]],
                            [[], []] as [number[], number[]]
                        ),
                ) as [number, number][],
            ),
        [categories, category]
    );
};

// Função auxiliar para formatar os valores de exibição do snapshot
const getSnapshotDisplayValues = (trends: [number, number][], currency?: ID) => {
    
    // Separa as tendências de créditos e débitos
    let [credits, debits] = trends.length ? unzip(trends) : [range(12).map(_ => 0), range(12).map(_ => 0)];

    // Garante que os arrays tenham um tamanho mínimo de 25 elementos, preenchendo com zeros se necessário
    credits = takeWithDefault(credits, 25, 0);
    debits = takeWithDefault(debits, 25, 0);

    console.log(`trends : ${trends}`);
    //console.log(`credits: ${credits}`);
    //console.log(`debits : ${credits}`);

    // Calcula o valor líquido (créditos - débitos) para cada ponto
    const net = equalZip(credits, debits).map(sum);

    return { trends: { credits, debits }, net, currency };
};
