import RowComponent, { RowComponentBaseProps } from './row-component'
import TextComponent, { TextComponentProps } from './text-component'
import UserAvatar from './user-avatar'

interface AvatarLabelProps {
    avatarSize?: number
    avatarUrl?: string
    userName?: string
    rowProps?: RowComponentBaseProps
    textProps?: TextComponentProps
}

export default function AvatarLabel({
    avatarSize = 16,
    avatarUrl,
    userName,
    rowProps,
    textProps,
}: AvatarLabelProps) {

    return (
        <RowComponent gap={10} {...rowProps}>
            <UserAvatar avatarUrl={avatarUrl} avatarSize={avatarSize} userName={userName} />
            <TextComponent
                type='label'
                text={userName || ''}
                {...textProps}
            />
        </RowComponent>
    )
}
