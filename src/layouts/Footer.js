import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '开发手册',
          title: '开发手册',
          href: 'https://doc.authmore.letec.top',
          blankTarget: true,
        },
        {
          key: 'GitHub',
          title: <Icon type="github" />,
          href: 'https://gitee.com/zbl1996',
          blankTarget: true,
        },
        {
          key: '码云',
          title: 'Gitee',
          href: 'https://gitee.com/zbl1996/authmore',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 郑保乐
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
