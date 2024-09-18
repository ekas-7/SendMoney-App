import axios from 'axios';

const URL: string = "http://localhost:3000";

interface SignupData {
  name: string;
  username: string;
  password: string;
}
interface SigninData {
    
    username: string;
    password: string;
  }

export const signup = async (data: SignupData) => {
  try {
    const response = await axios.post(`${URL}/api/user/signup`, data);
   
    return response.data;
  } catch (error: any) {
    console.error('Error during signup:', error.message);
    throw error;
  }
};

export const signin = async (data: SigninData) => {
    try {
      const response = await axios.post(`${URL}/api/user/signin`, data);
     
      return response.data;
    } catch (error: any) {
      console.error('Error during signup:', error.message);
      throw error;
    }
  };

  export const getBalance = async (token: string) => {
    try {
      const response = await axios.get(`${URL}/api/transfer/getBalance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error during getting balance:', error.message);
      throw error;
    }
  };

  export const getAllUsers = async () => {
    try {
      const response = await axios.get(`${URL}/api/update/allUsers`);
        
      return response.data; 
    } catch (error: any) {
      console.error('Error fetching all users:', error.message);
      throw error; // Rethrow the error for handling in the calling component
    }
  };

  export const getName = async (token: string) => {
    try {
      const response = await axios.get(`${URL}/api/transfer/getName`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error during getting balance:', error.message);
      throw error;
    }
  };

  export const sendMoney = async (data: any, token: string): Promise<any> => {
    try {
      const response = await axios.put(`${URL}/api/transfer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      return response.data;
    } catch (error: any) {
      // Handle error more explicitly
      if (axios.isAxiosError(error)) {
        console.error('Error during money transfer:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; // Optional: re-throw the error if you want to handle it further up
    }
  };