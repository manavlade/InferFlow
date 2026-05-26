import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: '/dashboard' },
    ];

    return (
        <nav className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex items-center gap-2">
                        <NotebookPen className="h-7 w-7 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            InferFlow
                        </span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center gap-8">

                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-7 w-7" />
                        ) : (
                            <Menu className="h-7 w-7" />
                        )}
                    </button>

                </div>
            </div>

            {/* MOBILE SIDEBAR */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-[280px]
                    bg-white shadow-2xl z-50
                    transform transition-transform duration-300 ease-in-out
                    md:hidden
                    ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >

                {/* TOP */}
                <div className="flex items-center justify-between p-5 border-b">
                    <div className="flex items-center gap-2">
                        <NotebookPen className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg">
                            NotesApp
                        </span>
                    </div>

                    <button onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* LINKS */}
                <div className="flex flex-col p-5 gap-5">

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-gray-700 hover:text-blue-600 font-medium text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* STATIC AUTH */}
                    <div className="border-t pt-4 mt-4 flex flex-col gap-3">

                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Button variant="outline" className="w-full">
                                Login
                            </Button>
                        </Link>

                        <Link
                            to="/signup"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Button className="w-full">
                                Sign Up
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>

            {/* BACKDROP */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

        </nav>
    );
}