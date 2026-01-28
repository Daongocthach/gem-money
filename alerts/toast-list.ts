
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
  avatar_updated: {
    type: "success",
    text1: "avatar updated successfully",
    text2: "",
  },
  comment_sent_successfully: {
    type: "success",
    text1: "comment sent successfully",
    text2: "",
  },
  join_meeting_success: {
    type: "success",
    text1: "joined meeting successfully",
    text2: "",
  },
  complete_meeting_success: {
    type: "success",
    text1: "completed meeting successfully",
    text2: "",
  },
  otp_sent_success: {
    type: "success",
    text1: "otp sent successfully",
    text2: "",
  },
  otp_verified_success: {
    type: "success",
    text1: "otp verified successfully",
    text2: "",
  },
  disable_success: {
    type: "success",
    text1: "disable success",
    text2: "",
  },
  enable_success: {
    type: "success",
    text1: "enable success",
    text2: "",
  },
} as const

export type ToastType = keyof typeof toastList