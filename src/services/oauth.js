import request from '@/utils/request';
import { stringify } from 'qs';
import { async } from 'q';

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

export async function fetchUsers() {
  return request('/apis/user');
}

export async function updateUser(params) {
  return request(`/apis/user`, {
    method: 'PUT',
    body: params,
  });
}

export async function fetchRandomPwd() {
  return request('/apis/password/random');
}

export async function postUser(params) {
  return request('/apis/user', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUser(params) {
  const { id } = params;
  return request(`/apis/user/${id}`, {
    method: 'DELETE',
  });
}

export async function queryUserNameExist(params) {
  return request(`/apis/user/exist?${stringify(params)}`);
}