
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setItems([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (item: CartItem) => {
    // Check if item is already in cart
    if (items.some(cartItem => cartItem.id === item.id)) {
      toast({
        title: "Item already in cart",
        description: `${item.name} is already in your cart.`,
      });
      return;
    }
    
    // For membership items, only allow one membership type at a time
    if (item.type.includes('membership')) {
      const existingMembership = items.find(i => i.type.includes('membership'));
      if (existingMembership) {
        setItems(prev => [
          ...prev.filter(i => !i.type.includes('membership')),
          item
        ]);
        toast({
          title: "Cart updated",
          description: `Replaced ${existingMembership.name} with ${item.name}`,
        });
        return;
      }
    }
    
    setItems(prev => [...prev, item]);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`
    });
  };
  
  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart."
    });
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart."
    });
  };
  
  const totalItems = items.length;
  
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  const isInCart = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
