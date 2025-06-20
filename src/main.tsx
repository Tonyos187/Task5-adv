import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import DashboardLayout from './layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import EditProduct from './pages/dashboard/EditProduct';
import ViewProduct from './pages/dashboard/ViewProduct';
import AddProduct from './pages/dashboard/AddProduct';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/signin" /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'edit/:id', element: <EditProduct /> },
      { path: 'view/:id', element: <ViewProduct /> },
      { path: 'add-item', element: <AddProduct /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);