"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "react-toastify";

interface EditFeeCancelProps {
  isOpen: boolean;
  onClose: () => void;
  feeCancel: {
    id: string;
    fee: string;
    user_id: string;
    user_name: string;
  };
  onUpdate: () => void;
}

const EditFeeCancel = ({
  isOpen,
  onClose,
  feeCancel,
  onUpdate,
}: EditFeeCancelProps) => {
  const [fee, setFee] = useState(feeCancel.fee);
  const [userName, setUserName] = useState(feeCancel.user_name);
  const [userId, setUserId] = useState(feeCancel.user_id);

  useEffect(() => {
    setFee(feeCancel.fee);
    setUserName(feeCancel.user_name);
    setUserId(feeCancel.user_id);
  }, [feeCancel]);

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/fee-cancel/update/${feeCancel.id}`,
        {
          fee,
          user_id: userId,
          user_name: userName,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onUpdate();
      } else {
        toast.error(response.data.message || "Failed to update data.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update data.");
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
          <Input
            placeholder="User ID"
            value={userId}
            className="mb-2 bg-slate-900 text-white"
            disabled
          />
          <Input
            placeholder="Username"
            value={userName}
            className="mb-2 bg-slate-900 text-white"
            disabled
          />
          <Button
            onClick={handleUpdate}
            className="bg-slate-700 hover:bg-slate-800 text-white"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeCancel;
