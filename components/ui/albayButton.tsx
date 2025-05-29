"use client";
import dynamic from "next/dynamic";

export const AlbyButton = dynamic(
  () => import("@getalby/bitcoin-connect-react").then((mod) => mod.Button),
  { ssr: false }
);
