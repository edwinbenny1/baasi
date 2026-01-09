import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, onSwitch, onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const user = userCred.user;

      // Save session
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      if (onLoginSuccess) onLoginSuccess(user);

      // ✅ Show success screen
      setSuccess(true);

      // ⏳ Delay then redirect
      setTimeout(() => {
        onClose();
        navigate("/");
      }, 1800);
    } catch (err) {
      console.error("Login error:", err.code, err.message);

      if (err.code === "auth/user-not-found") {
        setError("User not found. Please register.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="bg-white rounded-lg px-8 py-6 text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-2">✅ Successfully Logged In</h2>
          <p className="text-gray-600 text-sm">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  // 🔐 LOGIN FORM
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border w-full px-3 py-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full px-3 py-2 mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded mt-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-3">
          No account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={onSwitch}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
