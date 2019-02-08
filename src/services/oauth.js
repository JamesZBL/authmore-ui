import request from '@/utils/request';

export async function queryOAuthClient() {
  return request('/api/client');
}