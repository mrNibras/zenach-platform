import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

jest.mock('../../contexts/AuthContext');
jest.mock('../../services/api');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RegisterPage', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  it('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), {
      target: { value: 'password123', name: 'password' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: 'different', name: 'confirmPassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('shows error if password is too short', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), {
      target: { value: '123', name: 'password' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: '123', name: 'confirmPassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('calls register API and redirects on success', async () => {
    (authAPI.register as jest.Mock).mockResolvedValueOnce({
      data: { _id: 'new-id', name: 'Jane Doe', email: 'jane@test.com', role: 'user', token: 'new-token' }
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your full name/i), { target: { value: 'Jane Doe', name: 'name' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'jane@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/Create a password/i), { target: { value: 'password123', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123', name: 'confirmPassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(authAPI.register).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});