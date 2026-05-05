"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setProgress } from "@/redux/features/loadingBarSlice";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const { status } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setProgress(70));
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Logged in successfully");
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "Invalid credentials");
    } finally {
      dispatch(setProgress(100));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setProgress(70));
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      router.push("/");
    } catch (error) {
      toast.error(error?.message || "Google sign in failed");
    } finally {
      dispatch(setProgress(100));
    }
  };

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black">
        <span className="loader"></span>
      </div>
    );
  }

  if (status === "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 mx-4 z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Enter your details to access your account</p>
          </div>

          <form onSubmit={handelSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="email">
                Email Address
              </label>
              <input
                onChange={onchange}
                value={formData.email}
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <Link href="/reset-password">
                  <span className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</span>
                </Link>
              </div>
              <input
                onChange={onchange}
                value={formData.password}
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-white/5"
            >
              Sign In
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-4 bg-[#121212] text-xs text-gray-500 uppercase tracking-widest rounded-full">
                Or continue with
              </span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
            >
              <FaGoogle className="text-white" />
              <span>Google</span>
            </button>

            <p className="text-center text-gray-400 text-sm mt-8">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-cyan-400 font-semibold hover:underline">Sign Up</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
