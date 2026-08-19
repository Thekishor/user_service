import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (error, setError) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(
        ([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages[0],
          });
        },
      );
      return;
    }

    toast.error(
      error.response?.data?.message || "Unable to process your request.",
    );
    return;
  }

  toast.error("Something went wrong. Please try again.");
};
