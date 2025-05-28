"use client";

// Add WebLN type definitions
declare global {
  interface Window {
    webln:
      | {
          enable: () => Promise<void>;
          sendPayment: (invoice: string) => Promise<{ preimage: string }>;
        }
      | undefined;
  }
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";
import toast, { Toaster } from "react-hot-toast";
import { createInvoice } from "@/lib/satInvoice";
import { useState } from "react";

interface BitButtonProps {
  satAmount: number;
}

const BidButton = ({ satAmount }: BitButtonProps) => {
  const [invoice, setInvoice] = useState("");

  const sendSats = async (invoice: string) => {
    try {
      if (!window.webln) {
        toast.error("WebLN not available. Please install a Lightning wallet.");
        return;
      }

      await window.webln.enable(); // Request permission if needed
      const result = await window.webln.sendPayment(invoice);
      console.log("Payment result:", result);
      toast.success("Payment sent successfully!");
    } catch (error: any) {
      console.error("Payment failed:", error);
      if (error.message?.includes("Limit exeeded")) {
        toast.error(
          "Payment limit exceeded. Please configure your Alby wallet limits at getalby.com/node/embrace_albyhub",
          { duration: 5000 }
        );
      } else {
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  const handleBid = async (satAmount: number) => {
    toast.loading("Generating invoice...");
    toast.dismiss();
    try {
      const bolt11 = await createInvoice(satAmount, "Task Application Fee");
      setInvoice(bolt11);
      console.log("Invoice created successfully!", bolt11);
      toast.dismiss();
      toast.success("Invoice created successfully!");

      // Copy to clipboard
      await navigator.clipboard.writeText(bolt11);
      toast("Invoice copied to clipboard!");

      // Add payment button after invoice is generated
      const shouldPay = window.confirm("Would you like to pay now?");
      if (shouldPay) {
        await sendSats(bolt11);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Could not create invoice.");
      console.error("Invoice error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div>
          <button
            type="submit"
            className="flex justify-center gap-1 items-center mx-auto shadow-xl text-sm bg-gray-50 backdrop-blur-md font-medium isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-3 py-1.5 overflow-hidden border-2 rounded-full group"
          >
            Bid {satAmount} sats
            <svg
              className="w-4 h-4 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-1 rotate-45"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-gray-800 group-hover:fill-gray-800"
              />
            </svg>
          </button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`You need a minimum of ${satAmount} sats in your wallet to apply for
            this task. Once you click Continue, ${satAmount} sats will be debited
            from your wallet.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={() => {
                handleBid(satAmount);
              }}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>

        {invoice && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Lightning Invoice</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(invoice);
                  toast.success("Invoice copied to clipboard!");
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Copy
              </button>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200 break-all text-sm font-mono">
              {invoice}
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                onClick={() => sendSats(invoice)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Pay Now
              </Button>
            </div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BidButton;
