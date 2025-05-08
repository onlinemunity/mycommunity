
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Register = () => {
  useEffect(() => {
    console.log('Redirecting from /register to /auth');
  }, []);

  return <Navigate to="/auth" replace />;
};

export default Register;
