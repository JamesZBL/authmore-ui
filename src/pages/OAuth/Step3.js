import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from '@/pages/Forms/StepForm/style.less';

@connect(({ client }) => ({
  addResult: client.addResult,
}))
class Step3 extends React.PureComponent {

  componentDidMount() {
    const { addResult } = this.props;
    if(!addResult.clientId) router.push('/');
  }

  render() {
    const { addResult } = this.props;
    const onFinish = (flag) => {
      if (!!flag) router.push('/oauth/client/create/1');
      else router.push('/oauth/client/index');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            AppId：
          </Col>
          <Col xs={24} sm={16}>
            {addResult.clientId}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            AppSecret：
          </Col>
          <Col xs={24} sm={16}>
            {addResult.clientSecret}
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={() => onFinish(true)}>
          再创建一个
        </Button>
        <Button onClick={() => onFinish()}>返回首页</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="创建成功"
        description="请妥善保存 AppId 和 AppSecret, 不要下发到客户端！"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
