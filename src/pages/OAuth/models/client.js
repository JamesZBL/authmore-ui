import { queryOAuthClient } from '@/services/oauth';

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