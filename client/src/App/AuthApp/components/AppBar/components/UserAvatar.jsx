import { Avatar } from '@mui/material';
import stringToColor from 'string-to-color';
import { useTheme } from '@mui/material';

const getInitials = fullName =>
    fullName === ''
        ? ''
        : fullName
            .trim()
            .split(/\s+/)
            .map(name => name[0].toUpperCase())
            .join('')
            .slice(0, 3);

const UserAvatar = ({ user, height = 60, width = 60 }) => {
    const { palette: { primary } } = useTheme();

    return (
        <Avatar
            src={user.image || ''}
            sx={{
                bgcolor: !user.image ? stringToColor(user.name) : primary.main,
                width,
                height
            }}>
            {!user.image && getInitials(user.name)}
        </Avatar>
    )
};

export default UserAvatar;