import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getBalance, getAllUsers, getName } from '../service/api';

interface User {
  id: number | null;
  name: string;
  balance: number;
  username: string;
}

interface NameResponse {
  user: { username: string };
}

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<{ username: string }>({ username: '' });
  const [fromUser , setFromUser ]=useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/');
    } else {
      getBalance(token)
        .then(data => setBalance(data.balance))
        .catch(() => setError('Failed to fetch balance.'))
        .finally(() => setLoadingBalance(false));
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsersData(response.user);
      } catch {
        setError('Failed to fetch users.');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const token = Cookies.get('authToken');
        const response: NameResponse = await getName(token);
        setName(response.user);
        
        setFromUser(response.user._id);
        
      } catch {
        setError('Failed to fetch name.');
      }
    };
    fetchName();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = usersData.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSignOut = () => {
    Cookies.remove('authToken');
    navigate('/');
  };

  const handleSendMoney = (user: User) => {
    const state = {
      recipientName: user.username,
      fromAccountId: fromUser,
      toAccountId: user._id,
      senderName: name.username,
      senderBalance: balance
    };
    
    console.log(state); // Log the state before navigating
  
    navigate('/send', { state });
  };
  

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 h-screen w-full">
      <div className="flex justify-between w-full mb-6">
        <div className="text-lg font-bold">Payment Dashboard</div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {name.username[0]?.toUpperCase()}
          </div>
          <span className="ml-2">{name.username}</span>
          <button
            onClick={handleSignOut}
            className="ml-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
        <div className="text-xl font-bold">
          Balance: Rs {loadingBalance ? 'Loading...' : balance}
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="w-full mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full">
        {loadingUsers ? (
          <div>Loading users...</div>
        ) : (
          <ul className="space-y-4">
            {filteredUsers.map(user => (
              <li key={user.id ?? user.username} className="flex justify-between items-center bg-white shadow-md rounded-lg p-4">
                <span className="font-medium">{user.username}</span>
                <button
                  onClick={() => handleSendMoney(user)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Send Money
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
