export default async function login(email: string, password: string) {

    if (!email || !password) {
        return {
            success: false,
            statusCode: 400,
            message: "All fields are required"
        };
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                statusCode: response.status,
                message: data.message || "Login failed"
            };
        }

        return {
            success: true,
            statusCode: response.status,
            message: data.message,
            user: data.user
        };

    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            statusCode: 500,
            message: "Network error. Please try again later."
        };
    }
}