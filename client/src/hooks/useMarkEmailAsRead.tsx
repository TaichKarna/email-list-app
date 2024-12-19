import { useState } from "react";

export const useMarkEmailsAsRead = () => {
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState(null);

  const markAsRead = async (emailUids : number[]) => {
    if (!Array.isArray(emailUids) || emailUids.length === 0) {
      throw new Error("Invalid email UIDs");
    }

    setIsMarking(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/mark-emails-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailUids }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to mark emails as read");
      }
      return data.message; 
    } catch (err : any) {
      setError(err.message || "An unknown error occurred");
      throw err; 
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking, error };
};
