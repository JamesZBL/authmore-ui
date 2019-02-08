import { queryOAuthClient, addOAuthClient } from '@/services/oauth';

export default {
  namespace: 'client',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOAuthClient, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addOAuthClient, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    }
  }
};