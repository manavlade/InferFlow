import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import signUp from "@/api/auth/signUp";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function SignUpPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const result = await signUp(
                form.name,
                form.email,
                form.password
            );

            if (result.success) {
                navigate("/login");
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">

            <div className="hidden lg:flex w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                    alt="signup"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-4xl font-bold leading-tight">
                        Organize your thoughts effortlessly
                    </h1>
                    <p className="mt-4 text-lg text-gray-200">
                        Create notes, manage ideas, and stay productive every day.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="p-8">

                        <h2 className="text-3xl font-bold text-center mb-2">
                            Create Account
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            Sign up to start managing your notes
                        </p>

                        {/* NAME */}
                        <div className="space-y-2 mb-4">
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-2 mb-4">
                            <Label>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type="email"
                                    className="pl-10"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-2 mb-4">
                            <Label>Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <Button
                            className="w-full mt-4"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                        {/* LOGIN LINK */}
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </a>
                        </p>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}