import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Payment,
  CheckCircle,
  CreditCard,
  AccountBalance,
  QrCode,
  Star,
  TrendingUp,
  Visibility,
  Receipt,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { formatCurrency } from '../utils/helpers';

interface PaymentFormData {
  package: 'basic' | 'premium' | 'vip';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'qr_code';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
}

const paymentPackages = [
  {
    id: 'basic',
    name: 'Đăng tin cơ bản',
    price: 50000,
    duration: '7 ngày',
    features: [
      'Hiển thị trong danh sách',
      'Hỗ trợ khách hàng cơ bản',
      'Thống kê lượt xem',
    ],
    color: 'primary',
  },
  {
    id: 'premium',
    name: 'Đăng tin nổi bật',
    price: 150000,
    duration: '14 ngày',
    features: [
      'Ưu tiên hiển thị',
      'Badge "Nổi bật"',
      'Thống kê chi tiết',
      'Hỗ trợ khách hàng ưu tiên',
    ],
    color: 'warning',
    popular: true,
  },
  {
    id: 'vip',
    name: 'Đăng tin VIP',
    price: 300000,
    duration: '30 ngày',
    features: [
      'Hiển thị đầu danh sách',
      'Badge "VIP"',
      'Thống kê toàn diện',
      'Hỗ trợ 24/7',
      'Quảng cáo banner',
    ],
    color: 'error',
  },
];

