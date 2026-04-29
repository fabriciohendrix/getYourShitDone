import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail01, Lock01 } from "@untitledui/icons";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import BrandLogo from "../components/BrandLogo";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const Login = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please fill in the fields correctly");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("auth/login", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <BrandLogo className="h-12 w-12" />
          <div className="text-center">
            <h1 className="text-display-xs font-semibold text-primary">#getYourShitDone</h1>
            <p className="mt-1 text-sm text-tertiary">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl bg-primary p-8 shadow-lg ring-1 ring-primary">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            icon={Mail01}
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            isRequired
          />
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={Lock01}
            value={form.password}
            onChange={(v) => setForm((f) => ({ ...f, password: v }))}
            isRequired
          />
          <Button type="submit" color="primary" size="md" isLoading={loading} className="w-full mt-1">
            Sign in
          </Button>
          <p className="text-center text-sm text-tertiary">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
