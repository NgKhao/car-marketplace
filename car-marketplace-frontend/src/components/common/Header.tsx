import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle, DirectionsCar } from '@mui/icons-material';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <DirectionsCar sx={{ mr: 2 }} />
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            Car Marketplace
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color='inherit' component={Link} to='/cars'>
            Xe đang bán
          </Button>
          <Button color='inherit' component={Link} to='/sell'>
            Đăng bán
          </Button>

          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/login');
              }}
            >
              Đăng nhập
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/register');
              }}
            >
              Đăng ký
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/seller-dashboard');
              }}
            >
              Bảng điều khiển
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
