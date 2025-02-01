import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { InvoiceForm } from './components/InvoiceForm';
import { getUserSession } from './utils/auth';

const PrivateRoute = ({ children }) => {
  const user = getUserSession();
  return user?.isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/invoice"
          element={
            <PrivateRoute>
              <InvoiceForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;