const steps = ['Chọn gói', 'Thanh toán', 'Xác nhận'];

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');

  const [activeStep, setActiveStep] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      package: 'premium',
      paymentMethod: 'credit_card',
    },
  });

  const selectedPackage = watch('package');
  const selectedPaymentMethod = watch('paymentMethod');
  const currentPackage = paymentPackages.find(
    (pkg) => pkg.id === selectedPackage
  );

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setPaymentSuccess(true);
  };

  const handlePaymentComplete = () => {
    setPaymentSuccess(false);
    navigate('/seller-dashboard');
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Thanh toán dịch vụ đăng tin
      </Typography>

      {listingId && (
        <Alert severity='info' sx={{ mb: 3 }}>
          Bạn đang thanh toán để đẩy tin cho bài đăng ID: {listingId}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Package Selection */}
          {activeStep === 0 && (
            <Box>
              <Typography variant='h6' gutterBottom>
                Chọn gói dịch vụ
              </Typography>

              <Controller
                name='package'
                control={control}
                render={({ field }) => (
                  <FormControl component='fieldset' sx={{ width: '100%' }}>
                    <RadioGroup {...field} sx={{ gap: 2 }}>
                      {paymentPackages.map((pkg) => (
                        <FormControlLabel
                          key={pkg.id}
                          value={pkg.id}
                          control={<Radio />}
                          label={
                            <Card
                              sx={{
                                width: '100%',
                                position: 'relative',
                                border: field.value === pkg.id ? 2 : 1,
                                borderColor:
                                  field.value === pkg.id
                                    ? 'primary.main'
                                    : 'divider',
                              }}
                            >
                              {pkg.popular && (
                                <Chip
                                  label='Phổ biến'
                                  color='warning'
                                  size='small'
                                  sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: 16,
                                  }}
                                />
                              )}
                              <CardContent>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                  }}
                                >
                                  <Box>
                                    <Typography variant='h6' component='h3'>
                                      {pkg.name}
                                    </Typography>
                                    <Typography
                                      variant='body2'
                                      color='text.secondary'
                                    >
                                      Thời gian: {pkg.duration}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant='h5'
                                    color='primary'
                                    fontWeight='bold'
                                  >
                                    {formatCurrency(pkg.price)}
                                  </Typography>
                                </Box>

                                <List dense>
                                  {pkg.features.map((feature, index) => (
                                    <ListItem
                                      key={index}
                                      sx={{ py: 0.5, px: 0 }}
                                    >
                                      <ListItemIcon sx={{ minWidth: 36 }}>
                                        <CheckCircle
                                          color='success'
                                          fontSize='small'
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={feature} />
                                    </ListItem>
                                  ))}
                                </List>
                              </CardContent>
                            </Card>
                          }
                          sx={{
                            margin: 0,
                            alignItems: 'flex-start',
                            '& .MuiRadio-root': { mt: 2, mr: 1 },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button variant='contained' onClick={handleNext} size='large'>
                  Tiếp tục
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 2: Payment Method */}
          {activeStep === 1 && (
            <Box>
              <Typography variant='h6' gutterBottom>
                Chọn phương thức thanh toán
              </Typography>

              <Controller
                name='paymentMethod'
                control={control}
                render={({ field }) => (
                  <FormControl
                    component='fieldset'
                    sx={{ width: '100%', mb: 3 }}
                  >
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value='credit_card'
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCard sx={{ mr: 1 }} />
                            Thẻ tín dụng/ghi nợ
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value='bank_transfer'
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountBalance sx={{ mr: 1 }} />
                            Chuyển khoản ngân hàng
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value='qr_code'
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <QrCode sx={{ mr: 1 }} />
                            Quét mã QR
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              {/* Credit Card Form */}
              {selectedPaymentMethod === 'credit_card' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant='h6' gutterBottom>
                    Thông tin thẻ
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <Controller
                      name='cardNumber'
                      control={control}
                      rules={{ required: 'Số thẻ là bắt buộc' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Số thẻ'
                          placeholder='1234 5678 9012 3456'
                          error={!!errors.cardNumber}
                          helperText={errors.cardNumber?.message}
                          fullWidth
                        />
                      )}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Controller
                        name='cardExpiry'
                        control={control}
                        rules={{ required: 'Ngày hết hạn là bắt buộc' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='MM/YY'
                            placeholder='12/25'
                            error={!!errors.cardExpiry}
                            helperText={errors.cardExpiry?.message}
                            sx={{ flex: 1 }}
                          />
                        )}
                      />

                      <Controller
                        name='cardCvv'
                        control={control}
                        rules={{ required: 'CVV là bắt buộc' }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='CVV'
                            placeholder='123'
                            error={!!errors.cardCvv}
                            helperText={errors.cardCvv?.message}
                            sx={{ flex: 1 }}
                          />
                        )}
                      />
                    </Box>

                    <Controller
                      name='cardName'
                      control={control}
                      rules={{ required: 'Tên chủ thẻ là bắt buộc' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Tên chủ thẻ'
                          placeholder='NGUYEN VAN A'
                          error={!!errors.cardName}
                          helperText={errors.cardName?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Box>
              )}

              {/* Bank Transfer Info */}
              {selectedPaymentMethod === 'bank_transfer' && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Thông tin chuyển khoản
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography>
                        <strong>Ngân hàng:</strong> Vietcombank
                      </Typography>
                      <Typography>
                        <strong>Số tài khoản:</strong> 1234567890
                      </Typography>
                      <Typography>
                        <strong>Chủ tài khoản:</strong> Car Marketplace Ltd
                      </Typography>
                      <Typography>
                        <strong>Nội dung:</strong> Thanh toan{' '}
                        {currentPackage?.name} - {listingId || 'NEWPOST'}
                      </Typography>
                      <Typography>
                        <strong>Số tiền:</strong>{' '}
                        {currentPackage && formatCurrency(currentPackage.price)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* QR Code Payment */}
              {selectedPaymentMethod === 'qr_code' && (
                <Card sx={{ mt: 3, textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Quét mã QR để thanh toán
                    </Typography>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
                    >
                      <img
                        src='/api/placeholder/200/200'
                        alt='QR Code'
                        style={{
                          width: 200,
                          height: 200,
                          border: '1px solid #ddd',
                        }}
                      />
                    </Box>
                    <Typography color='text.secondary'>
                      Sử dụng ứng dụng banking để quét mã QR
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
              >
                <Button onClick={handleBack} size='large'>
                  Quay lại
                </Button>
                <Button variant='contained' onClick={handleNext} size='large'>
                  Tiếp tục
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: Confirmation */}
          {activeStep === 2 && (
            <Box>
              <Typography variant='h6' gutterBottom>
                Xác nhận thanh toán
              </Typography>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Chi tiết đơn hàng
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Gói dịch vụ:</Typography>
                    <Typography fontWeight='bold'>
                      {currentPackage?.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Thời gian:</Typography>
                    <Typography>{currentPackage?.duration}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Phương thức thanh toán:</Typography>
                    <Typography>
                      {selectedPaymentMethod === 'credit_card' &&
                        'Thẻ tín dụng'}
                      {selectedPaymentMethod === 'bank_transfer' &&
                        'Chuyển khoản'}
                      {selectedPaymentMethod === 'qr_code' && 'Quét mã QR'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='h6'>Tổng cộng:</Typography>
                    <Typography variant='h6' color='primary' fontWeight='bold'>
                      {currentPackage && formatCurrency(currentPackage.price)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} size='large'>
                  Quay lại
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={isProcessing}
                  startIcon={
                    isProcessing ? <CircularProgress size={20} /> : <Payment />
                  }
                >
                  {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
                </Button>
              </Box>
            </Box>
          )}
        </form>
      </Paper>

      {/* Payment Success Dialog */}
      <Dialog open={paymentSuccess} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircle color='success' sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant='h5'>Thanh toán thành công!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant='body1' gutterBottom>
            Bài đăng của bạn đã được kích hoạt với gói{' '}
            <strong>{currentPackage?.name}</strong>
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Thời gian hiệu lực: {currentPackage?.duration}
          </Typography>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant='subtitle2' gutterBottom>
              Lợi ích bạn nhận được:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Chip icon={<Star />} label='Ưu tiên hiển thị' size='small' />
              <Chip icon={<TrendingUp />} label='Tăng lượt xem' size='small' />
              <Chip
                icon={<Visibility />}
                label='Thống kê chi tiết'
                size='small'
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button variant='outlined' startIcon={<Receipt />} sx={{ mr: 1 }}>
            Xem hóa đơn
          </Button>
          <Button variant='contained' onClick={handlePaymentComplete}>
            Về dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;
