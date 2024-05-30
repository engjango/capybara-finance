import styled from '@emotion/styled';
import { buttonClasses, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { formatNumber } from '../../../shared/data';
import { Greys } from '../../../styles/colours';
import { getThemeTransition, CapybaraTheme } from '../../../styles/theme';

const DEFAULT_ROW_HEIGHT = 50;

const CENTERED_CONTAINER = {
   height: DEFAULT_ROW_HEIGHT,
   display: 'flex',
   alignItems: 'center',
};

const BASE_PLACEHOLDER = {
   opacity: 1,
   color: '#fff',
   overflow: 'visible',
   fontWeight: 300,
};

const MIXED_PLACEHOLDER = {
   ...BASE_PLACEHOLDER,
   fontStyle: 'italic',
};

export const TransactionTableDateContainer = styled('div')({
   ...CENTERED_CONTAINER,
   //width: 90,
   marginLeft: 10,
   marginRight: 10,
   flexGrow: 1,
});

export const TransactionTableTextContainer = styled('div')({
   width: 150,
   flexGrow: 4,
   margin: '14px 10px 10px 0',
});

export const TransactionTableValueContainer = styled('div')({
   ...CENTERED_CONTAINER,
   width: 110,
   marginRight: 20,
   flexGrow: 1,
   justifyContent: 'flex-end',
});

export const TransactionTableCategoryContainer = styled('div')({
   ...CENTERED_CONTAINER,
   width: 150,
   flexGrow: 2,
});

export const TransactionTableBalanceContainer = styled('div')({
   ...CENTERED_CONTAINER,
   width: 110,
   marginLeft: 10,
   flexGrow: 1,
   justifyContent: 'flex-end',
});

export const TransactionTableStatementContainer = styled('div')({
   ...CENTERED_CONTAINER,
   margin: '0 15px',

   '& > svg': {
      margin: 3,
   },

   '& button': {
      minWidth: 'auto',
      padding: 2,

      [`& .${buttonClasses.endIcon}`]: {
         margin: 0,
      },
   },
});
export const TransactionTableAccountContainer = styled('div')({
   ...CENTERED_CONTAINER,
   width: 170,
   flexGrow: 1,
   overflow: 'hidden',
   whiteSpace: 'nowrap',
   textOverflow: 'ellipsis',
   fontWeight: 100,
});

export const TransactionTableActionsContainer = styled('div')({
   ...CENTERED_CONTAINER,
   width: 100,
   flexGrow: 0,
   padding: '0 5px',
   justifyContent: 'flex-end',

   '& button': { padding: 3 },
   '& > *': {
      marginLeft: 5,
   },
});

export const TransactionTableCompoundContainer = styled(Box)({
   display: 'flex',
   alignItems: 'center',
   overflow: 'hidden',
   whiteSpace: 'nowrap',
   height: 32,
   width: '100%',
});

export const TransactionsTableSummaryTypography = styled(Typography)({
   fontWeight: 300,
});

export const TransactionTableMixedTypography = styled(Typography)({
   ...MIXED_PLACEHOLDER,
   fontWeight: 100,
});

export const TransactionTableSxProps = {
   Container: {
      display: 'flex',
      alignItems: 'flex-start !important',
      padding: '0 5px',
      height: 'min-content !important',
      ...CapybaraTheme.typography.body1,
      transition: getThemeTransition(['box-shadow']),

      '& > *': { flexShrink: 0 },

      //borderBottom: "1px solid " + Greys[200],
      '&:last-child': {
         borderBottomColor: 'transparent',
      },

      '& p': {
         lineHeight: '1 !important',
         padding: '3px 0',
         minWidth: 0,
         overflow: 'hidden',
      },
   },

   Mixed: MIXED_PLACEHOLDER,

   BasePlaceholder: {
      '&::placeholder': BASE_PLACEHOLDER,
      padding: '8px',
      //background: '#fff',
      color: '#fff',
      fontWeight: 100,
   },

   MixedPlaceholder: {
      '& input::placeholder': MIXED_PLACEHOLDER,
      padding: '8px',
      //background: '#fff',
      color: '#fff',
      fontWeight: 100,
   },

   CenteredValueContainer: CENTERED_CONTAINER,

   MissingValue: {
      fontStyle: 'italic',
      color: '#67656a',
      overflow: 'visible',
   },
};

export const formatTransactionsTableNumber = (value: number) => formatNumber(value);
