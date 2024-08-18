import { Container, Grid } from '@mui/material';

import AIQuestions from './AIQuestions';

const Info = () => {
  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <AIQuestions />
    </Container>
  );
};

export default Info;
