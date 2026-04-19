import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import { z } from "zod";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const Register = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please fill in the fields correctly");
      return;
    }
    setLoading(true);
    try {
      await api.post("auth/register", form);
      // Automatic login after registration
      const loginRes = await api.post("auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", loginRes.data.token);
      setUser(loginRes.data.user);
      toast.success("Account created and logged in!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
