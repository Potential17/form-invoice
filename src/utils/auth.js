export const setUserSession = (username) => {
  localStorage.setItem('user', JSON.stringify({ username, isAuthenticated: true }));
};

export const getUserSession = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const clearUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('invoiceForm');
};