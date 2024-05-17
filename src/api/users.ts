import axios from 'axios'

export interface User { name: string }

export async function getUsers() {
  const res = await axios.get<User[]>('/api/users')
  return res.data
}
