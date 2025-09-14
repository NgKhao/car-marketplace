import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  Payment,
  TrendingUp,
  DirectionsCar,
  Assignment,
  Star,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import type { Car } from '../types';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data - thay thế bằng API calls thực tế
const mockListings: Car[] = [
  {
    id: '1',
    title: 'Toyota Camry 2022 - Xe gia đình sang trọng',
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 1200000000,
    mileage: 15000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: 'Trắng',
    location: 'Hồ Chí Minh',
    images: ['/api/placeholder/400/300'],
    description: 'Xe đẹp như mới',
    condition: 'used',
    status: 'approved',
    sellerId: '1',
    sellerName: 'Nguyễn Văn A',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    views: 245,
    favorites: 12,
  },
  {
    id: '2',
    title: 'Honda Civic 2023 - Mới 100%',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 850000000,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    location: 'Hà Nội',
    images: ['/api/placeholder/400/300'],
    description: 'Xe mới 100%',
    condition: 'new',
    status: 'pending',
    sellerId: '1',
    sellerName: 'Nguyễn Văn A',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    views: 89,
    favorites: 5,
  },
];

const mockReports = [
  {
    id: '1',
    reportedBy: 'Trần Thị B',
    carTitle: 'Toyota Camry 2022',
    reason: 'Thông tin không chính xác',
    message: 'Xe đã có tai nạn nhưng không thông báo',
    createdAt: '2024-01-25T14:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    reportedBy: 'Lê Văn C',
    carTitle: 'Honda Civic 2023',
    reason: 'Giá không hợp lý',
    message: 'Giá quá cao so với thị trường',
    createdAt: '2024-01-26T09:15:00Z',
    status: 'resolved',
  },
];

const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Car | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    listing: Car
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleEdit = () => {
    if (selectedListing) {
      navigate(`/sell?edit=${selectedListing.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    // TODO: Implement delete API call
    console.log('Deleting listing:', selectedListing?.id);
    setDeleteDialogOpen(false);
    setSelectedListing(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          Bạn cần đăng nhập với tài khoản người bán để truy cập trang này.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant='h4' component='h1' gutterBottom>
            Bảng điều khiển người bán
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Quản lý các bài đăng xe và theo dõi hiệu suất
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={() => navigate('/sell')}
          size='large'
        >
          Đăng bài mới
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Car sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant='h5' fontWeight='bold'>
                  {mockListings.length}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Tổng bài đăng
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant='h5' fontWeight='bold'>
                  {mockListings.reduce((sum, car) => sum + (car.views || 0), 0)}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Lượt xem
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant='h5' fontWeight='bold'>
                  {mockListings.reduce(
                    (sum, car) => sum + (car.favorites || 0),
                    0
                  )}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Yêu thích
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant='h5' fontWeight='bold'>
                  {
                    mockListings.filter((car) => car.status === 'approved')
                      .length
                  }
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Đã duyệt
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label='Bài đăng của tôi' />
          <Tab label='Báo cáo về tôi' />
          <Tab label='Thống kê' />
        </Tabs>

        {/* Listings Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {mockListings.map((listing) => (
                <Grid item xs={12} md={6} lg={4} key={listing.id}>
                  <Card>
                    <CardMedia
                      component='img'
                      height='200'
                      image={listing.images[0]}
                      alt={listing.title}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant='h6'
                          component='h3'
                          sx={{ flexGrow: 1, mr: 1 }}
                        >
                          {listing.title}
                        </Typography>
                        <IconButton
                          size='small'
                          onClick={(e) => handleMenuClick(e, listing)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography
                        variant='h5'
                        color='primary'
                        fontWeight='bold'
                        gutterBottom
                      >
                        {formatPrice(listing.price)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={getStatusText(listing.status)}
                          color={getStatusColor(listing.status)}
                          size='small'
                        />
                        <Chip
                          label={
                            listing.condition === 'new' ? 'Mới' : 'Đã sử dụng'
                          }
                          size='small'
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                          {listing.views} lượt xem
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          <Star sx={{ fontSize: 16, mr: 0.5 }} />
                          {listing.favorites} yêu thích
                        </Typography>
                      </Box>

                      <Typography variant='body2' color='text.secondary'>
                        Đăng ngày: {formatDate(listing.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {mockListings.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Car sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Chưa có bài đăng nào
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  Hãy đăng bài đầu tiên để bắt đầu bán xe
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<Add />}
                  onClick={() => navigate('/sell')}
                >
                  Đăng bài đầu tiên
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Báo cáo về tôi
            </Typography>

            {mockReports.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Người báo cáo</TableCell>
                      <TableCell>Bài đăng</TableCell>
                      <TableCell>Lý do</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày báo cáo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.reportedBy}</TableCell>
                        <TableCell>{report.carTitle}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              report.status === 'pending'
                                ? 'Chờ xử lý'
                                : 'Đã xử lý'
                            }
                            color={
                              report.status === 'pending'
                                ? 'warning'
                                : 'success'
                            }
                            size='small'
                          />
                        </TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Warning
                  sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Không có báo cáo nào
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Bạn chưa nhận được báo cáo nào từ người mua
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Statistics Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Thống kê chi tiết
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Hiệu suất bài đăng
                    </Typography>
                    <List>
                      {mockListings.map((listing) => (
                        <ListItem key={listing.id}>
                          <ListItemAvatar>
                            <Avatar src={listing.images[0]} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={listing.title}
                            secondary={`${listing.views} lượt xem • ${listing.favorites} yêu thích`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Trạng thái bài đăng
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {['approved', 'pending', 'rejected'].map((status) => {
                        const count = mockListings.filter(
                          (car) => car.status === status
                        ).length;
                        return (
                          <Box
                            key={status}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Typography>{getStatusText(status)}</Typography>
                            <Chip
                              label={count}
                              color={getStatusColor(status)}
                              size='small'
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            selectedListing && navigate(`/cars/${selectedListing.id}`)
          }
        >
          <Visibility sx={{ mr: 1 }} fontSize='small' />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} fontSize='small' />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => navigate(`/payment?listing=${selectedListing?.id}`)}
        >
          <Payment sx={{ mr: 1 }} fontSize='small' />
          Thanh toán đẩy tin
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize='small' />
          Xóa bài đăng
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa bài đăng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bài đăng "{selectedListing?.title}"? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color='error' variant='contained'>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerDashboardPage;
