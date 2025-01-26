// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for your user data
type User = {
  username: string;
  // Add other user properties as needed
};

// Define the context type
type UserContextType = {
  user: User | null; // The user object can either be null or a valid user
  setUser: (user: User) => void; // Function to set the user
};

// Create the context with an initial value of null for user and a no-op function for setUser
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State to hold the user

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
