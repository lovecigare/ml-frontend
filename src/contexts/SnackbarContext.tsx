"use client";

import React, { createContext, useContext, useState } from "react";

enum SnackbarType {
  Error = "error",
  Info = "info",
  Success = "success",
  Warning = "warning"
}

interface Snackbar {
  type?: SnackbarType;
  message?: string;
  open?: boolean;
}

type SnackbarContext = {
  snackbar: Snackbar;
  setSnackbar: React.Dispatch<React.SetStateAction<Snackbar>>;
  openSnackbar: (data: Omit<Snackbar, "open">) => void;
};

const snackbarContext = createContext<SnackbarContext>({
  snackbar: {},
  setSnackbar: () => {},
  openSnackbar: () => {}
});

interface Props {
  children: React.ReactNode;
}

const SnackbarContextProvider = ({ children }: Props) => {
  const [snackbar, setSnackbar] = useState<Snackbar>({});

  const openSnackbar = ({ type, message }: Omit<Snackbar, "open">) =>
    setSnackbar({ type, message, open: true });

  const value: SnackbarContext = {
    snackbar,
    setSnackbar,
    openSnackbar
  };

  return (
    <snackbarContext.Provider value={value}>
      {children}
    </snackbarContext.Provider>
  );
};

const useSnackbarContext = () => {
  const context = useContext(snackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProvider"
    );
  }
  return context;
};

export {
  snackbarContext,
  SnackbarContextProvider,
  SnackbarType,
  useSnackbarContext
};
export type { Snackbar };
