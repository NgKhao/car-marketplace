import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Report,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Person,
} from '@mui/icons-material';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import type { Report as ReportType } from '../types';

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getUserReports, getReportsAgainstUser, getReportReasons } =
    useReportStore();

  const [tabValue, setTabValue] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [reportDetailOpen, setReportDetailOpen] = useState(false);

  const userReports = user ? getUserReports(user.id) : [];
  const reportsAgainstUser = user ? getReportsAgainstUser(user.id) : [];
  const reportReasons = getReportReasons();

  const getStatusColor = (status: ReportType['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'investigating':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ReportType['status']) => {
    switch (status) {
      case 'pending':
        return <Warning />;
      case 'investigating':
        return <Visibility />;
      case 'resolved':
        return <CheckCircle />;
      case 'dismissed':
        return <Cancel />;
      default:
        return <Warning />;
    }
  };

  const getStatusText = (status: ReportType['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'investigating':
        return 'Đang xem xét';
      case 'resolved':
        return 'Đã giải quyết';
      case 'dismissed':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reasonId: string) => {
    const reason = reportReasons.find((r) => r.id === reasonId);
    return reason ? reason.label : reasonId;
  };

  const handleViewReport = (report: ReportType) => {
    setSelectedReport(report);
    setReportDetailOpen(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='warning'>Bạn cần đăng nhập để xem báo cáo.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Quản lý báo cáo
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label={`Báo cáo đã gửi (${userReports.length})`}
            icon={<Report />}
            iconPosition='start'
          />
          <Tab
            label={`Báo cáo nhận được (${reportsAgainstUser.length})`}
            icon={<Person />}
            iconPosition='start'
          />
        </Tabs>
      </Box>

      {/* Reports Submitted by User */}
      <TabPanel value={tabValue} index={0}>
        {userReports.length > 0 ? (
          <List>
            {userReports.map((report, index) => (
              <React.Fragment key={report.id}>
                <ListItem
                  sx={{
                    px: 0,
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                    borderRadius: 1,
                  }}
                  onClick={() => handleViewReport(report)}
                >
                  <ListItemIcon>{getStatusIcon(report.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant='subtitle1'>
                          Báo cáo{' '}
                          {report.reportedType === 'seller'
                            ? 'người bán'
                            : 'người mua'}
                        </Typography>
                        <Chip
                          label={getStatusText(report.status)}
                          color={getStatusColor(report.status)}
                          size='small'
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant='body2' color='text.secondary'>
                          Lý do: {getReasonLabel(report.reason)}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatDate(report.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < userReports.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Report sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant='h6' color='text.secondary' gutterBottom>
              Chưa có báo cáo nào
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Bạn chưa gửi báo cáo nào về người bán hoặc người mua.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Reports Against User */}
      <TabPanel value={tabValue} index={1}>
        {reportsAgainstUser.length > 0 ? (
          <Box>
            <Alert severity='info' sx={{ mb: 3 }}>
              Đây là các báo cáo mà người khác đã gửi về bạn. Vui lòng xem xét
              và cải thiện dịch vụ của mình.
            </Alert>

            <List>
              {reportsAgainstUser.map((report, index) => (
                <React.Fragment key={report.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer',
                      borderRadius: 1,
                    }}
                    onClick={() => handleViewReport(report)}
                  >
                    <ListItemIcon>{getStatusIcon(report.status)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant='subtitle1'>
                            Báo cáo từ khách hàng
                          </Typography>
                          <Chip
                            label={getStatusText(report.status)}
                            color={getStatusColor(report.status)}
                            size='small'
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            Lý do: {getReasonLabel(report.reason)}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {formatDate(report.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < reportsAgainstUser.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant='h6' color='text.secondary' gutterBottom>
              Chưa có báo cáo nào
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tuyệt vời! Chưa có ai báo cáo về bạn.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Report Detail Dialog */}
      <Dialog
        open={reportDetailOpen}
        onClose={() => setReportDetailOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Card variant='outlined' sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant='h6'>
                      Báo cáo{' '}
                      {selectedReport.reportedType === 'seller'
                        ? 'người bán'
                        : 'người mua'}
                    </Typography>
                    <Chip
                      label={getStatusText(selectedReport.status)}
                      color={getStatusColor(selectedReport.status)}
                      size='small'
                    />
                  </Box>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                  >
                    <strong>Lý do:</strong>{' '}
                    {getReasonLabel(selectedReport.reason)}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                  >
                    <strong>Thời gian:</strong>{' '}
                    {formatDate(selectedReport.createdAt)}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                  >
                    <strong>Mô tả:</strong>
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}
                  >
                    {selectedReport.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDetailOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsPage;
