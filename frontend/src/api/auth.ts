import { apiClient } from './axios'

type TokenResponse = { access_token: string; token_type: string }

export async function loginRequest(username: string, password: string) {
  const body = new URLSearchParams({ username, password })
  const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await apiClient.post('/api/v1/users/register', { name, email, password })
  return data
}
