import React from 'react';
import { 
    Github, 
    Linkedin, 
    Globe, 
    Mail, 
    Instagram, 
    Facebook, 
    Youtube, 
    Coffee
} from 'lucide-react';

// --- 1. Reusable Components ---
const LinkButton = ({ href, icon: Icon, bgColor, textColor, text }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`
            flex items-center justify-center w-full aspect-square p-3 font-semibold rounded-full transition 
            ${bgColor} ${textColor} hover:brightness-105
            dark:bg-opacity-20 dark:hover:bg-opacity-30
        `}
        title={text}
    >
        <Icon className="w-6 h-6" />
    </a>
);

// --- 2. Main AboutPage Component ---
function AboutPage() {

    const allSocialLinks = [
        { href: "https://upendradasanayaka.vercel.app/", icon: Globe, bgColor: "bg-blue-100", textColor: "text-blue-700 dark:text-blue-400", text: "Website" },
        { href: "https://www.linkedin.com/in/Upendra-Dasanayaka/", icon: Linkedin, bgColor: "bg-indigo-100", textColor: "text-indigo-700 dark:text-indigo-400", text: "LinkedIn" },
        { href: "https://github.com/KING-UPE", icon: Github, bgColor: "bg-gray-100", textColor: "text-gray-700 dark:text-gray-300", text: "GitHub" },
        { href: "mailto:upendraunivercity@gmail.com", icon: Mail, bgColor: "bg-red-100", textColor: "text-red-700 dark:text-red-400", text: "Email" },
        { href: "https://www.instagram.com/__crazy._.demon__/", icon: Instagram, bgColor: "bg-pink-100", textColor: "text-pink-700 dark:text-pink-400", text: "Instagram" },
        { href: "https://web.facebook.com/UpendraDasanayak", icon: Facebook, bgColor: "bg-sky-100", textColor: "text-sky-700 dark:text-sky-400", text: "Facebook" },
        { href: "https://www.youtube.com/@Upendra_Dasanayaka", icon: Youtube, bgColor: "bg-red-100", textColor: "text-red-700 dark:text-red-400", text: "YouTube" },

        // 🔥 REPLACED TikTok → BuyMeACoffee with proper icon
        { 
            href: "https://buymeacoffee.com/upendra_dasanayaka",
            icon: Coffee,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-700 dark:text-yellow-400",
            text: "Buy Me a Coffee"
        },
    ];

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center p-4 md:p-8 pb-32">
            
            <div className="max-w-xl lg:max-w-3xl mx-auto w-full space-y-10 mt-8 md:mt-12">

                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-200">
                        About
                    </h1>
                </div>
                
                <div className="space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto text-justify p-0 sm:p-4">
                        <b>Alphabetz</b> is a completely <b>free</b> and <b>open-source</b> educational tool built on <b>React</b> and <b>Vite</b>. Its mission is to provide structured practice and conversion utilities to help users effectively master complex English verb tenses.
                    </p>
                </div>

                <div className="space-y-8 w-full">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
                        About the Developer
                    </h2>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify p-0 sm:p-4">
                        This project was built by <b>Upendra Dasanayaka</b>, a dedicated Web/Software Developer with expertise in <b>React/Vite</b>, <b>Tailwind CSS</b>, <b>JavaScript</b>, <b>PHP</b>, <b>Python</b>, <b>Java</b>, and <b>Express.js</b>.
                    </p>

                    <div className="w-full pt-4">
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 max-w-3xl mx-auto">
                            {allSocialLinks.map(link => (
                                <LinkButton 
                                    key={link.text} 
                                    href={link.href} 
                                    icon={link.icon} 
                                    bgColor={link.bgColor} 
                                    textColor={link.textColor} 
                                    text={link.text} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
