import { createContext, useContext, useMemo, useState } from 'react';

const UserContext = createContext({ user: null, setUser: () => { } })

const UserProvider = ({ children }) => {
    const localUser = useMemo(() => localStorage.getItem('user'), []);
    const [user, setUser] = useState(!!localUser ? JSON.parse(localUser) : null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;