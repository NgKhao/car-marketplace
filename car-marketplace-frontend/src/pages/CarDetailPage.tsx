import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Chi tiết xe - ID: {id}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Thông tin chi tiết về chiếc xe này
        </Typography>
      </Box>
    </Container>
  );
};

export default CarDetailPage;
