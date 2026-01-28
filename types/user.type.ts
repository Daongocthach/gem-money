export type User = {
    id: number
    email: string
    first_name: string
    last_name: string
    dob: string
    role: number
    avatar: string
    full_name: string
    refresh_token: string | null
    access_token: string | null
}
