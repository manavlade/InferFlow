import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
    Sparkles,
    Shield,
    Cloud,
    ArrowRight,
    Users,
    Layout,
    Lock,
    IndianRupee,
    ImageIcon,
    BarChart3,
    Phone,
    Mail,
    MapPin
} from "lucide-react";

export default function HomePage() {

    return (

        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

            {/* HERO SECTION */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                    grid
                    md:grid-cols-2
                    gap-12
                    items-center
                "
            >

                {/* LEFT */}

                <div>

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1
                            bg-blue-50
                            text-blue-600
                            rounded-full
                            text-sm
                            mb-4
                        "
                    >

                        <Sparkles className="h-4 w-4" />

                        Smart Turf Fund Management

                    </div>

                    <h1
                        className="
                            text-5xl
                            font-bold
                            leading-tight
                            text-gray-900
                        "
                    >

                        Manage tower contributions
                        <span className="text-blue-600">
                            {" "}the smart way.
                        </span>

                    </h1>

                    <p
                        className="
                            mt-6
                            text-gray-600
                            text-lg
                        "
                    >

                        A simple platform for tower members to upload
                        payment screenshots, track monthly turf
                        contributions, and manage shared funds
                        transparently.

                    </p>

                    <div className="mt-8 flex gap-4">

                        <Link to="/signup">

                            <Button
                                size="lg"
                                className="gap-2"
                            >

                                Get Started

                                <ArrowRight className="h-4 w-4" />

                            </Button>

                        </Link>

                        <Link to="/notes">

                            <Button
                                size="lg"
                                variant="outline"
                            >

                                View Contributions

                            </Button>

                        </Link>

                    </div>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-4
                        "
                    >

                        Built for apartment communities • Fast • Secure

                    </p>

                </div>

                {/* RIGHT */}

                <div className="relative">

                    <div
                        className="
                            absolute
                            -inset-4
                            bg-blue-100
                            blur-2xl
                            opacity-40
                            rounded-3xl
                        "
                    />

                    <div
                        className="
                            relative
                            bg-white
                            border
                            rounded-2xl
                            shadow-xl
                            p-6
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-6
                            "
                        >

                            <span className="font-semibold">
                                Monthly Contributions
                            </span>

                            <IndianRupee
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                "
                            />

                        </div>

                        <div className="space-y-4">

                            <div
                                className="
                                    p-4
                                    bg-gray-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>
                                    <p className="font-medium">
                                        Turf Contribution
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Rahul Sharma
                                    </p>
                                </div>

                                <span
                                    className="
                                        bg-green-100
                                        text-green-700
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    ₹500
                                </span>

                            </div>

                            <div
                                className="
                                    p-4
                                    bg-gray-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>
                                    <p className="font-medium">
                                        Turf Contribution
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Aman Verma
                                    </p>
                                </div>

                                <span
                                    className="
                                        bg-green-100
                                        text-green-700
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    ₹700
                                </span>

                            </div>

                            <div
                                className="
                                    p-4
                                    bg-gray-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>
                                    <p className="font-medium">
                                        Turf Contribution
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Team Fund
                                    </p>
                                </div>

                                <span
                                    className="
                                        bg-blue-100
                                        text-blue-700
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-semibold
                                    "
                                >
                                    ₹12,500
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ABOUT SECTION */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                "
            >

                <div
                    className="
                        text-center
                        max-w-3xl
                        mx-auto
                        mb-14
                    "
                >

                    <h2
                        className="
                            text-4xl
                            font-bold
                            text-gray-900
                        "
                    >
                        About The Platform
                    </h2>

                    <p
                        className="
                            mt-5
                            text-lg
                            text-gray-600
                        "
                    >

                        Managing turf contributions in WhatsApp chats
                        and Excel sheets becomes messy over time.
                        This platform simplifies everything by giving
                        your tower a centralized contribution system.

                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    <FeatureCard
                        icon={
                            <Users className="h-6 w-6 text-blue-600" />
                        }

                        title="Community Driven"

                        desc="Built specially for apartment towers and sports communities."
                    />

                    <FeatureCard
                        icon={
                            <ImageIcon className="h-6 w-6 text-blue-600" />
                        }

                        title="Screenshot Upload"

                        desc="Upload payment proof screenshots for complete transparency."
                    />

                    <FeatureCard
                        icon={
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        }

                        title="Contribution Tracking"

                        desc="Track total funds, monthly contributions, and participation easily."
                    />

                </div>

            </section>

            {/* GALLERY SECTION */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                "
            >

                <div className="text-center mb-14">

                    <h2
                        className="
                            text-4xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Turf Moments
                    </h2>

                    <p
                        className="
                            mt-4
                            text-gray-600
                            text-lg
                        "
                    >

                        Built for players. Built for the community.

                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    <img
                        src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop"

                        className="
                            h-72
                            w-full
                            object-cover
                            rounded-3xl
                            shadow-md
                        "
                    />

                    <img
                        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"

                        className="
                            h-72
                            w-full
                            object-cover
                            rounded-3xl
                            shadow-md
                        "
                    />

                    <img
                        src="https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1200&auto=format&fit=crop"

                        className="
                            h-72
                            w-full
                            object-cover
                            rounded-3xl
                            shadow-md
                        "
                    />

                </div>

            </section>

            {/* FEATURES */}

            <section
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                    py-20
                "
            >

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-center
                        mb-12
                    "
                >

                    Everything your community needs

                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                    <FeatureCard
                        icon={
                            <Layout className="h-6 w-6 text-blue-600" />
                        }

                        title="Organized Dashboard"

                        desc="Keep all contributions structured and easy to manage."
                    />

                    <FeatureCard
                        icon={
                            <Cloud className="h-6 w-6 text-blue-600" />
                        }

                        title="Cloud Storage"

                        desc="All payment screenshots remain safely stored online."
                    />

                    <FeatureCard
                        icon={
                            <Lock className="h-6 w-6 text-blue-600" />
                        }

                        title="Secure Access"

                        desc="JWT authentication keeps your contribution data safe."
                    />

                    <FeatureCard
                        icon={
                            <IndianRupee className="h-6 w-6 text-blue-600" />
                        }

                        title="Fund Transparency"

                        desc="Everyone can track contributions and fund usage clearly."
                    />

                    <FeatureCard
                        icon={
                            <Sparkles className="h-6 w-6 text-blue-600" />
                        }

                        title="Modern UI"

                        desc="Simple, clean, and mobile-friendly design for everyone."
                    />

                    <FeatureCard
                        icon={
                            <Shield className="h-6 w-6 text-blue-600" />
                        }

                        title="Reliable System"

                        desc="Built with modern technologies for stability and performance."
                    />

                </div>

            </section>

            {/* CONTACT */}

            <section
                className="
                    bg-blue-600
                    text-white
                    py-20
                    mt-10
                "
            >

                <div
                    className="
                        max-w-5xl
                        mx-auto
                        px-6
                        grid
                        md:grid-cols-2
                        gap-12
                        items-center
                    "
                >

                    <div>

                        <h2
                            className="
                                text-4xl
                                font-bold
                            "
                        >
                            Contact Us
                        </h2>

                        <p
                            className="
                                mt-5
                                text-blue-100
                                text-lg
                            "
                        >

                            Want to implement this for your tower
                            or community? Reach out to us.

                        </p>

                    </div>

                    <div className="space-y-5">

                        <div className="flex items-center gap-4">

                            <Mail className="h-5 w-5" />

                            <span>
                                support@towerfunds.com
                            </span>

                        </div>

                        <div className="flex items-center gap-4">

                            <Phone className="h-5 w-5" />

                            <span>
                                +91 9876543210
                            </span>

                        </div>

                        <div className="flex items-center gap-4">

                            <MapPin className="h-5 w-5" />

                            <span>
                                Virar, Maharashtra, India
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            {/* FOOTER */}

            <footer
                id="footer"

                className="
                    py-10
                    text-center
                    text-gray-500
                    text-sm
                "
            >

                © {new Date().getFullYear()}
                {" "}
                Tower Contributions Platform.
                Built with ❤️ using React, Node.js, Prisma & Supabase.

            </footer>

        </div>
    );
}

/* FEATURE CARD */

function FeatureCard({
    icon,
    title,
    desc
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {

    return (

        <div
            className="
                p-6
                border
                rounded-xl
                bg-white
                hover:shadow-md
                transition
            "
        >

            <div className="mb-3">
                {icon}
            </div>

            <h3
                className="
                    font-semibold
                    text-lg
                "
            >
                {title}
            </h3>

            <p
                className="
                    text-gray-600
                    text-sm
                    mt-2
                "
            >
                {desc}
            </p>

        </div>
    );
}