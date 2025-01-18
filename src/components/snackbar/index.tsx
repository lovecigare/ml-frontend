"use client";

import React from "react";

import { useSnackbarContext } from "@/contexts/SnackbarContext";

const SnackbarContainer = () => {
  const { snackbar: snackbarState, setSnackbar } = useSnackbarContext();

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway" || reason === undefined) {
      return;
    }
    if (snackbarState.open) {
      setSnackbar({ type: snackbarState.type, open: false });
    }
  };

  const snackbarOpen = snackbarState.open;
  const snackbarType = snackbarState.type;

  return (
    <>
      {snackbarOpen && (
        <div
          className={`fixed right-0 top-12 w-full max-w-xs transform p-4 transition-transform ${
            snackbarOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div
            className={`rounded-lg p-4 text-white ${
              snackbarType === "success"
                ? "bg-green-500"
                : snackbarType === "error"
                  ? "bg-red-500"
                  : snackbarType === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          >
            <div className="font-kanit">{snackbarState.message}</div>
            <button
              onClick={handleClose}
              className="absolute right-2 top-2 text-white hover:text-gray-200"
              aria-label="Close"
            >
              &times; {/* Close icon */}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SnackbarContainer;
