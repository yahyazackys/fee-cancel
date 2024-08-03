"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/app/auth_context";

interface CreateFeeCancelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateFeeCancel = ({
  isOpen,
  onClose,
  onCreate,
}: CreateFeeCancelProps) => {
  const [fee, setFee] = useState("");
  const { userId, user } = useAuth();

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/fee-cancel/store",
        {
          fee,
          user_id: userId,
          user_name: user,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onCreate();
      } else {
        toast.error(response.data.message || "Failed to create data.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create data.");
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <div className="flex flex-col gap-y-2 p-12">
          <p>Fee</p>
          <Input
            placeholder="Fee"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="mb-2"
          />
          <Button
            onClick={handleCreate}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeeCancel;
