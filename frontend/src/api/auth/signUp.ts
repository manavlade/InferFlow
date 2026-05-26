export default async function signUp(name: string, email: string, password: string){
    try {
        if(!name || !email || !password){
            return {
                success: false,
                message: "All fields are required"
            }
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if(!response.ok){
            return {
                success: false,
                message: data.message || "Registration failed"
            }
        }

        return {
            success: true,
            message: data.message || "Registration successful",
            user: data.user
        }
        
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: "Network error. Please try again later."
        }
        
    }
}