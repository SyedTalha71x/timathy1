/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Art from "../../public/Art.png";
import GoogleImage from "../../public/Google.png";
import FacebookImage from "../../public/Facebook.png";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    studioName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const redirect = () =>{
    window.location.href = "/";
  }

  return (
    <div className="h-screen bg-[#0E0E0E] overflow-hidden flex justify-center items-center p-8"> 
      <div className="flex h-full w-full lg:p-10 md:p-8 sm:p-0 p-0 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-1 flex-col justify-center lg:p-16 md:p-14 sm:p-6 p-4">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <h1 className="mb-2 text-3xl login_h1 font-bold text-white">
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="mb-8 login_p login_btn text-gray-400">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign in to start managing your projects.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Studio name"
                  className="w-full rounded-lg bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={formData.studioName}
                  onChange={(e) =>
                    setFormData({ ...formData, studioName: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg bg-[#181818] px-4 py-3 text-white placeholder-gray-500 outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Forgot Password?
                </a>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900 px-2 text-gray-400">or</span>
                </div>
              </div>

              <button
                type="button"
                className="flex w-full login_btn items-center justify-center cursor-pointer rounded-lg border border-gray-700 transition-all duration-500 ease-in-out bg-black px-4 py-3 text-white hover:bg-gray-700"
              >
                <img src={GoogleImage} alt="" className="mr-2" />
                Sign in with Google
              </button>

              <button
                type="button"
                className="flex w-full login_btn items-center cursor-pointer justify-center rounded-lg border border-gray-700 bg-black transition-all duration-500 ease-in-out px-4 py-3 text-white hover:bg-gray-700"
              >
                <img src={FacebookImage} alt="" className="mr-2" />
                Sign in with Facebook
              </button>

              <button
              onClick={redirect}
                type="submit"
                className="w-full rounded-2xl login_btn cursor-pointer bg-[#3F74FF] px-4 py-3 text-white hover:bg-blue-700 transition-all duration-500 ease-in-out"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:block flex-1 p-10">
          <div className="relative h-full w-full">
            <img
              src={Art}
              alt="Fitness enthusiasts working out"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
