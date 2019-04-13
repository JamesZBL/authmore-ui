import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/authmore.png';
import { docLink } from '@/config';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: docLink,
  },
  {
    key: 'community',
    title: '社区',
    href: 'https://gitee.com/zbl1996/authmore/',
  },
  {
    key: 'terms',
    title: '开源许可',
    href: 'https://gitee.com/zbl1996/authmore/blob/master/LICENSE',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 摆码王子
  </Fragment>
);

const UserLayout = ({ children }) => (
  // @TODO <DocumentTitle title={this.getPageTitle()}>
  <div className={styles.container}>
    <div className={styles.lang}>
      <SelectLang />
    </div>
    <div className={styles.content}>
      <div className={styles.top}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>Authmore</span>
          </Link>
        </div>
        <div className={styles.desc}>Authmore 是一个基于 OAuth2.0 协议跨应用认证授权开发套件</div>
      </div>
      {children}
    </div>
    <GlobalFooter links={links} copyright={copyright} />
  </div>
);

export default UserLayout;
