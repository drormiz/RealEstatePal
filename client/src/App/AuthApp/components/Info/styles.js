export const chatBox = (theme) => ({
  width: '100%',
  height: '90vh',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
});

export const chipsContainer = (theme) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
});

export const chatContainer = (theme) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
});

export const messageContainer = (isUser) => (theme) => ({
  marginBottom: theme.spacing(2),
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  maxWidth: '75%',
  padding: theme.spacing(1, 2),
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  borderRadius: isUser
    ? `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`
    : `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

export const inputContainer = (theme) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
});
