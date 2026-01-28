export type TokenDecodedProps = {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
}

export type SignUpProps = {
  email: string
  password: string
  first_name: string
  last_name: string
  employee_code: string
}

export type LoginFormInputs = {
  email: string
  password: string
}