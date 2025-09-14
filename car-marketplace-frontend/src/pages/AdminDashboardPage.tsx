import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AdminDashboardPage: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Bảng điều khiển Admin
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý người dùng và phê duyệt bài đăng
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
