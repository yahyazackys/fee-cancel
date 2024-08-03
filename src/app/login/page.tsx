"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../auth_context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setToken, setUser, setUserId } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/login",
        { email, password }
      );

      if (response.data.token) {
        const { name, id } = response.data.user;
        setToken(response.data.token);
        setUser(name);
        setUserId(id);
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed, account not registered.");
      }
    } catch {
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="p-4 flex w-full h-screen items-center justify-center bg-slate-50">
      <div className="w-1/2 flex flex-col gap-y-4">
        <h2 className="text-3xl font-semibold text-center">
          Enter Your Account
        </h2>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2"
        />
        <Button
          onClick={handleLogin}
          variant="outline"
          className="bg-black text-white hover:opacity-70"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
