// pages/Start.tsx
import React, { useState } from "react";
import { FaArrowRight, FaTwitter } from "react-icons/fa";
import { Header } from "../components/navigation/Header";
import CreateToken from "../components/tokens/CreateToken";
import { Link } from "react-router-dom";

const Start: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CreateToken showForm={showForm} setShowForm={setShowForm} />;
  }

  // Landing Page
  return (
    <div className="min-h-screen  flex items-center justify-center p-4 pt-[100px] home-bg">
      <Header />
      <div className="max-w-[1200px] w-full lg:px-[40px] px-[20px] grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        {/* Content Section */}
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-white text-4xl lg:text-6xl font-semibold leading-tight">
              Start A Cult For Free.
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl lg:my-3">
              Launch A Token On Solana In Seconds.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            {/* Create Now Button */}
            <button
              onClick={() => setShowForm(true)}
              className="cursor-pointer w-full lg:w-auto bg-[#331A41] text-white px-8 py-4 lg:px-12 lg:py-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <span className="text-2xl">⚡</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>Create Now</span>
                  <span className="bg-yellow-400 text-black text-xs px-2 py-1  rounded-full font-bold">
                    $0 Buy Available
                  </span>
                </div>
                <p className="text-purple-200 text-sm font-normal lg:mt-2">
                  Plug Ur Wallet Into Me And Start For Free (◕‿◕)
                </p>
              </div>
            </button>

            {/* Create on X.Com Button */}
            <button className="cursor-pointer w-full lg:w-auto bg-[#331A4178] relative lg:px-16 lg:py-6  text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <FaTwitter className="text-2xl" />
                <div className="text-left">
                  <div>Create On X.Com</div>
                  <p className="text-gray-400 text-sm font-normal lg:mt-2">
                    Lets Take It Public... Talk To Me On X.Com UwU
                  </p>
                </div>
              </div>
              <span className="text-gray-400 absolute right-[10px] top-[50%] translate-y-[-50%]  group-hover:text-white transition-colors">
                <FaArrowRight size={20} />
              </span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              to={"/learn"}
              className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
            >
              Learn How It Works
            </Link>
            <span className="text-gray-500">or</span>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Manage An Existing Cult
            </Link>
          </div>
        </div>

        {/* Doge Image Section */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md lg:max-w-lg">
            <img
              src="/images/l.png"
              alt="Buff Doge"
              className="max-w-[400px] w-full h-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/l.png";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
