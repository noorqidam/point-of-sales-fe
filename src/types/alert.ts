export interface Alert {
  statusCode: number;
  message?: string;
  type?: string;
  text?: string;
  error?: {
    message?: string;
    statusCode?: number;
    validation?: {
      property?: string;
      message?: string[];
    }[];
    error?: {
      validation?: {
        property?: string;
        message?: string[];
      }[];
    };
  };
  status?: "error" | "loading" | "success" | "info" | "warning" | undefined;
  title?: string;
  description?: string;
  success?: boolean;
}

export const successAlertResponse = (alert: Alert): Alert => {
  const success = [200, 201].includes(alert?.statusCode);

  if (success) {
    return {
      ...alert,
      status: "success",
      title: "Berhasil",
      success,
    };
  } else {
    throw new Error("Gagal memproses permintaan");
  }
};

export const errorAlertResponse = (errorMessage: string): Alert => ({
  statusCode: 500,
  error: new Error(errorMessage),
  status: "error",
  title: "Error",
  success: false,
});
