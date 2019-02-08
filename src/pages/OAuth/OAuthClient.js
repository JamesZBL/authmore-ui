import React, { Component, PureComponent, Fragment } from "react";
import { Card, Form, Tag, Badge } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from "dva";
import StandardTable from "@/components/StandardTable";


const authTypes = {
  'password': '密码模式',
  'authorization_code': '授权码模式',
  'implicit': '简化模式',
  'client_credentials': '客户端密钥模式',
};

@connect(({ client, loading }) => ({
  client,
  loading: loading.models.client,
}))
class OAuthClient extends PureComponent {

  state = {
    selectedRows: [],
  };

  rowKey = 'clientId';

  columns = [
    {
      title: 'AppId',
      dataIndex: 'clientId'
    },
    {
      title: 'AppSecret',
      dataIndex: 'clientSecret',
      render: secret => {
        if(secret) {
          return secret.split('}')[1].substring(0,32) + '...';
        }
      },
    },
    {
      title: '认证方式',
      dataIndex: 'authorizedGrantTypes',
      render: types => (
        <Fragment>
          {types.map(type => <Tag key={authTypes[type]}>{authTypes[type]}</Tag>)}
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
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/fetch',
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      client: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="客户端配置">
        <Card bordered={false}>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            rowKey={this.rowKey}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OAuthClient;