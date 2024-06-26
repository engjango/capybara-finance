import styled from '@emotion/styled';
import { HelpOutlined } from '@mui/icons-material';
import { ButtonBase, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { identity } from 'lodash';
import React, { useCallback } from 'react';
import { formatNumber } from '../../../shared/data';
import { suppressEvent } from '../../../shared/events';
import { Greys, Intents } from '../../../styles/colours';
import { fadeSolidColour } from '../../display/ObjectDisplay';

export const Value: React.FC<{
    name: string;
    subtitle?: string;
    values: number[];
    colour?: string;
    title?: boolean;
    help?: string;
    subValues?:
        | {
              type: 'number';
              symbol: string;
              values: number[];
          }
        | {
              type: 'string';
              values: string[];
          };
    placeholder?: boolean;
    onClick?: () => void;
    colorise?: boolean;
}> = ({ name, subtitle, values, subValues, colour, title, help, placeholder, onClick, colorise }) => {
    const variant = title ? 'body1' : 'body2';

    const onClickWrapped = useCallback(
        (event: React.MouseEvent) => {
            suppressEvent(event);
            onClick && onClick();
        },
        [onClick]
    );

    const contents = (
        <>
            {title ? undefined : (
                <ColourBox
                    style={{
                        backgroundColor: fadeSolidColour(colour || '#65646a'),
                        borderColor: colour || '#65646a',
                    }}
                />
            )}
            <NameContainerBox>
                <NameTypography
                    sx={{
                        ...(title ? TitleTypographySx : undefined),
                        ...(placeholder ? PlaceholderTypographySx : undefined),
                    }}
                    variant={variant}
                >
                    {name + " "}
                </NameTypography>                
                {subtitle && <SubNameTypography variant="caption">{subtitle}</SubNameTypography>}
            </NameContainerBox>
            {title && help ? (
                <Tooltip title={help}>
                    <HelpOutlinedIcon htmlColor={"#67656a"} />
                </Tooltip>
            ) : undefined}
            <ValueContainerBox>
                {values.map((value, idx) =>
                    value ||
                    (values.filter(identity).length === 0 &&
                        ((subValues?.values as (string | number)[])?.filter(identity).length
                            ? subValues?.values[idx]
                            : idx === 0)) ? (
                        <div key={idx}>
                            <ValueTypography
                                sx={{
                                    ...(title ? TitleTypographySx : undefined),
                                    color: subValues
                                        ? Greys[800]
                                        : colorise
                                        ? value >= 0
                                            ? '#0f9960 !important'
                                            : '#db3737 !important'
                                        : undefined,
                                }}
                                variant={variant}
                            >
                                {formatNumber(value, { start: '+' })}
                            </ValueTypography>
                            {subValues && (
                                <ValueTypographySub
                                    variant="caption"
                                    style={{
                                        color: Number(subValues.values[idx] || 0) >= 0 ? '#0f9960' : '#db3737',
                                    }}
                                >
                                    {subValues.type === 'number'
                                        ? subValues.symbol +
                                          ' ' +
                                          formatNumber(subValues.values[idx], { start: '+', end: 'k' })
                                        : subValues.values[idx]}
                                </ValueTypographySub>
                            )}
                        </div>
                    ) : undefined
                )}
            </ValueContainerBox>
        </>
    );

    return onClick ? (
        <ButtonBase
            sx={{
                ...ContainerSx,
                ...InteractiveContainerSx,
                ...(title ? undefined : NonTitleContainerSx),
            }}
            disabled={!onClick}
            onClick={onClickWrapped}
        >
            {contents}
        </ButtonBase>
    ) : (
        <Box
            sx={{
                ...ContainerSx,
                ...(title ? undefined : NonTitleContainerSx),
            }}
            style={{ color: '#fff' }}
        >
            {contents}
        </Box>
    );
};

const ContainerSx = {
    display: 'flex',
    padding: '2px 5px 0 5px',
    margin: '2px 0 0 0',
    alignItems: 'flex-start',
    border: '1px solid transparent',

    '&:first-of-type': {
        marginTop: 0,
    },
};

const InteractiveContainerSx = {
    cursor: 'pointer',
    borderRadius: '8px',
    '&:hover': {
        border: '1px solid #67646a'
    },
};

const NonTitleContainerSx = {
    padding: '5px 5px 0 5px',
    color: '#fff',
};

const ColourBox = styled('div')({
    width: 16,
    height: 16,
    borderRadius: '50%',
    marginRight: 8,
    flexShrink: 0,
    border: '1px solid transparent',
});

const NameContainerBox = styled('div')({
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
});

const ValueContainerBox = styled('div')({
    flexGrow: 1,
    flexShrink: 0,
    '& > div': {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 5,
        justifyContent: 'flex-end',
    },
});

const HelpOutlinedIcon = styled(HelpOutlined)({
    fontSize: 12,
    margin: '4px 6px 4px 6px',
});

const ValueTypography = styled(Typography)({
    color: '#67656a',
    textAlign: 'right',
    lineHeight: 1.2,
});

const ValueTypographySub = styled(ValueTypography)({
    color: '#65646a',
});

const TitleTypographySx = {
    fontWeight: 500,
    color: '#fff',
};

const PlaceholderTypographySx = {
    color: Greys[500],
    fontStyle: 'italic',
};

const NameTypography = styled(Typography)({
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    textAlign: 'left',
});

const SubNameTypography = styled(NameTypography)({
    color: '#65646a',
});
