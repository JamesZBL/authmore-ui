import { Form, Input, Button, Alert, Divider, InputNumber, Radio, Select, Modal } from "antd";
import { authTypes } from './OAuthClient';
import { connect } from "dva";
import { PureComponent } from "react";

const { TextArea } = Input;
const { Option } = Select;

@connect(({ client, loading }) => ({
  loading: loading.effects['client/update'],
  record: client.currentRecord,
}))
@Form.create()
class EditClient extends PureComponent {

  render() {
    const { form, visible, record, handleUpdateModalVisible, loading, handleUpdate } = this.props;
    const recordForm = {
      ...record,
      authorities: record && record.authorities && record.authorities.map(a => a.authority) || [],
    };
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6, offset: 2 },
      wrapperCol: { span: 12 },
    };
    const width = 750;
    const onSubmit = () => {
      form.validateFields((err, values) => {
        if (!err) {
          const { clientId } = recordForm;
          values = { ...values, clientId };
          handleUpdate(values);
          form.resetFields();
        }
      });
    };
    const onCancel = () => handleUpdateModalVisible(false);

    return (
      <Modal confirmLoading={loading} visible={visible} onOk={onSubmit} onCancel={onCancel} title="修改应用信息" width={width}>
        <Form layout="horizontal">
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
                {
                  Object.keys(authTypes).map(k =>
                    <Option key={k} value={k}>{authTypes[k]}</Option>
                  )
                }
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
          <Form.Item {...formItemLayout} label="作用域标识">
            {getFieldDecorator('scope', { initialValue: recordForm.scope })
              (<Select mode="tags" placeholder="例如：READ,WRITE" />)}
          </Form.Item>
          {/* 是否限制作用域 */}
          <Form.Item {...formItemLayout} label="是否限制作用域">
            {getFieldDecorator('scoped', {
              initialValue: recordForm.scoped,
            })(
              <Radio.Group>
                <Radio value={false}>不限制</Radio>
                <Radio value={true}>限制</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default EditClient;