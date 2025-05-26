import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white rounded-xl shadow p-4">{children}</div>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
