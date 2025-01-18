import { SnackbarType, useSnackbarContext } from "@/contexts/SnackbarContext";

const useSnackbar = () => {
  const { snackbar, setSnackbar, openSnackbar } = useSnackbarContext();

  const snackbarError = (message?: string) =>
    openSnackbar({ type: SnackbarType.Error, message });
  const snackbarWarnning = (message?: string) =>
    openSnackbar({ type: SnackbarType.Warning, message });
  const snackbarInfo = (message?: string) =>
    openSnackbar({ type: SnackbarType.Info, message });
  const snackbarSuccess = (message?: string) =>
    openSnackbar({ type: SnackbarType.Success, message });
  const snackbarClose = () => setSnackbar({ type: snackbar.type, open: false });

  return {
    snackbarError,
    snackbarWarnning,
    snackbarInfo,
    snackbarSuccess,
    snackbarClose
  };
};

export default useSnackbar;
