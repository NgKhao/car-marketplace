import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { validateRegisterForm } from '../utils/validation';
import type { User } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<User>>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const onSubmit = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      setError('');

      // Validate form
      if (data.name && data.email) {
        const validationErrors = validateRegisterForm(
          data.email,
          '', // password not required for profile update
          '',
          data.name,
          data.phone
        );
        const relevantErrors = validationErrors.filter(
          (err) => err.field !== 'password' && err.field !== 'confirmPassword'
        );
        if (relevantErrors.length > 0) {
          setError(relevantErrors[0].message);
          return;
        }
      }

      // Call API to update profile
      const updatedUser = await authService.updateProfile(data);

      // Update store
      updateUser(updatedUser);

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement avatar upload
      console.log('Upload avatar:', file);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label='Thông tin cơ bản' />
          <Tab icon={<Security />} label='Bảo mật' />
          <Tab icon={<Notifications />} label='Thông báo' />
        </Tabs>

        {/* Basic Information Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity='success' sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Avatar Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 24,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'primary.dark' },
                    }}
                    size='small'
                    component='label'
                  >
                    <PhotoCamera fontSize='small' />
                    <input
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
              </Box>

              <Box>
                <Typography variant='h6'>{user.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {user.role === 'buyer'
                    ? 'Người mua'
                    : user.role === 'seller'
                    ? 'Người bán'
                    : 'Quản trị viên'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Tham gia từ{' '}
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>

              <Box sx={{ ml: 'auto' }}>
                {!isEditing ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    variant='outlined'
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      variant='outlined'
                    >
                      Hủy
                    </Button>
                    <Button
                      startIcon={<Save />}
                      onClick={handleSubmit(onSubmit)}
                      variant='contained'
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Lưu'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                          disabled={!isEditing}
                          error={!!errors.name}
                          helperText={errors.name?.message}
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
                          disabled={!isEditing}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
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
                      disabled={!isEditing}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label='Vai trò'
                  value={
                    user.role === 'buyer'
                      ? 'Người mua'
                      : user.role === 'seller'
                      ? 'Người bán'
                      : 'Quản trị viên'
                  }
                  disabled
                />
              </Box>
            </form>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Bảo mật tài khoản
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Đổi mật khẩu
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và duy nhất
                </Typography>
                <Button variant='outlined' sx={{ mt: 2 }}>
                  Đổi mật khẩu
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Xác thực hai bước
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Thêm lớp bảo mật cho tài khoản của bạn
                </Typography>
                <FormControlLabel
                  control={<Switch />}
                  label='Bật xác thực hai bước'
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Phiên đăng nhập
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Quản lý các thiết bị đã đăng nhập vào tài khoản
                </Typography>
                <Button variant='outlined' color='error' sx={{ mt: 2 }}>
                  Đăng xuất tất cả thiết bị
                </Button>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Cài đặt thông báo
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Thông báo email
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label='Xe mới phù hợp'
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label='Tin nhắn từ người bán'
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label='Khuyến mãi và ưu đãi'
                  />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Thông báo push
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label='Tin nhắn mới'
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label='Cập nhật trạng thái bài đăng'
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label='Thông báo marketing'
                  />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  Tần suất thông báo
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Tần suất email</InputLabel>
                  <Select defaultValue='daily' label='Tần suất email'>
                    <MenuItem value='immediate'>Ngay lập tức</MenuItem>
                    <MenuItem value='daily'>Hàng ngày</MenuItem>
                    <MenuItem value='weekly'>Hàng tuần</MenuItem>
                    <MenuItem value='never'>Không bao giờ</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
