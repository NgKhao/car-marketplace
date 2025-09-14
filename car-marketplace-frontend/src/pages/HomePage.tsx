import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h3' component='h1' gutterBottom>
          Chào mừng đến với Car Marketplace
        </Typography>
        <Typography variant='h6' component='p' color='text.secondary'>
          Nền tảng mua bán xe hàng đầu Việt Nam
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
