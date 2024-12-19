import { useState, useEffect } from "react";

export const useFetchUnseenEmails = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/fetch-emails");
        const data = await response.json();
        if (response.ok) {
          setEmails(data.emails || []); 
        }
      } catch (err : any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return { emails, isLoading, error };
};
