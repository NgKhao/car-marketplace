import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CreateListingPage: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Đăng bán xe
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Tạo bài đăng mới để bán xe của bạn
        </Typography>
      </Box>
    </Container>
  );
};

export default CreateListingPage;
