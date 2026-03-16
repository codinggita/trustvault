import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../../store/authSlice';

const ErrorToast = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleClose = (reason) => {
    if (reason === 'timeout' || reason === 'clickaway') {
      dispatch(clearError());
    }
  };

  if (!error) {
    return null;
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={Boolean(error)}
      autoHideDuration={5000}
      onClose={handleClose}
      clickawayAction={false}
    >
      <Alert onClose={() => {}} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorToast;