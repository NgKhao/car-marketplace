import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const SellerDashboardPage: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Bảng điều khiển người bán
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý các bài đăng xe của bạn
        </Typography>
      </Box>
    </Container>
  );
};

export default SellerDashboardPage;
