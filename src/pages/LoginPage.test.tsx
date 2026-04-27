import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

// Mock the hooks and API
jest.mock('../../contexts/AuthContext');
jest.mock('../../services/api');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { from: { pathname: '/checkout' } }
  }),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  it('renders login form and demo credentials', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    (authAPI.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('calls login context and navigates on successful user login', async () => {
    const mockUser = { _id: '1', name: 'User', email: 'user@test.com', role: 'user', token: 'fake-token' };
    (authAPI.login as jest.Mock).mockResolvedValueOnce({ data: mockUser });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { _id: '1', name: 'User', email: 'user@test.com', role: 'user' },
        'fake-token'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/checkout', { replace: true });
    });
  });

  it('navigates to admin dashboard on admin login', async () => {
    (authAPI.login as jest.Mock).mockResolvedValueOnce({ 
      data: { _id: '2', role: 'admin', token: 'admin-token' } 
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });
});