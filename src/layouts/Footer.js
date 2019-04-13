import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '摆码王子的小屋',
          title: '摆码王子的小屋',
          href: 'https://b.letec.top',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://gitee.com/zbl1996',
          blankTarget: true,
        },
        {
          key: 'gitee',
          title: 'Gitee',
          href: 'https://gitee.com/zbl1996/authmore',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 摆码王子
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
