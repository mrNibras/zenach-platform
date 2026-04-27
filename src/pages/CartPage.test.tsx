import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../CartPage';
import { useCart } from '../../contexts/CartContext';

// Mock the useCart context hook
jest.mock('../../contexts/CartContext');

describe('CartPage', () => {
  const mockRemoveItem = jest.fn();
  const mockUpdateQuantity = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart state correctly', () => {
    (useCart as jest.Mock).mockReturnValue({
      items: [],
      totalPrice: 0,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start Shopping/i })).toHaveAttribute('href', '/products');
  });

  it('renders cart items and summary correctly when populated', () => {
    const mockItems = [
      {
        _id: 'item-1-size-40',
        productId: '1',
        name: 'Zenach Air Max',
        price: 100.00,
        quantity: 2,
        size: 40,
        imageUrl: 'test.jpg',
      },
    ];

    (useCart as jest.Mock).mockReturnValue({
      items: mockItems,
      totalPrice: 200.00,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Zenach Air Max')).toBeInTheDocument();
    expect(screen.getByText('Size: 40')).toBeInTheDocument();
    // Check for calculated prices ($200.00 should appear for item total and order total)
    const priceElements = screen.getAllByText('$200.00');
    expect(priceElements.length).toBeGreaterThanOrEqual(2);
    
    expect(screen.getByRole('link', { name: /Proceed to Checkout/i })).toHaveAttribute('href', '/checkout');
  });

  it('calls updateQuantity when clicking increment and decrement buttons', () => {
    const mockItems = [
      {
        _id: 'item-1',
        name: 'Test Shoe',
        price: 50,
        quantity: 2,
        size: 42,
        imageUrl: 'test.jpg',
      },
    ];

    (useCart as jest.Mock).mockReturnValue({
      items: mockItems,
      totalPrice: 100,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
    });

    const { container } = render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Find buttons within the quantity selector
    const buttons = container.querySelectorAll('button');
    // Based on CartPage.tsx structure: buttons[0] is Minus, buttons[1] is Plus, buttons[2] is Trash
    
    fireEvent.click(buttons[0]); // Decrement
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', 1);

    fireEvent.click(buttons[1]); // Increment
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', 3);
  });
});