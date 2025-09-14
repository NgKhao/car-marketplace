import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Đăng ký
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Tạo tài khoản mới
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
