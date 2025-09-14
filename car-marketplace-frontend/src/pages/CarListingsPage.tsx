import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CarListingsPage: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Danh sách xe
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Khám phá các xe đang được bán
        </Typography>
      </Box>
    </Container>
  );
};

export default CarListingsPage;
