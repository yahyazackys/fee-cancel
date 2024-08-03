"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth_context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    }
  }, [token]);

  const handleClose = () => {
    setModalOpen(false);
    router.push("/");
  };

  const handleLoginRedirect = () => {
    setModalOpen(false);
    router.push("/login");
  };

  if (!token) {
    return (
      <>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6">
            <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full relative">
              <p className="mb-4 text-lg">
                Anda harus login terlebih dahulu untuk mengakses halaman ini.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleLoginRedirect}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
