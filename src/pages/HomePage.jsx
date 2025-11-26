import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"> {/* Relies on body bg */}

      <div className="
        max-w-5xl w-full 
        flex flex-col       /* always stacked vertically */
        items-center justify-center 
        gap-8               /* spacing between title and button */
        text-center
      ">

        {/* Title */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
          Welcome to AlphaBetz
        </h2>

        {/* Responsive Button */}
        <Link
          to="/learn"
          className="
            inline-block
            w-48 md:w-64 lg:w-80
            py-4
            text-lg md:text-xl font-bold text-white 
            bg-blue-700 rounded-full shadow-lg 
            hover:bg-blue-800 
            transition-all duration-300 
            transform hover:scale-105 active:scale-100
            text-center
          "
        >
          Get Started
        </Link>

      </div>
    </div>
  );
}

export default HomePage;