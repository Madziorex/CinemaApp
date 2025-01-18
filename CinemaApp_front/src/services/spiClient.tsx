import apiClient from './axiosConfig';

export async function getUserData() {
  const response = await apiClient.get('/user');
  return response.data;
}