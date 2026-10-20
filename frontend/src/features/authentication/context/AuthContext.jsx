import {
    useEffect,
    useRef,
    useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from './auth-context';
import api from '../../../lib/axios';

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
    const [checkedPathname, setCheckedPathname] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const authCheckId = useRef(0);

    const isPublicPage = publicAuthPages.includes(pathname);

    const loading =
        !isPublicPage && checkedPathname !== pathname;

    useEffect(() => {
        const checkId = ++authCheckId.current;
        let isActive = true;

        if (publicAuthPages.includes(pathname)) {
            return () => {
                isActive = false;
            };
        }

        api.get('/api/user')
            .then((response) => {
                if (isActive && authCheckId.current === checkId) {
                    setUser(response.data);
                }
            })
            .catch((error) => {
                if (!isActive || authCheckId.current !== checkId) {
                    return;
                }

                if (error.response?.status !== 401) {
                    console.error(
                        'Unable to verify authentication:',
                        error,
                    );
                }

                setUser(null);
            })
            .finally(() => {
                if (isActive && authCheckId.current === checkId) {
                    setCheckedPathname(pathname);
                }
            });

        return () => {
            isActive = false;
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
