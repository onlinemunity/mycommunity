
import React from 'react';
import { Layout } from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  ArrowRight, 
  ShoppingBag, 
  Calendar 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

const Cart = () => {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Layout>
      <div className="page-transition py-16 md:py-24 container">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-accent1" />
            <h1 className="text-3xl font-bold">Your Cart</h1>
          </div>

          {items.length === 0 ? (
            <Card className="border border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Looks like you haven't added anything to your cart yet
                  </p>
                  <Link to="/pricing">
                    <Button className="button-primary">
                      Browse Membership Options
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cart Items ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 bg-accent1/10 text-accent1 rounded-full flex items-center justify-center">
                            {item.type === 'yearly_membership' ? (
                              <Calendar className="h-5 w-5" />
                            ) : (
                              <CreditCard className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${item.price}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={clearCart}>
                      Clear Cart
                    </Button>
                    <Link to="/pricing">
                      <Button variant="ghost">Continue Shopping</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                      <Separator className="my-3" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full button-primary flex items-center gap-2" 
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
