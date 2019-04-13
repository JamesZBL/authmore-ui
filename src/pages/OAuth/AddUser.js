import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, InputNumber, Radio, Select, Card, Tooltip, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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

@connect(({ ouser, loading }) => ({
  submitting: loading.effects['ouser/add'],
  password: ouser.password,
}))
@Form.create()
class AddUser extends React.PureComponent {

  state = {
    password: '',
  };

  componentDidMount() {
    this.getRandomPwd();
  }

  getRandomPwd = () => {
    const { dispatch, password } = this.props;
    dispatch({
      type: 'ouser/randomPwd',
      callback: (r) => {
        this.setState({
          password: r,
        });
      }
    });
  };

  render() {
    const { form, dispatch, submitting, } = this.props;
    const { password } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push('/ouser/user/index');
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'ouser/add',
            payload: values,
            callback: () => {
              message.success('创建好了');
              setTimeout(() => {
                router.push('/ouser/user/index');
              }, 1000);
            }
          });
        }
      });
    };

    return (
      <PageHeaderWrapper title="创建新用户">
        <Card bordered={false}>
          <Fragment>
            <Form layout="horizontal" className={styles.stepForm}>

              <Form.Item {...formItemLayout} label="用户名">
                {getFieldDecorator('_username', {
                  rules: [{
                    required: true,
                    message: '就这一个名字，不能再少了'
                  }]
                })(<Input placeholder="请输入用户名" maxLength={15} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="密码">
                <Tooltip placement="right" title="自动生成的随机密码，可任意修改">
                  {getFieldDecorator('_password', {
                    initialValue: password,
                    rules: [{
                      required: true,
                      message: '就这一个密码，不能再少了'
                    }]
                  })(<Input.Password placeholder="新用户的密码" maxLength={32} />)}
                </Tooltip>
              </Form.Item>
              <Form.Item {...formItemLayout} label="权限标识">
                {getFieldDecorator('authorities')
                  (<Select mode="tags" placeholder="可填写多项" />)}
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
                <Button type="primary" onClick={onValidateForm} loading={submitting}>提交</Button>
                <Button onClick={onPrev} style={{ marginLeft: 8 }}>返回</Button>
              </Form.Item>
            </Form>
            <Divider style={{ margin: '40px 0 24px' }} />
            <div className={styles.desc}>
              <h3>说明</h3>
              <p>这里添加的用户既可以是管理平台的管理员，也可以是 OAuth 协议四个主体（认证中心、资源服务、客户端、用户）中的用户</p>
              <p>若资源服务有用户注册功能，也可以访问 Authmore 提供的 Web API 进行用户数据的录入</p>
              <p>若添加的用户为平台管理员，则必须添加 SA 权限，普通用户根据资源服务具体功能需求而定</p>
            </div>
          </Fragment>
        </Card>
      </PageHeaderWrapper>);
  }
}

export default AddUser;
