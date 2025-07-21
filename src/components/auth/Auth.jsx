import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import 'react-phone-input-2/lib/style.css';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone' | 'google'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();

  const handleGoogleSuccess = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        setError('');
        await loginWithGoogle(response.access_token);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      setError('Google login failed: ' + error.message);
    }
  });

  const validationSchema = Yup.object({
    email: authMethod === 'email' ? Yup.string().email('Invalid email').required('Email is required') : Yup.string(),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    username: !isLogin ? Yup.string().required('Username is required') : Yup.string(),
    phone: authMethod === 'phone' ? Yup.string().required('Phone number is required') : Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        if (isLogin) {
          await login({
            email: values.email,
            password: values.password,
          });
        } else {
          await register({
            username: values.username,
            email: values.email,
            password: values.password,
            phone: values.phone,
          });
        }
        navigate('/');
      } catch (err) {
        setError(err.message || 'Authentication failed');
      }
    },
  });

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    handleGoogleSuccess();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    formik.resetForm();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <img src="/spotify-logo.svg" alt="Spotify" className="auth-logo" />
          <h2>{isLogin ? 'Log in to Spotify' : 'Sign up for Spotify'}</h2>
        </div>

        <div className="auth-methods">
          <button
            className={`auth-method-btn ${authMethod === 'google' ? 'active' : ''}`}
            onClick={handleGoogleLogin}
          >
            <i className="fab fa-google"></i>
            Continue with Google
          </button>

          <div className="auth-separator">
            <span>or</span>
          </div>

          <div className="auth-method-toggle">
            <button
              className={`toggle-btn ${authMethod === 'email' ? 'active' : ''}`}
              onClick={() => setAuthMethod('email')}
            >
              Email
            </button>
            <button
              className={`toggle-btn ${authMethod === 'phone' ? 'active' : ''}`}
              onClick={() => setAuthMethod('phone')}
            >
              Phone Number
            </button>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="error-message">{formik.errors.username}</div>
              )}
            </div>
          )}

          {authMethod === 'email' && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
            </div>
          )}

          {authMethod === 'phone' && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <PhoneInput
                country={'us'}
                value={formik.values.phone}
                onChange={(phone) => formik.setFieldValue('phone', phone)}
                inputProps={{
                  id: 'phone',
                  required: true,
                }}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error-message">{formik.errors.phone}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
          )}

          {error && (
            <div className="error-banner">{error}</div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="toggle-auth-btn" onClick={toggleAuthMode}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
