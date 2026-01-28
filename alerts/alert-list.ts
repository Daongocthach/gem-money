export const alertList = {
    logout: {
        type: "confirm",
        text1: "logout",
        text2: "are you sure you want to logout",
    },
    refresh_token_failed: {
        type: "warning",
        text1: "error",
        text2: "failed to refresh token",
    },
    password_mismatch: {
        type: "error",
        text1: "password mismatch",
        text2: "the passwords do not match, please try again",
    },
    file_picker_error: {
        type: "error",
        text1: "file picker error",
        text2: "an error occurred while picking the file",
    },
    permission_denied_photos: {
        type: "error",
        text1: "permission denied",
        text2: "please grant permission to access the media library",
    },
    camera_permission_denied: {
        type: "error",
        text1: "permission denied",
        text2: "please grant permission to access the camera",
    },
    change_company: {
        type: "confirm",
        text1: "change company",
        text2: "you will be redirected to the login screen to change company",
    },
} as const

export type AlertType = keyof typeof alertList