import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

export const useToast = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: CheckCircle,
    })
  }

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: XCircle,
    })
  }

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: AlertCircle,
    })
  }

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: Info,
    })
  }

  const showLoading = (message: string) => {
    return toast.loading(message)
  }

  const dismiss = (id?: string | number) => {
    toast.dismiss(id)
  }

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss,
  }
}

// Direct exports for convenience
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: CheckCircle,
  })
}

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: XCircle,
  })
}

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    icon: AlertCircle,
  })
}

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    icon: Info,
  })
}