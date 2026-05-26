import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    loginUser: (user: User) => void;
    logoutUser: () => void;
    fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loginUser = (userData: User) => {
        setUser(userData);
    };

    const logoutUser = async () => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
    };

    const fetchUser = async () => {
        try {

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/me`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!res.ok) {
                setUser(null);
                return;
            }

            const data = await res.json();

            setUser(data.user);

        } catch (error) {
            console.log("fetchUser error:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            loginUser,
            logoutUser,
            fetchUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}