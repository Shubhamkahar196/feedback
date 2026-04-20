"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/app/context/AuthProvider";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const username = user?.username ?? user?.email ?? "";

  const handleLogout = () => {
    logout();
    window.location.href = "/sign-in";
  };

  return (
    <nav className="p-4 mb:p-6 shadow-md bg-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          True-feedback
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, <strong>{username}</strong></span>
            <Button onClick={handleLogout} className="w-full md:w-auto cursor-pointer">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
