import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import login from "@/api/auth/login";

export default function LoginPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const result = await login(
                form.email,
                form.password
            );

            if (result.success) {
                navigate("/");
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error("Login error:", error);
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
                    alt="login"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-4xl font-bold leading-tight">
                        Welcome back to your workspace
                    </h1>

                    <p className="mt-4 text-lg text-gray-200">
                        Access your notes, ideas, and productivity tools instantly.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="p-8">

                        <h2 className="text-3xl font-bold text-center mb-2">
                            Welcome Back
                        </h2>

                        <p className="text-center text-gray-500 mb-6">
                            Login to continue managing your notes
                        </p>

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
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
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
                                        setForm({
                                            ...form,
                                            password: e.target.value
                                        })
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
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
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        {/* SIGNUP LINK */}
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Don&apos;t have an account?{" "}
                            <a
                                href="/signup"
                                className="text-blue-600 hover:underline"
                            >
                                Create account
                            </a>
                        </p>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}