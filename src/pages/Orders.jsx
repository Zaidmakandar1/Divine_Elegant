import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch your orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Could not load orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">You have no orders yet.</p>
            <button onClick={() => navigate('/shop')} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Order ID</div>
                    <div className="font-semibold">#{order._id.slice(-8)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Placed on</div>
                    <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="mt-4 divide-y">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product?.name || 'Item'} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium">{item.product?.name || 'Product'}</div>
                          <div className="text-sm text-gray-600">{item.variant?.size} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600 capitalize">Status: {order.status}</div>
                  <div className="text-lg font-semibold">Total: ₹{Number(order.totalPrice).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;


