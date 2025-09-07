import React, { useState, useEffect } from 'react';
import DeveloperWorkspace from '../../components/developer/DeveloperWorkspace';

const Developer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return <DeveloperWorkspace user={user} />;
};

export default Developer;