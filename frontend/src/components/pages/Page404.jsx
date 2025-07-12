import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Page404() {
  return (
    <div className="w-full h-screen flex flex-col-reverse lg:flex-row items-center justify-center px-4 lg:px-20">
      {/* Left side: text */}
      <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
        <h1 className="text-7xl font-extrabold text-gray-200 tracking-widest">404</h1>
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-700">Page Not Found</h2>
        <p className="text-lg lg:text-xl text-gray-500">
          Uh-oh! Looks like this page doesn't exist. Maybe it's lost in a book 📖
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-lg font-medium"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </div>

      {/* Right side: SVG image */}
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0 flex items-center justify-center">
        <svg
          className="w-full max-w-md"
          viewBox="0 0 640 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#c084fc"
            d="M96 64C96 28.65 124.7 0 160 0H512C529.7 0 544 14.33 544 32V416C544 433.7 529.7 448 512 448H160C124.7 448 96 419.3 96 384V64z"
          />
          <path
            fill="#8b5cf6"
            d="M48 96C48 78.33 62.33 64 80 64H448C465.7 64 480 78.33 480 96V384C480 401.7 465.7 416 448 416H80C62.33 416 48 401.7 48 384V96z"
          />
          <path
            fill="#fff"
            d="M144 128C144 119.2 151.2 112 160 112H368C376.8 112 384 119.2 384 128V320C384 328.8 376.8 336 368 336H160C151.2 336 144 328.8 144 320V128z"
          />
          <path
            fill="#ddd6fe"
            d="M416 192C424.8 192 432 199.2 432 208C432 216.8 424.8 224 416 224C407.2 224 400 216.8 400 208C400 199.2 407.2 192 416 192zM432 288C432 296.8 424.8 304 416 304C407.2 304 400 296.8 400 288C400 279.2 407.2 272 416 272C424.8 272 432 279.2 432 288z"
          />
        </svg>
      </div>
    </div>
  );
}

export default Page404;