import { Container } from '@mui/material';

import AIQuestions from './AIQuestions';

const Info = () => {
  return (
    <Container maxWidth={false} sx={{ padding: '20px', height: '100%' }}>
      <AIQuestions />
    </Container>
  );
};

export default Info;
