import React from "react";

interface FormSuccessProps {
  message: string | undefined;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className=" bg-emerald-500/15 font-one p-3 flex items-center justify-center gap-x-2 text-base text-emerald-500">
      <p className="">{message}</p>
    </div>
  );
};
