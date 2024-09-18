import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendMoney } from '../service/api';
import Cookies from 'js-cookie';



interface LocationState {
  recipientName: string;
  recipientId: number | null;
  senderName: string;
  senderBalance: number | null;
  fromAccountId: number | null;
  toAccountId: number | null;
}

const SendMoney: React.FC<SendMoneyProps> = ({ onSend }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const navigate = useNavigate();
  const location = useLocation<LocationState>();
  const { recipientName, recipientId, senderName, senderBalance, fromAccountId, toAccountId } = location.state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === '' ? '' : Number(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof amount === 'number' && amount > 0) {
      const data = {
        fromAccountId,
        toAccountId,
        balance: amount,
      };
      console.log(data);
      const token = Cookies.get('authToken');
      try {
        const res = await sendMoney(data, token);
        console.log(res);
      
        navigate('/dashboard'); // Navigate after sending
      } catch (error) {
        console.error("Error sending money:", error);
      }
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Send Money</h2>
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {recipientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">To: {recipientName}</p>
            <p className="text-sm text-gray-600">Recipient</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">From: {senderName}</p>
          <p className="text-sm text-gray-600">Your Balance: Rs {senderBalance}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-xl">₹</span>
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleChange}
                placeholder="0"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                required
                min="0"
                step="0.01"
                max={senderBalance ?? undefined}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">INR</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
            >
              Send Money
            </button>
            <button
              type="button"
              className="w-full bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ml-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;
