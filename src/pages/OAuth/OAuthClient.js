import React, { Component, PureComponent, Fragment } from "react";
import { Card, Form, Tag, Badge, Modal, Button, Input, Divider, message } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from "dva";
import StandardTable from "@/components/StandardTable";
import tableStyles from '@/pages/List/TableList.less';
import router from 'umi/router';
import EditClient from './EditClient';

const FormItem = Form.Item;

export const authTypes = {
  'password': '密码模式',
  'authorization_code': '授权码模式',
  'implicit': '简化模式',
  'client_credentials': '客户端密钥模式',
};
const authTypeColorMap = {
  'password': 'green',
  'authorization_code': 'blue',
  'implicit': 'orange',
  'client_credentials': 'purple',
}

@connect(({ client, loading }) => ({
  client,
  loading: loading.models.client,
}))
class OAuthClient extends PureComponent {

  state = {
    selectedRows: [],
    editModalVisible: false,
    currentRecord: {},
  };

  rowKey = 'clientId';
  title = '应用管理';

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
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>删除</a>
        </Fragment>
      ),
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

  fetchClient() {
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

  handleUpdateModalVisible = (visible, record) => {
    const { dispatch } = this.props;
    this.setState({
      editModalVisible: !!visible,
    });
    dispatch({
      type: 'client/setCurrent',
      payload: record,
    });
  }

  updateClient = (modified) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/update',
      payload: modified,
      callback: () => {
        this.handleUpdateModalVisible(false);
        this.fetchClient();
        message.success('修改成功');
      }
    });
  }

  handleUpdate = (modified) => {
    Modal.confirm({
      title: '修改应用',
      content: `此操作将会影响线上所有客户端，确定修改吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.updateClient(modified);
      }
    });
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
        this.fetchClient();
      },
    });
  }

  render() {
    const {
      client: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, currentRecord } = this.state;
    const { handleUpdateModalVisible, handleUpdate } = this;
    const methods = { handleUpdateModalVisible, handleUpdate };

    return (
      <PageHeaderWrapper title={this.title}>
        <Card bordered={false}>
          <div className={tableStyles.tableList}>
            <div className={tableStyles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleClickAddClient()}>
                创建应用
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              rowKey={this.rowKey}
            />
          </div>
        </Card>
        <EditClient visible={editModalVisible} {...methods} />
      </PageHeaderWrapper>
    );
  }
}

export default OAuthClient;