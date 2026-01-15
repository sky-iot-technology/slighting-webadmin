export const auth = {
  title: 'Sign In',
  label: {
    username: 'Username',
    password: 'Password',
    remember_me: 'Remember me'
  },
  placeholder: {
    username: 'Enter username',
    password: 'Enter password'
  },
  button: {
    login: 'Login',
    logging_in: 'Logging in...'
  },
  validation: {
    username_required: 'Username is required',
    username_min: 'Username must be at least 3 characters',
    password_required: 'Password is required',
    password_min: 'Password must be at least 6 characters',
    password_regex:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    confirm_password_required: 'Confirm password is required',
    terms_required: 'You must agree to the terms of use',
    passwords_mismatch: 'Passwords do not match',
    name_required: 'Full name is required',
    name_min: 'Full name must be at least 2 characters',
    email_required: 'Email is required',
    email_invalid: 'Invalid email'
  }
};
