import request from '../utils/request';
import { stringify } from 'qs';
import { basic } from '@/oauth';

export async function postLogin(params) {
  const { userName, password } = params;
  const formData = {
    username: userName,
    password,
    grant_type: 'password',
  }
  return request('/apis/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stringify(formData),
  });
}