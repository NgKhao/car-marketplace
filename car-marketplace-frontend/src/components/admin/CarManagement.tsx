import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  People,
  Storefront,
  ShoppingCart,
  VerifiedUser,
  Search,
  Refresh,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
  Delete,
} from '@mui/icons-material';

interface CarListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  condition: 'new' | 'used';
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  description: string;
  location: string;
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data for car listings
const mockCarListings: CarListing[] = [
  {
    id: '1',
    title: 'Toyota Camry 2022 - Xe gia đình đẹp',
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 1200000000,
    mileage: 15000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    condition: 'used',
    status: 'pending',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    description: 'Xe gia đình sử dụng ít, bảo dưỡng định kỳ tại hãng',
    location: 'Hồ Chí Minh',
    seller: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyen.van.a@gmail.com',
      phone: '0901234567',
      avatar: '/api/placeholder/40/40',
    },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    title: 'Honda Civic 2023 - Xe mới 99%',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 850000000,
    mileage: 5000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    condition: 'used',
    status: 'approved',
    images: ['/api/placeholder/300/200'],
    description: 'Xe mới mua, cần bán gấp do chuyển công tác',
    location: 'Hà Nội',
    seller: {
      id: '2',
      name: 'Trần Thị B',
      email: 'tran.thi.b@gmail.com',
      phone: '0987654321',
    },
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-02-10T16:20:00Z',
  },
  {
    id: '3',
    title: 'Mercedes C200 2021 - Sang trọng',
    brand: 'Mercedes',
    model: 'C200',
    year: 2021,
    price: 1800000000,
    mileage: 25000,
    transmission: 'automatic',
    fuelType: 'gasoline',
    condition: 'used',
    status: 'rejected',
    images: ['/api/placeholder/300/200'],
    description: 'Xe sang trọng, đầy đủ tiện nghi',
    location: 'Đà Nẵng',
    seller: {
      id: '3',
      name: 'Lê Văn C',
      email: 'le.van.c@gmail.com',
      phone: '0912345678',
    },
    createdAt: '2024-02-05T09:45:00Z',
    updatedAt: '2024-02-05T09:45:00Z',
  },
];

const CarManagement: React.FC = () => {
  const navigate = useNavigate();
  const [carListings, setCarListings] = useState<CarListing[]>(mockCarListings);
  const [filteredListings, setFilteredListings] =
    useState<CarListing[]>(mockCarListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu states
  const [selectedListing, setSelectedListing] = useState<CarListing | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  // Filter listings
  React.useEffect(() => {
    const filtered = carListings.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || listing.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredListings(filtered);
    setPage(0);
  }, [searchQuery, statusFilter, carListings]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    listing: CarListing
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleViewDetail = () => {
    if (selectedListing) {
      navigate(`/cars/${selectedListing.id}`);
    }
    handleMenuClose();
  };

  const handleApprove = () => {
    if (selectedListing) {
      const updatedListings = carListings.map((listing) =>
        listing.id === selectedListing.id
          ? {
              ...listing,
              status: 'approved' as const,
              updatedAt: new Date().toISOString(),
            }
          : listing
      );
      setCarListings(updatedListings);
      setSnackbarMessage('Đã duyệt bài đăng thành công');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedListing) {
      const updatedListings = carListings.map((listing) =>
        listing.id === selectedListing.id
          ? {
              ...listing,
              status: 'rejected' as const,
              updatedAt: new Date().toISOString(),
            }
          : listing
      );
      setCarListings(updatedListings);
      setSnackbarMessage('Đã từ chối bài đăng');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedListing) {
      const updatedListings = carListings.filter(
        (listing) => listing.id !== selectedListing.id
      );
      setCarListings(updatedListings);
      setSnackbarMessage('Đã xóa bài đăng');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu`;
    }
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label='Chờ duyệt' color='warning' size='small' />;
      case 'approved':
        return <Chip label='Đã duyệt' color='success' size='small' />;
      case 'rejected':
        return <Chip label='Bị từ chối' color='error' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Statistics
  const totalListings = carListings.length;
  const pendingListings = carListings.filter(
    (l) => l.status === 'pending'
  ).length;
  const approvedListings = carListings.filter(
    (l) => l.status === 'approved'
  ).length;
  const rejectedListings = carListings.filter(
    (l) => l.status === 'rejected'
  ).length;

  return (
    <Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {totalListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng bài đăng
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Storefront sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {pendingListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Chờ duyệt
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {approvedListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đã duyệt
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {rejectedListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Bị từ chối
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Car Listings Management */}
      <Paper sx={{ p: 3 }}>
        {/* Filters and Search */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size='small'
            placeholder='Tìm kiếm theo tiêu đề, người bán, hãng xe...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label='Trạng thái'
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='pending'>Chờ duyệt</MenuItem>
              <MenuItem value='approved'>Đã duyệt</MenuItem>
              <MenuItem value='rejected'>Bị từ chối</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='outlined'
            startIcon={<Refresh />}
            onClick={handleReset}
          >
            Đặt lại
          </Button>
        </Box>

        {/* Car Listings Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Thông tin xe</TableCell>
                <TableCell>Người bán</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đăng</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredListings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Box
                        component='img'
                        sx={{
                          width: 60,
                          height: 45,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        src={listing.images[0]}
                        alt={listing.title}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {listing.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {listing.transmission === 'automatic'
                            ? 'Tự động'
                            : 'Số sàn'}{' '}
                          •
                          {listing.fuelType === 'gasoline'
                            ? ' Xăng'
                            : listing.fuelType === 'diesel'
                            ? ' Dầu'
                            : listing.fuelType === 'electric'
                            ? ' Điện'
                            : ' Hybrid'}{' '}
                          • {listing.mileage.toLocaleString()} km
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2'>
                          {listing.seller.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {listing.seller.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium'>
                        {formatPrice(listing.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(listing.status)}</TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {formatDate(listing.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size='small'
                        onClick={(e) => handleMenuClick(e, listing)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredListings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Số dòng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong tổng số ${count}`
          }
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetail}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        {selectedListing?.status === 'pending' && (
          <>
            <MenuItem onClick={handleApprove}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              Duyệt bài đăng
            </MenuItem>
            <MenuItem onClick={handleReject}>
              <Cancel sx={{ mr: 1, color: 'warning.main' }} />
              Từ chối
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa bài đăng
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarManagement;
