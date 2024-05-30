import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge, IconButton, Popover, Typography, keyframes } from '@mui/material';
import { Notifications } from '../../app/notifications';
import { usePopoverProps } from '../../shared/hooks';
import { FCWithChildren } from '../../shared/types';
import { useNotificationCount } from '../../state/data/hooks';
import { AnimatedUnderline, PageContainerBox, TitleBox, TitleButtonsBox } from '../../styles/theme';

export const Page: FCWithChildren<{ title: string; hideButtons?: boolean }> = ({
    children,
    title,
    hideButtons = false,
}) => {
    const notifications = useNotificationCount();
    const { buttonProps, popoverProps } = usePopoverProps();

    return (
        <PageContainerBox>
            <TitleBox>
                <div style={{ display: 'grid' }}>
                    <Typography variant="h3">{title}</Typography>
                    <AnimatedUnderline />
                </div>
                {!hideButtons && (
                    <TitleButtonsBox>
                        <IconButton {...buttonProps} size="large">
                            <Badge badgeContent={notifications} color="error" overlap="circular" variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Popover
                            {...popoverProps}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <Notifications />
                        </Popover>
                    </TitleButtonsBox>
                )}
            </TitleBox>
            {children}
        </PageContainerBox>
    );
};
