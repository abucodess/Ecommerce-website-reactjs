import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser, clearError } from "./authslice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  let navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear previous error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      // LOGIN
      let res =dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()
      if(res){
        navigate("/")
      }
    } else {
      // SIGNUP
      let res = dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })).unwrap();
        if(res){
            navigate("/")

        }
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        {/* HEADING */}
        <h1 className="mb-2 text-center text-3xl font-bold">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {/* DESCRIPTION */}
        <p className="mb-6 text-center text-gray-500">
          {isLogin
            ? "Login to your SOLEX account"
            : "Create your SOLEX account"}
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME - SIGNUP ONLY */}
          {!isLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        {/* SWITCH LOGIN / SIGNUP */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="font-semibold text-black hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="font-semibold text-black hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
