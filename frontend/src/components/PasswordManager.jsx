import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PasswordManager() {
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePassword, setVisiblePassword] = useState({});
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchStoredPasswords();
    }
  }, [userId]);

  const fetchStoredPasswords = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/passwords/${userId}`);
      setPasswords(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const generatePassword = () => {
    const charset = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      digits: '0123456789',
      special: '!@#$%^&*()',
    };

    let newPassword = '';
    newPassword += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
    newPassword += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
    newPassword += charset.digits.charAt(Math.floor(Math.random() * charset.digits.length));
    newPassword += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

    const allChars = charset.lowercase + charset.uppercase + charset.digits + charset.special;
    for (let i = 4; i < 12; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    setPassword(newPassword);
  };

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(pwd);
  };

  const storePassword = async () => {
    if (!website || !password) {
      alert('Please enter a website and generate a password.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/passwords', { userId, website, password });
      fetchStoredPasswords();
      setWebsite('');
      setPassword('');
    } catch (error) {
      console.error('Error storing password:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleVisibility = (id) => {
    setVisiblePassword((prevVisiblePassword) => ({
      ...prevVisiblePassword,
      [id]: !prevVisiblePassword[id],
    }));
  };

  const filteredPasswords = passwords.filter((p) =>
    p.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container3">
      <h2>Password Manager</h2>

      <div>
        <label>Website:</label>
        <input 
          type="text" 
          value={website} 
          onChange={(e) => setWebsite(e.target.value)} 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="text" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button onClick={generatePassword}>
        Generate Password
      </button>
      <button onClick={storePassword}>
        Store Password
      </button>
      {/* <div className='container4'> */}
      <div>
        <label>Search by Website:</label>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <h3>Stored Passwords</h3>
      <ul>
        {filteredPasswords.map((p) => (
          <li key={p._id}>
            {p.website}: 
            <input
              type={visiblePassword[p._id] ? 'text' : 'password'}
              value={p.password}
              readOnly
            />
            <button onClick={() => toggleVisibility(p._id)}>
              {visiblePassword[p._id] ? 'Hide' : 'Show'}
            </button>
          </li>
        ))}
      </ul>
      <center><button onClick={handleLogout}>Logout</button></center>
    </div>
    // </div>
  );
}

export default PasswordManager;
