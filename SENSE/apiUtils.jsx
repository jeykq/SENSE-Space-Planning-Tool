const useAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const getHeaders = () => {
    const token = useAuthToken();
  
    if (!token) {
      return null;
    }
  
    return {
      'Content-Type': 'application/json',
      'sense-token': token
    };
  };
  