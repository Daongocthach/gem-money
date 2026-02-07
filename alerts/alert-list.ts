export const alertList = {
    logout: {
        type: "confirm",
        text1: "logout",
        text2: "are_you_sure_you_want_to_logout",
    },
    refresh_token_failed: {
        type: "warning",
        text1: "error",
        text2: "failed_to_refresh_token",
    },
    password_mismatch: {
        type: "error",
        text1: "password_mismatch",
        text2: "the_passwords_do_not_match_please_try_again",
    },
    camera_permission_denied: {
        type: "error",
        text1: "permission_denied",
        text2: "please_grant_permission_to_access_the_camera",
    },
    delete_income_confirm: {
        type: "confirm",
        text1: "delete_income",
        text2: "are_you_sure_delete_income",
    },
    delete_transaction_confirm: {
        type: "confirm",
        text1: "delete_transaction",
        text2: "are_you_sure_delete_transaction",
    },
} as const

export type AlertType = keyof typeof alertList