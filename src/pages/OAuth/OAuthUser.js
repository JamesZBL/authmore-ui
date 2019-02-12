import React, { Component, PureComponent, Fragment } from "react";
import { Card, Form, Tag, Badge, Modal, Button, Input, Divider, Switch, Icon, message, Tooltip } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from "dva";
import StandardTable from "@/components/StandardTable";
import tableStyles from '@/pages/List/TableList.less';
import router from 'umi/router';
import EditClient from './EditClient';

const getStatus = (record) => {
  const { enabled } = record;
  const status = enabled ? 'processing' : 'error';
  const desc = enabled ? '使用中' : '已停用';
  return { status, desc };
}

@connect(({ ouser, loading }) => ({
  data: ouser.data,
  loading: loading.models.ouser,
  switchLoading: loading.effects['ouser/update'],
}))
class OAuthUser extends PureComponent {

  state = {
    selectedRows: [],
    currentRecord: {},
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ouser/fetch',
    });
  }

  handleAddUser = () => {
    router.push('/ouser/user/create');
  };

  onSwitchChange = (record) => {
    const { dispatch } = this.props;
    const form = { ...record, enabled: !record.enabled };
    dispatch({
      type: 'ouser/update',
      payload: form,
      callback: () => {
        const msg = record.enabled ? '该用户已暂时停用' : '该用户已成功启用';
        const call = record.enabled ? message.warn : message.success;
        call(`${msg}`);
        this.fetchUsers();
      },
    })
  };

  handleDelete = (record) => {
    const { username } = record;
    // ...
    Modal.confirm({
      title: '删除用户',
      content: `确定删除 ${username} 这个用户吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.deleteUser(record);
      }
    });
  };

  deleteUser = (user) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ouser/delete',
      payload: user,
      callback: () => {
        message.success('删除成功');
        this.fetchUsers();
      },
    });
  };

  handleEdit = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ouser/setCurrent',
      payload: record,
    });
    router.push('/ouser/user/edit');
  };

  canModify = (record) => {
    if (record && ['rob', 'tom', 'james'].includes(record.username))
      return false;
    return true;
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRows: selectedRows,
      });
    },
    getCheckboxProps: record => ({
      disabled: !this.canModify(record),
    }),
  };

  handleBatchDelete = () => {
    const { selectedRows } = this.state;
    const count = selectedRows.length;
    const usernames = selectedRows.map(r => r.username).join('、');
    Modal.confirm({
      title: '删除用户',
      content: `确定删除 ${usernames} 这${count < 2 ? '' : ' ' + count + ' '}个用户吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.batchDelete(selectedRows);
      },
    });
  };

  batchDelete = (rows) => {
    const ids = rows.map(r => r.id);
    const { dispatch } = this.props;
    dispatch({
      type: 'ouser/batchDelete',
      payload: ids,
      callback: () => {
        message.success('删除成功');
        this.fetchUsers();
        this.setState({
          selectedRows: [],
        });
      }
    });
  };

  rowKey = 'id';
  title = 'OAuth 认证系统用户';

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username, record) => {
        return username || record.id;
      }
    },
    {
      title: '权限标识',
      dataIndex: 'authorities',
      render: authorities => (
        <Fragment>
          {authorities.map(a => <Tag key={a.authority}>{a.authority}</Tag>)}
        </Fragment>
      )
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      render: (value, record) => {
        const { status, desc } = getStatus(record);
        return <Badge status={status} text={desc} />;
      }
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      render: (enabled, record) => {
        const { onSwitchChange } = this;
        const disabled = !this.canModify(record);
        let status = {};
        if (enabled) status = { defaultChecked: true };
        status = { ...status, disabled };
        let title = undefined;
        if (disabled) title = '这个用户不能停用哦';
        return (
          <Tooltip title={title}>
            <Switch onChange={() => onSwitchChange(record)}
              checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />}
              {...status} loading={this.props.switchLoading} />
          </Tooltip>
        )
      }
    },
    {
      title: '操作',
      width: 120,
      render: (text, record) => {
        let onClick = () => this.handleDelete(record);
        const canModify = this.canModify(record);
        if (!canModify) onClick = () => { message.warn('这个用户不能删除哦') };
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

  render() {
    const { data, loading } = this.props;
    const { selectedRows, currentRecord } = this.state;

    return (
      <PageHeaderWrapper title={this.title}>
        <Card bordered={false}>
          <div className={tableStyles.tableList}>
            <div className={tableStyles.tableListOperator}>
              <Button icon="user-add" type="primary" onClick={this.handleAddUser}>
                创建一个用户
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
              rowKey={this.rowKey}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OAuthUser;