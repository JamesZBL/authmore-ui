import { PureComponent, Fragment, Component } from "react";
import { Form, Input, Button, Alert, Divider, InputNumber, Radio, Select, Modal, Card, message } from "antd";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { authTypes } from './OAuthClient';
import { connect } from "dva";
import router from 'umi/router';
import styles from '@/pages/Forms/StepForm/style.less';

const { Option } = Select;

@connect(({ ouser, loading }) => ({
  recordForm: ouser.current,
  submitting: loading.effects['ouser/updateAll'],
}))
@Form.create()
class EditUser extends PureComponent {

  componentDidMount() {
    const { recordForm } = this.props;
    if (!recordForm || !recordForm.id) router.push('/ouser/user/index');
  }

  canModify = (form) => {
    const { _username, authorities } = form;
    if (_username === 'root') {
      console.log(form);
      if (authorities && !authorities.includes('SA') || !authorities) {
        message.error('这个用户不能没有 SA 权限');
        return false;
      }
    }
    return true;
  }

  onSubmit = () => {
    const { form, recordForm } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (!this.canModify(values))
          return;
        const { id } = recordForm;
        const { _username, _password, authorities } = values;
        const form = {
          authorities,
          username: _username,
          password: _password,
          id,
        };
        this.handleUpdate(form);
      }
    });
  };

  handleUpdate = (modified) => {
    Modal.confirm({
      title: '修改应用',
      content: `此操作将会影响线上登录的用户，确定修改吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.updateUser(modified);
      }
    });
  }

  updateUser = (modified) => {
    const { dispatch } = this.props;
    const { _username, _password } = modified;
    dispatch({
      type: 'ouser/updateAll',
      payload: modified,
      callback: () => {
        message.success('修改成功');
        setTimeout(() => {
          router.push('/ouser/user/index');
        }, 1000);
      }
    });
  }

  onPrev = () => {
    router.push('/ouser/user/index');
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

    const { username, authorities } = recordForm;

    return (
      <PageHeaderWrapper title={recordForm.username || recordForm.id}>
        <Card bordered={false}>
          <Fragment>
            <Form layout="horizontal" className={styles.stepForm}>
              <Alert
                closable
                showIcon
                message="这里的信息修改后将影响线上登录的用户，请谨慎修改！"
                style={{ marginBottom: 24 }}
              />
              <Form.Item {...formItemLayout} label="用户名">
                {getFieldDecorator('_username', {
                  initialValue: username,
                  rules: [{
                    required: true,
                    message: '就这一个名字，不能再少了'
                  }]
                })(<Input disabled placeholder="请输入用户名" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="密码">
                {getFieldDecorator('_password')
                  (<Input.Password placeholder="请输入新密码，如无需修改请留空" maxLength={32} />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="权限标识">
                {getFieldDecorator('authorities', { initialValue: authorities })
                  (<Select mode="tags" placeholder="可填写多项" />)}
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
                label="">
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

export default EditUser;