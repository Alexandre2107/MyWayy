import { IAuthenticateUserResponse, IUser } from '@/interface/User';
import { authenticateUser } from '@/requests/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface SessionContextType {
    user: IUser | null;
    login: (email: string, password: string) => Promise<IUser | null>;
    logout: () => Promise<void>;
    isLoggedIn: () => boolean;
    getUser: () => IUser | null;
    isStudent: () => boolean;
    getToken: () => string
    getRoutineId: () => number | null
    updateUser: (updatedUser: Partial<IUser>) => void
    setRoutine: (id: number) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [routineId, setRoutineId] = useState<number | null>(null);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response: IAuthenticateUserResponse = await authenticateUser({ email, password });

            setToken(response.token)
            AsyncStorage.setItem("token", response.token);

            setUser(response.user);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));

            return response.user;
        } catch (error) {
            Alert.alert('Erro de Login', 'Ocorreu um erro durante o login.');
            console.log(error)
            return null;
        }
    };

    const updateUser = (updatedUser: Partial<IUser>) => {
        if (user) {
            const updatedUserData = { ...user, ...updatedUser };
            setUser(updatedUserData);
            AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    const getToken = () => {
        return token;
    };

    const isLoggedIn = () => {
        return user !== null;
    };

    const getUser = () => {
        return user;
    };

    const setRoutine = (id: number) => {
        setRoutineId(id)
    }

    const getRoutineId = () => {
        return routineId
    }

    const isStudent = () => {
        if (user?.type_of_user === 'student') {
            return true
        }
        return false
    }

    return (
        <SessionContext.Provider value={{ user, login, logout, isLoggedIn, getUser, isStudent, updateUser, getToken, setRoutine, getRoutineId }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession deve ser usado dentro de um SessionProvider');
    }
    return context;
};
