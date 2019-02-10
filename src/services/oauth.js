import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryOAuthClient() {
  return request('/apis/client');
}

export async function addOAuthClient(params) {
  return request('/apis/client', {
    method: 'POST',
    body: params,
  });
}

export async function queryClientNameExist(params) {
  return request(`/apis/client/exist?${stringify(params)}`);
}

export async function updateClient(params) {
  return request('/apis/client', {
    method: 'PUT',
    body: params,
  });
}

export async function deleteClient(params) {
  const { clientId } = params;
  return request(`/apis/client/${clientId}`, {
    method: 'DELETE',
  });
}