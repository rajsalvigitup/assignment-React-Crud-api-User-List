import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';

const App = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.org/users');
        setUsers(response.data.map(user => ({ ...user, editMode: false, editData: {} })));
        
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Function to update user data
  const handleUpdateUser = (userId, updatedData) => {
    axios.put(`https://jsonplaceholder.org/users/${userId}`, updatedData)
      .then(response => {
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, ...updatedData, editMode: false, editData: {} } : user
        );
        setUsers(updatedUsers);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  // Function to delete a user
  const handleDeleteUser = (userId) => {
    axios.delete(`https://jsonplaceholder.org/users/${userId}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  // Logic to paginate users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1 className="text-center">User List</h1>
      <UserTable
        users={currentUsers}
        error={error}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default App;
