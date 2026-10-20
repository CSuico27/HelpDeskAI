
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../lib/axios';

const AuthContext = createContext(null);

const publicAuthPages = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
];

export function AuthProvider({ children }) {
    const { pathname } = useLocation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const authCheckId = useRef(0);

    useEffect(() => {
        const checkId = ++authCheckId.current;

        if (publicAuthPages.includes(pathname)) {
            setLoading(false);
            return;
        }

        setLoading(true);

        api.get('/api/user')
            .then((response) => {
                if (authCheckId.current === checkId) {
                    setUser(response.data);
                }
            })
            .catch((error) => {
                if (authCheckId.current !== checkId) return;

                if (error.response?.status !== 401) {
                    console.error('Unable to verify authentication:', error);
                }

                setUser(null);
            })
            .finally(() => {
                if (authCheckId.current === checkId) {
                    setLoading(false);
                }
            });

        return () => {
            authCheckId.current++;
        };
    }, [pathname]);

    async function logout() {
        if (loggingOut) return;

        authCheckId.current++;
        setLoggingOut(true);

        try {
            await api.post('/api/logout');
            setUser(null);
        } catch (error) {
            console.error(
                'Logout failed:',
                error.response?.status,
                error.response?.data,
            );
            alert('Could not log out. Please try again.');
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, logout, loggingOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
