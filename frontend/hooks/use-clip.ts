import { useState } from "react";
import axios from "axios";

interface ClipOptions {
  url: string;
  startTime: string;
  endTime: string;
}

export const useClip = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateClip = async (options: ClipOptions) => {
    setIsLoading(true);
    setProgress(10);
    setError(null);
    setSuccess(false);

    try {
      // Simulate progress for UI feedback
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 1500);

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URI
          : process.env.NEXT_PUBLIC_LOCAL_URI;

      const response = await axios.post(`${baseUrl}/api/clip`, options, {
        responseType: "blob", // Important for downloading files
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "clipify-result.mp4");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data instanceof Blob) {
        // Parse blob error message
        const text = await err.response.data.text();
        try {
          const data = JSON.parse(text);
          setError(
            data.error || "An error occurred while generating the clip.",
          );
        } catch {
          setError("An error occurred while generating the clip.");
        }
      } else {
        setError(err.message || "Network error");
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setProgress(0);
        setSuccess(false);
      }, 5000); // Reset progress after 5s
    }
  };

  return {
    generateClip,
    isLoading,
    progress,
    error,
    success,
  };
};
