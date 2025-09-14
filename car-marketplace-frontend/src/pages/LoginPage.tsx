import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Đăng nhập
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Đăng nhập vào tài khoản của bạn
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
