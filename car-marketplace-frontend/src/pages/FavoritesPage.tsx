import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { useCarStore } from '../store/carStore';
import CarCard from '../components/car/CarCard';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { favorites, isLoading, error, getFavorites } = useFavoriteStore();
  const { cars } = useCarStore();

  useEffect(() => {
    if (isAuthenticated) {
      getFavorites();
    }
  }, [isAuthenticated, getFavorites]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='warning'>
          Bạn cần đăng nhập để xem danh sách yêu thích.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Đang tải danh sách yêu thích...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    );
  }

  // Get favorite cars by matching car IDs
  const favoriteCars = cars
    .filter((car) => favorites.some((fav) => fav.carId === car.id))
    .map((car) => ({ ...car, isFavorite: true }));

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Favorite sx={{ fontSize: 32, color: 'error.main', mr: 2 }} />
        <Typography variant='h4' component='h1'>
          Xe yêu thích
        </Typography>
      </Box>

      {favoriteCars.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FavoriteBorder
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Chưa có xe nào trong danh sách yêu thích
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Hãy thêm những chiếc xe bạn quan tâm vào danh sách yêu thích
          </Typography>
          <Typography
            variant='body2'
            color='primary'
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/cars')}
          >
            Khám phá xe ngay
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {favoriteCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
