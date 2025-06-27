import React from "react";

interface FormErrorProps {
  message: string | undefined;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="p-3 font-one flex items-center justify-center gap-x-2 text-sm text-white bg-noir-500">
      <p className="">{message}</p>
    </div>
  );
};
