import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, Alert, Divider, InputNumber, Radio, Select
} from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from '@/pages/Forms/StepForm/style.less';
import { authTypes } from './OAuthClient';

const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ client, loading }) => ({
  submitting: loading.effects['client/saveDetail'],
  addForm: client.addForm,
}))
@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, dispatch, submitting, addForm } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push('/oauth/client/create/1');
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          const payload = { ...addForm, ...values };
          dispatch({
            type: 'client/saveDetail',
            payload,
          });
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        {/* 授权方式 */}
        <Form.Item {...formItemLayout} label="授权方式">
          {getFieldDecorator('authorizedGrantTypes', {
            rules: [{
              required: true,
              message: '请选择至少一种授权方式'
            }]
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
          {getFieldDecorator('registeredRedirectUri')
            (<Select mode="tags" placeholder="应用授权的回调地址，可有多项" />)}
        </Form.Item>
        {/* 资源服务 id */}
        <Form.Item {...formItemLayout} label="资源服务ID">
          {getFieldDecorator('resourceIds')
            (<Select mode="tags" placeholder="应用将要访问的资源服务ID，可有多项" />)}
        </Form.Item>
        {/* 应用权限 */}
        <Form.Item {...formItemLayout} label="权限标识">
          {getFieldDecorator('authorities')
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
            ]
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
            ]
          })(<InputNumber min={1} max={99999999} />)}
          <span className="ant-form-text">秒</span>
        </Form.Item>
        {/* 作用域 */}
        <Form.Item {...formItemLayout} label="作用域标识">
          {getFieldDecorator('scope')
            (<Select mode="tags" placeholder="例如：READ,WRITE" />)}
        </Form.Item>
        {/* 是否限制作用域 */}
        <Form.Item {...formItemLayout} label="是否限制作用域">
          {getFieldDecorator('scoped', {
            initialValue: false,
          })(
            <Radio.Group>
              <Radio value={false}>不限制</Radio>
              <Radio value={true}>限制</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {/* 提交、上一步 */}
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
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;
