import request from '@/utils/request';

export async function queryOAuthClient() {
  return request('/api/client');
}

export async function addOAuthClient(params) {
  return request('/api/client', {
    method: 'POST',
    body: params,
  });
}