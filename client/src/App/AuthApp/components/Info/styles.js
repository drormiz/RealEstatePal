export const chatBox = theme => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper
});

export const chipsContainer = theme => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius
});

export const chatContainer = theme => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  maxHeight: '400px'
});

export const messageContainer = isUser => ({
  backgroundColor: isUser ? '#2193b0' : '#F7F7F7',
  color: isUser ? '#FFFFFF' : '#484848',
  borderRadius: '20px',
  padding: '10px 15px',
  marginBottom: '10px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '70%',
  alignSelf: isUser ? 'flex-end' : 'flex-start'
});

export const inputContainer = theme => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2]
});
