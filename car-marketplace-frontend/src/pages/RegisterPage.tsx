import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { validateRegisterForm } from '../utils/validation';
import type { RegisterRequest } from '../types';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'buyer',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Validate form
      const validationErrors = validateRegisterForm(
        data.email,
        data.password,
        data.confirmPassword,
        data.name,
        data.phone
      );
      if (validationErrors.length > 0) {
        setError(validationErrors[0].message);
        return;
      }

      if (!data.acceptTerms) {
        setError('Bạn phải đồng ý với điều khoản sử dụng');
        return;
      }

      // Call register API
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
      });

      // Update store
      login(response.user, response.token);

      // Redirect based on role
      if (response.user.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth='md'>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign='center' mb={3}>
            <DirectionsCar
              sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
            />
            <Typography
              variant='h4'
              component='h1'
              gutterBottom
              fontWeight='bold'
            >
              Đăng ký tài khoản
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Tham gia cộng đồng mua bán xe hàng đầu Việt Nam
            </Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{
                      required: 'Họ tên là bắt buộc',
                      minLength: {
                        value: 2,
                        message: 'Họ tên phải có ít nhất 2 ký tự',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Họ và tên'
                        margin='normal'
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(\+84|0)[3-9]\d{8}$/,
                        message: 'Số điện thoại không hợp lệ',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Số điện thoại'
                        margin='normal'
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        disabled={isLoading}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Controller
                name='email'
                control={control}
                rules={{
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    type='email'
                    margin='normal'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự',
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                        message:
                          'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Mật khẩu'
                        type={showPassword ? 'text' : 'password'}
                        margin='normal'
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge='end'
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: 'Xác nhận mật khẩu là bắt buộc',
                      validate: (value) =>
                        value === password || 'Mật khẩu xác nhận không khớp',
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Xác nhận mật khẩu'
                        type={showConfirmPassword ? 'text' : 'password'}
                        margin='normal'
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        disabled={isLoading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge='end'
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin='normal'>
                    <InputLabel>Loại tài khoản</InputLabel>
                    <Select
                      {...field}
                      label='Loại tài khoản'
                      disabled={isLoading}
                    >
                      <MenuItem value='buyer'>
                        Người mua - Tìm kiếm và mua xe
                      </MenuItem>
                      <MenuItem value='seller'>
                        Người bán - Đăng bán xe của tôi
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Box>
                <Controller
                  name='acceptTerms'
                  control={control}
                  rules={{
                    required: 'Bạn phải đồng ý với điều khoản sử dụng',
                  }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          disabled={isLoading}
                        />
                      }
                      label={
                        <Typography variant='body2'>
                          Tôi đồng ý với{' '}
                          <Link to='/terms' style={{ color: '#1976d2' }}>
                            Điều khoản sử dụng
                          </Link>{' '}
                          và{' '}
                          <Link to='/privacy' style={{ color: '#1976d2' }}>
                            Chính sách bảo mật
                          </Link>
                        </Typography>
                      }
                    />
                  )}
                />
                {errors.acceptTerms && (
                  <Typography variant='caption' color='error' display='block'>
                    {errors.acceptTerms.message}
                  </Typography>
                )}
              </Box>
            </Box>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký tài khoản'
              )}
            </Button>

            <Box textAlign='center' mt={2}>
              <Typography variant='body2' color='text.secondary'>
                Đã có tài khoản?{' '}
                <Link
                  to='/login'
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>

            <Box textAlign='center' mt={1}>
              <Link
                to='/'
                style={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                ← Quay về trang chủ
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
