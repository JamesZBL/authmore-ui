import React, { Component, PureComponent, Fragment } from "react";
import { Card, Form, Tag, Badge, Modal, Button, Input, Divider, message } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from "dva";
import StandardTable from "@/components/StandardTable";
import tableStyles from '@/pages/List/TableList.less';
import router from 'umi/router';
import EditClient from './EditClient';
import { RootAppId } from '@/oauth';

const FormItem = Form.Item;

export const authTypes = {
  'authorization_code': '授权码模式',
  'password': '密码模式',
  'client_credentials': '客户端密钥模式',
  'implicit': '简化模式',
  'refresh_token': '刷新令牌',
};
const authTypeColorMap = {
  'authorization_code': 'blue',
  'password': 'green',
  'client_credentials': 'purple',
  'implicit': 'orange',
  'refresh_token': 'blue',
}

@connect(({ client, loading }) => ({
  client,
  loading: loading.models.client,
}))
class OAuthClient extends PureComponent {

  state = {
    selectedRows: [],
    currentRecord: {},
    selectedRowKeys: [],
  };

  rowKey = 'clientId';
  title = 'OAuth 认证应用管理';

  columns = [
    {
      title: '应用名称',
      dataIndex: 'clientName',
      render: (clientName, record) => {
        return clientName || record.clientId;
      }
    },
    {
      title: '认证方式',
      dataIndex: 'authorizedGrantTypes',
      filters: this.getAuthTypeFilter(),
      onFilter: (value, record) => record.authorizedGrantTypes.indexOf(value) > -1,
      render: types => (
        <Fragment>
          {types.map(type => <Tag key={authTypes[type]} color={authTypeColorMap[type]}>{authTypes[type]}</Tag>)}
        </Fragment>
      )
    },
    {
      title: '权限',
      dataIndex: 'authorities',
      render: authorities => (
        <Fragment>
          {authorities.map(a => <Tag key={a.authority}>{a.authority}</Tag>)}
        </Fragment>
      )
    },
    {
      title: '回调 URI',
      dataIndex: 'registeredRedirectUri',
      render: urls => (
        <Fragment>
          {urls.map(url => <Tag key={url} >{url}</Tag>)}
        </Fragment>
      )
    },
    {
      title: '令牌有效期',
      width: 120,
      dataIndex: 'accessTokenValiditySeconds',
      render: val => {
        if (val < 60) return `${val} 秒`;
        if (val < 3600) {
          if (val % 60) return `${val} 秒`;
          return `${val / 60} 分钟`
        }
        if (val % 3600) return `${val} 秒`;
        return `${val / 3600} 小时`
      },
    },
    {
      title: '操作',
      width: 120,
      render: (text, record) => {
        let onClick = () => this.handleDelete(record);
        const canModify = this.canModify(record);
        if (!canModify) onClick = () => { message.warn('这个应用不能删除哦') };
        return (
          <Fragment>
            <a onClick={() => this.handleEdit(record)}>配置</a>
            <Divider type="vertical" />
            <a onClick={onClick}>删除</a>
          </Fragment>
        )
      },
    },
  ];

  getAuthTypeFilter() {
    const result = []
    for (let k in authTypes) {
      result.push({
        text: authTypes[k],
        value: k,
      })
    }
    return result;
  }

  fetchClient = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/fetch',
    });
  }

  componentDidMount() {
    this.fetchClient();
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleClickAddClient() {
    router.push('/oauth/client/create');
  }

  handleEdit = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/setCurrent',
      payload: record,
    });
    router.push('/oauth/client/edit');
  }

  handleDelete = (record) => {
    const { clientId, clientName } = record;
    // ...
    Modal.confirm({
      title: '删除应用',
      content: `确定删除 ${clientName} 这个应用吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.deleteClient({ clientId });
      }
    });
  }

  deleteClient = (client) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/delete',
      payload: client,
      callback: () => {
        message.success('删除成功');
        this.fetchClient();
      },
    });
  }

  handleBatchDelete = () => {
    const { selectedRows } = this.state;
    const count = selectedRows.length;
    const clientNames = selectedRows.map(r => r.clientName).join('、');
    Modal.confirm({
      title: '删除应用',
      content: `确定删除 ${clientNames} 这${count < 2 ? '' : ' ' + count + ' '}个应用吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.batchDelete(selectedRows);
      },
    });
  };

  batchDelete = (rows) => {
    const ids = rows.map(r => r.clientId);
    const { dispatch } = this.props;
    dispatch({
      type: 'client/batchDelete',
      payload: ids,
      callback: () => {
        message.success('删除成功');
        this.fetchClient();
        this.setState({
          selectedRows: [],
        });
      }
    });
  };

  canModify = (record) => {
    if (record && [RootAppId].includes(record.clientId))
      return false;
    return true;
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRows,
        selectedRowKeys
      });
    },
    getCheckboxProps: record => ({
      disabled: !this.canModify(record),
    }),
  };

  render() {
    const {
      client: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, currentRecord, selectedRowKeys } = this.state;
    const { handleUpdateModalVisible, handleUpdate } = this;
    const methods = { handleUpdateModalVisible, handleUpdate };
    return (
      <PageHeaderWrapper title={this.title}>
        <Card bordered={false}>
          <div className={tableStyles.tableList}>
            <div className={tableStyles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleClickAddClient()}>
                创建一个应用
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleBatchDelete}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              rowSelection={this.rowSelection}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              rowKey={this.rowKey}
              selectedRowKeys={selectedRowKeys}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OAuthClient;