"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Registration successful!");
      router.push("/login");
    } catch {
      toast.error("Failed to register. Please check your data and try again.");
    }
  };

  return (
    <div className="p-4 flex flex-col w-full h-screen items-center justify-center bg-slate-50">
      <div className="w-1/2 flex flex-col gap-y-4">
        <h2 className="text-3xl font-semibold text-center">Register</h2>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
        />
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
        <Input
          placeholder="Confirm Password"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="mb-2"
        />
        <Button
          onClick={handleRegister}
          className="bg-black text-white hover:opacity-70"
        >
          Register
        </Button>
      </div>
      <p className="mt-4 text-center">
        Sudah punya akun?
        <Link href="/login" className="text-blue-600 hover:underline ml-2">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
