"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "./protected_route";
import { useAuth } from "./auth_context";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CreateFeeCancel from "@/components/create_fee_cancel";
import EditFeeCancel from "@/components/edit_fee_cancel";
import { formatRupiah } from "@/lib/utils";

interface FeeCancel {
  id: string;
  fee: string;
  user_id: string;
  user_name: string;
}

export default function Home() {
  const { user, logout } = useAuth();
  const [feeCancels, setFeeCancels] = useState<FeeCancel[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFeeCancel, setCurrentFeeCancel] = useState<FeeCancel | null>(
    null
  );

  useEffect(() => {
    fetchFeeCancels();
  }, []);

  const fetchFeeCancels = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/fee-cancel/index"
      );

      const feeCancelsArray = Object.keys(response.data.data).map((key) => ({
        id: key,
        ...response.data.data[key],
      }));
      setFeeCancels(feeCancelsArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.get(`http://127.0.0.1:8000/api/fee-cancel/destroy/${id}`);
      toast.success("Data deleted successfully!");
      fetchFeeCancels();
    } catch {
      toast.error("Failed to delete data.");
    }
  };

  const handleEditOpen = (feeCancel: FeeCancel) => {
    setCurrentFeeCancel(feeCancel);
    setIsEditDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-screen items-center justify-center bg-slate-50 px-60 gap-y-4">
        <p className="flex self-start">halo, {user || ""}</p>
        <div className="flex w-full items-center justify-between text-black">
          <Button
            className="bg-slate-700 text-white hover:bg-slate-900"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            className="bg-slate-700 text-white hover:bg-slate-900 flex self-end"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create New
          </Button>
        </div>
        <Table>
          <TableCaption>Fee Cancel.</TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-200">
              <TableCell>ID Fee</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>ID User</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeCancels.length > 0 ? (
              feeCancels.map((feeCancel) => (
                <TableRow key={feeCancel.id}>
                  <TableCell>{feeCancel.id}</TableCell>
                  <TableCell>{formatRupiah(Number(feeCancel.fee))}</TableCell>
                  <TableCell>{feeCancel.user_id}</TableCell>
                  <TableCell>{feeCancel.user_name}</TableCell>
                  <TableCell className="flex gap-x-3">
                    <Button
                      onClick={() => handleEditOpen(feeCancel)}
                      className="bg-slate-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(feeCancel.id)}
                      className="bg-red-700 text-white"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <CreateFeeCancel
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={fetchFeeCancels}
        />

        {currentFeeCancel && (
          <EditFeeCancel
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            feeCancel={currentFeeCancel}
            onUpdate={fetchFeeCancels}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
