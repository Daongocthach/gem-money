
export const toastList = {
  login_success: {
    type: "success",
    text1: "login success",
    text2: "welcome back",
  },
  sign_up_success: {
    type: "success",
    text1: "sign up success",
    text2: "created account successfully",
  },
  logout_success: {
    type: "success",
    text1: "logout success",
    text2: "see you later",
  },
  update_success: {
    type: "success",
    text1: "update success",
    text2: "updated successfully",
  },
  logout_failed: {
    type: "error",
    text1: "logout failed",
    text2: "please try again",
  },
  reject_success: {
    type: "success",
    text1: "reject success",
    text2: "",
  },
  submit_success: {
    type: "success",
    text1: "submitted successfully",
    text2: "",
  },
  delete_success: {
    type: "success",
    text1: "delete success",
    text2: "",
  },
  create_success: {
    type: "success",
    text1: "create success",
    text2: "",
  },
  network_error: {
    type: "error",
    text1: "error",
    text2: "network error",
  },
  add_success: {
    type: "success",
    text1: "added successfully",
    text2: "",
  },
} as const

export type ToastType = keyof typeof toastList