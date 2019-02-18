import { PureComponent, Fragment, Component } from "react";
import { Form, Input, Button, Alert, Divider, InputNumber, Radio, Select, Modal, Card, message } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { authTypes } from './OAuthClient';
import { connect } from "dva";
import router from 'umi/router';
import styles from '@/pages/Forms/StepForm/style.less';

const { Option } = Select;

@connect(({ client, loading }) => ({
  recordForm: client.currentRecord,
  scoped: client.currentRecord.scoped,
  submitting: loading.effects['client/update'],
}))
@Form.create()
class EditClient extends PureComponent {

  state = {
    scoped: this.props.scoped,
  };

  componentDidMount() {
    const { recordForm } = this.props;
    if (!recordForm.clientId) router.push('/');
  }

  handleScopedChange = ({ target: { value } }) => {
    this.setState({
      scoped: value,
    });
  };

  onSubmit = () => {
    const { form, recordForm } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { clientId } = recordForm;
        values = { ...values, clientId };
        this.handleUpdate(values);
      }
    });
  };

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

  updateClient = (modified) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/update',
      payload: modified,
      callback: () => {
        message.success('修改成功');
        setTimeout(() => {
          router.push('/oauth/client/index');
        }, 1000);
      }
    });
  }

  onPrev = () => {
    router.push('/oauth/client/index');
  }

  render() {
    const { onSubmit, onPrev } = this;
    const { location, recordForm, submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <PageHeaderWrapper title={recordForm.clientName || recordForm.clientId}>
        <Card bordered={false}>
          <Fragment>
            <Form layout="horizontal" className={styles.stepForm}>
              <Alert
                closable
                showIcon
                message="这里的信息修改后将影响线上所有客户端，请谨慎修改！"
                style={{ marginBottom: 24 }}
              />
              <Form.Item label="应用名称" {...formItemLayout}>
                {getFieldDecorator('clientName', {
                  rules: [{ required: true, message: '请输入应用名称' }],
                  initialValue: recordForm.clientName,
                })(<Input placeholder="请输入应用名称" />)}
              </Form.Item>
              {/* 授权方式 */}
              <Form.Item {...formItemLayout} label="授权方式">
                {getFieldDecorator('authorizedGrantTypes', {
                  rules: [{
                    required: true,
                    message: '请选择至少一种授权方式'
                  }],
                  initialValue: recordForm.authorizedGrantTypes,
                })(
                  <Select
                    mode="multiple"
                    placeholder="应用的授权方式（可多选）">
                    {Object.keys(authTypes).map(k => <Option key={k} value={k}>{authTypes[k]}</Option>)}
                  </Select>
                )}
              </Form.Item>
              {/* 回调 URI */}
              <Form.Item {...formItemLayout} label="回调 URI">
                {getFieldDecorator('registeredRedirectUri', { initialValue: recordForm.registeredRedirectUri })
                  (<Select mode="tags" placeholder="应用授权的回调地址，可有多项" />)}
              </Form.Item>
              {/* 资源服务 id */}
              <Form.Item {...formItemLayout} label="资源服务ID">
                {getFieldDecorator('resourceIds', { initialValue: recordForm.resourceIds })
                  (<Select mode="tags" placeholder="应用将要访问的资源服务ID，可有多项" />)}
              </Form.Item>
              {/* 应用权限 */}
              <Form.Item {...formItemLayout} label="权限标识">
                {getFieldDecorator('authorities', { initialValue: recordForm.authorities })
                  (<Select mode="tags" placeholder="可有多项（仅在客户端密钥模式下生效）" />)}
              </Form.Item>
              {/* 令牌有效时间 */}
              <Form.Item {...formItemLayout} label="令牌有效时间">
                {getFieldDecorator('accessTokenValiditySeconds', {
                  rules: [
                    {
                      required: true,
                      message: '请输入有效时间（1 - 99999999）'
                    }
                  ],
                  initialValue: recordForm.accessTokenValiditySeconds,
                })(<InputNumber min={1} max={99999999} />)}
                <span className="ant-form-text">秒</span>
              </Form.Item>
              {/* 刷新令牌有效时间 */}
              <Form.Item {...formItemLayout} label="刷新令牌有效时间">
                {getFieldDecorator('refreshTokenValiditySeconds', {
                  rules: [
                    {
                      required: false,
                      message: '请输入有效的时间（1 - 99999999）'
                    }
                  ],
                  initialValue: recordForm.refreshTokenValiditySeconds,
                })(<InputNumber min={1} max={99999999} />)}
                <span className="ant-form-text">秒</span>
              </Form.Item>
              {/* 作用域 */}
              {this.state.scoped && (
                <Form.Item {...formItemLayout} label="访问范围">
                  {getFieldDecorator('scope', {
                    initialValue: recordForm.scope,
                  })(<Select mode="tags" placeholder="例如：AVATAR,PROFILE" />)}
                </Form.Item>
              )}
              {/* 是否限制作用域 */}
              <Form.Item {...formItemLayout} label="限制访问范围">
                {getFieldDecorator('scoped', {
                  initialValue: recordForm.scoped,
                })(
                  <Radio.Group onChange={this.handleScopedChange}>
                    <Radio value={false}>不限制</Radio>
                    <Radio value={true}>限制</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {/* 自动确认授权 */}
              <Form.Item {...formItemLayout} label="自动授权">
                {getFieldDecorator('isAutoApprove', {
                  initialValue: recordForm.autoApprove,
                })(
                  <Radio.Group>
                    <Radio value={true}>登录后自动授权</Radio>
                    <Radio value={false}>提示后手动确认授权</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 8 }}
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: {
                    span: formItemLayout.wrapperCol.span,
                    offset: formItemLayout.labelCol.span,
                  },
                }}
                label=""
              >
                <Button type="primary" onClick={onSubmit} loading={submitting}>提交</Button>
                <Button onClick={onPrev} style={{ marginLeft: 8 }}>返回</Button>
              </Form.Item>
            </Form>
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default EditClient;