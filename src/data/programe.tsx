import { SiReact, SiExpress, SiMongodb, SiPostgresql, SiJavascript, SiTypescript, SiTailwindcss } from "react-icons/si";
import {FaJava, FaNodeJs} from "react-icons/fa";

const programs = [
    {
        id: "Advanced frontend Development",
        title: "Advanced frontend Development",
        description: "Learn to build beautiful, responsive, and interactive user interfaces using modern frontend technologies.",
        image: "/images/frontend.jpg",
        icon: SiReact,
        color: "from-blue-500 to-indigo-500",
        languages: [
            { name: "React", icon: SiReact },
            // { name: "Next.js", icon: SiNextDotJs },
            { name: "JavaScript", icon: SiJavascript },
            { name: "TypeScript", icon: SiTypescript },
            { name: "Tailwind CSS", icon: SiTailwindcss },
        ],
        duration: "12 weeks",
        schedule: "Monday - Friday, 8:00 AM - 3:00 PM",
    },
    {
        id: "Advanced Backend Development",
        title: "Advanced Backend Development",
        description: "Master server-side development, databases, and API creation for robust applications.",
        image: "/images/backend.jpg",
        icon: FaJava,
        color: "from-amber-500 to-orange-500",
        languages: [
            // { name: "Java", icon: SiJava },
            // { name: "Node.js", icon: SiNodeDotJs },
            { name: "Express", icon: SiExpress },
            { name: "MongoDB", icon: SiMongodb },
            { name: "PostgreSQL", icon: SiPostgresql },
            { name: "React", icon: SiReact }, // optional if backend interacts with frontend
        ],
        duration: "16 weeks",
        schedule: "Monday - Friday, 8:20 AM - 4:30 PM",
    },
    {
        id: "Web Fundamentals",
        title: "Web Fundamentals",
        description: "Become a fullstack developer by combining frontend and backend skills to build complete web applications.",
        image: "/images/webfundamental.jpg",
        icon: FaNodeJs,
        color: "from-purple-500 to-pink-500",
        languages: [
            { name: "React", icon: SiReact },
            // { name: "Node.js", icon: SiNodeDotJs },
            { name: "Express", icon: SiExpress },
            { name: "MongoDB", icon: SiMongodb },
            { name: "PostgreSQL", icon: SiPostgresql },
            { name: "TypeScript", icon: SiTypescript },
        ],
        duration: "20 weeks",
        schedule: "Monday - Friday, 8:00 AM - 5:00 PM",
    },

];

export default programs;
