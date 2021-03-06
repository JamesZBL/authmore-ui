import { queryOAuthClient, addOAuthClient, queryClientNameExist, updateClient, deleteClient, batchDeleteClient } from '@/services/oauth';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { platform } from 'os';

export default {
  namespace: 'client',

  state: {
    data: {},
    addForm: {},
    checkData: {},
    addResult: {},
    currentRecord: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOAuthClient, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveStep({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveTmp',
        payload,
      });
      if (callback) callback(response);
    },
    *checkExistName({ payload }, { call, put }) {
      const response = yield call(queryClientNameExist, payload);
      const { result } = response;
      if (!!result) {
        message.error('该名称已被占用');
        return;
      }
      yield put({
        type: 'saveClientName',
        payload,
      });
      yield put(routerRedux.push('/oauth/client/create/2'));
    },
    *saveDetail({ payload }, { call, put }) {
      const result = yield call(addOAuthClient, payload);
      yield put({
        type: 'saveAddResult',
        payload: result,
      });
      yield put(routerRedux.push('/oauth/client/create/3'));
    },
    *update({ payload, callback }, { call }) {
      const result = yield call(updateClient, payload);
      if (result.msg === 'success' && callback) callback();
    },
    *delete({ payload, callback }, { call }) {
      const result = yield call(deleteClient, payload);
      if (result.msg === 'success' && callback) callback();
    },
    *setCurrent({ payload }, { put }) {
      const { authorities } = payload;
      const formatted = authorities.map(a => a.authority);
      payload = { ...payload, authorities: formatted };
      yield put({
        type: 'saveCurrent',
        payload,
      });
    },
    *resetCurrent(a ,{ put }) {
      yield put({
        type: 'resetCurrent',
        payload: {},
      });
    },
    *batchDelete({ payload, callback }, { call }) {
      const result = yield call(batchDeleteClient, payload);
      if (result.msg === 'success' && callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    },
    saveTmp(state, { payload }) {
      return {
        ...state,
        addForm: payload,
      };
    },
    saveClientName(state, { payload }) {
      return {
        ...state,
        addForm: {
          ...state.addForm,
          ...payload,
        }
      };
    },
    saveAddResult(state, { payload }) {
      return {
        ...state,
        addResult: payload,
      }
    },
    saveCurrent(state, { payload }) {
      return {
        ...state,
        currentRecord: payload,
      }
    },
    resetCurrent(state) {
      return {
        ...state,
        currentRecord: {},
      }
    },
  }
};