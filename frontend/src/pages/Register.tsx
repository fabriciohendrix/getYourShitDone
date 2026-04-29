import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail01, Lock01, User01 } from "@untitledui/icons";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import BrandLogo from "../components/BrandLogo";

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
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <BrandLogo className="h-12 w-12" />
          <div className="text-center">
            <h1 className="text-display-xs font-semibold text-primary">#getYourShitDone</h1>
            <p className="mt-1 text-sm text-tertiary">Create your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl bg-primary p-8 shadow-lg ring-1 ring-primary">
          <Input
            label="Name"
            placeholder="Your name"
            icon={User01}
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            isRequired
          />
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
            Create account
          </Button>
          <p className="text-center text-sm text-tertiary">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-secondary hover:text-brand-secondary_hover">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
