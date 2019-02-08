import React, { Component, PureComponent, Fragment } from "react";
import { Card, Form, Tag, Badge, Modal, Button, Input } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from "dva";
import StandardTable from "@/components/StandardTable";
import tableStyles from '@/pages/List/TableList.less';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {

  handleSubmit = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      handleAdd(values);
      form.resetFields();
    })
  }

  handleCancle = () => {
    const { handleModalVisible, form } = this.props;
    form.resetFields();
    handleModalVisible(false);
  }

  render() {
    const { modalVisible, form } = this.props;
    return (
      <Modal visible={modalVisible} onOk={this.handleSubmit} onCancel={this.handleCancle}>
        <FormItem key="clientName" label="应用名称">
          {form.getFieldDecorator('clientName', {
            rules: [{ required: true, message: '请输入应用名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

const CreateResultModal = props => {
  const { modalVisible, handleModalVisible, clientId, clientSecret } = props;

  return (
    <Modal
      visible={modalVisible}
      title="应用创建结果"
      onOk={() => handleModalVisible()}
      onCancel={() => handleModalVisible()}
    >
      AppId:  {clientId}<br />
      AppSecret: {clientSecret}
    </Modal>
  );
};

const authTypes = {
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
    resultModalVisible: false,
    createModalVisible: false,
    clientId: 'xxx',
    clientSecret: 'xxx',
  };

  rowKey = 'clientId';
  title = '应用管理';

  columns = [
    // {
    //   title: 'AppId',
    //   dataIndex: 'clientId'
    // },
    {
      title: '应用名称',
      dataIndex: 'clientName',
    },
    // {
    //   title: 'AppSecret',
    //   dataIndex: 'clientSecret',
    //   render: secret => {
    //     if(secret) {
    //       return secret.split('}')[1].substring(0,32) + '...';
    //     }
    //   },
    // },
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
      render: val => val[0],
    },
    {
      title: '令牌有效期',
      dataIndex: 'accessTokenValiditySeconds',
      render: val => {
        if (val < 3600) {
          return `${val / 60} 分钟`
        }
        return `${val / 3600} 小时`
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

  handleClickAddClient() {
    this.handleCreateModalVisible(true);
  }

  handleResultModalVisible = flag => {
    this.setState({
      resultModalVisible: !!flag,
    });
  }

  handleCreateModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag,
    });
  }

  handleAddClient = form => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/add',
      payload: form,
      callback: val => {
        const { clientId, clientSecret } = val;
        this.setState({
          clientId,
          clientSecret,
          createModalVisible: false,
          resultModalVisible: true,
        });
      }
    });
  }

  render() {
    const {
      client: { data },
      loading,
    } = this.props;
    const { selectedRows, resultModalVisible: modalVisible } = this.state;
    const parentMethods = { handleModalVisible: this.handleResultModalVisible };
    const createFormProps = {
      handleModalVisible: this.handleCreateModalVisible,
      modalVisible: this.state.createModalVisible,
      handleAdd: this.handleAddClient,
    };

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
        <CreateResultModal modalVisible={modalVisible} {...parentMethods} {...data} />
        <CreateForm {...createFormProps} />
      </PageHeaderWrapper>
    );
  }
}

export default OAuthClient;