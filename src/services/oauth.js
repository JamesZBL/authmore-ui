import request from '@/utils/request';
import { stringify } from 'qs';
import { async } from 'q';

export async function queryOAuthClient() {
  return request('/api/client');
}

export async function addOAuthClient(params) {
  return request('/api/client', {
    method: 'POST',
    body: params,
  });
}

export async function queryClientNameExist(params) {
  return request(`/api/client/exist?${stringify(params)}`);
}

export async function updateClient(params) {
  return request('/api/client', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteClient(params) {
  const { clientId } = params;
  return request(`/api/client/${clientId}`, {
    method: 'DELETE',
  });
}