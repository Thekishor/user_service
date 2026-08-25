import axios from "axios";

export const handleApiError = (error, setError) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(
        ([field, messages]) => {
          setError(field, {
            type: "error",
            message: messages[0],
          });
        },
      );
      return;
    }

    return error.response?.data?.message || "Unable to process your request.";
  }

  return "Something went wrong. Please try again.";
};
