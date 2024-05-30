import styled from '@emotion/styled';
import { CheckCircleOutline, Clear } from '@mui/icons-material';
import { Button, Collapse, Fade, IconButton, Typography } from '@mui/material';
import { Box, SxProps } from '@mui/system';
import React, { useCallback, useState } from 'react';
import { NonIdealState } from '../components/display/NonIdealState';
import { useAllNotifications } from '../state/data/hooks';
import { getNotificationDisplayMetadata, NotificationDisplayMetadata } from '../state/logic/notifications';
import { useLanguage } from '../languages/languages-context';
import {
    BackdropBox,
    ButtonContainerBox,
    ContainerCollapse,
    ContentsBox,
    NotificationBox,
    NotificationsPopBox,
    SpacedButton,
} from '../styles/theme';

const NotificationDisplay: React.FC<NotificationDisplayMetadata> = ({
    icon: Icon,
    title,
    dismiss,
    colour,
    buttons,
    children,
}) => {
    const [grow, setGrow] = useState(true);

    const [closedProgrammatically, setClosedProgrammatically] = useState(false);
    const programmaticDismiss = useCallback(() => {
        setGrow(false);
        setClosedProgrammatically(true);
    }, []);
    const onExited = useCallback(() => dismiss && dismiss(closedProgrammatically), [dismiss, closedProgrammatically]);

    return (
        <ContainerCollapse in={grow} onExited={onExited}>
            <Fade in={grow}>
                <NotificationBox style={{ borderColor: colour }}>
                    <BackdropBox style={{ backgroundColor: colour }} />
                    <ContentsBox>
                        <Icon
                            sx={{
                                margin: 3,
                                marginRight: 23,
                            }}
                            htmlColor={'#fff'}
                            fontSize="small"
                        />
                        <Typography variant="subtitle2" flexGrow={1} style={{ color: '#fff' }}>
                            {title}
                        </Typography>
                        {dismiss && (
                            <IconButton onClick={() => setGrow(false)} size="small" style={{ color: '#fff' }}>
                                <Clear fontSize="inherit" />
                            </IconButton>
                        )}
                    </ContentsBox>
                    {children}
                    {buttons ? (
                        <ButtonContainerBox>
                            {buttons.map(({ text, onClick }, idx) => (
                                <SpacedButton
                                    onClick={() => onClick(programmaticDismiss)}
                                    size="small"
                                    key={idx}
                                    color="inherit"
                                >
                                    {text}
                                </SpacedButton>
                            ))}
                        </ButtonContainerBox>
                    ) : (
                        <Box height={25} />
                    )}
                </NotificationBox>
            </Fade>
        </ContainerCollapse>
    );
};

export const Notifications: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    const notifications = useAllNotifications();
    const { language, translations } = useLanguage();
    return (
        <NotificationsPopBox sx={{ ...sx }}>
            {notifications.length ? (
                notifications.map(notification => (
                    <NotificationDisplay
                        key={notification.id + '-' + notification.contents}
                        {...getNotificationDisplayMetadata(notification)}
                    />
                ))
            ) : (
                <NonIdealState icon={CheckCircleOutline} title={translations[language].noNotifications} intent="app" />
            )}
        </NotificationsPopBox>
    );
};
