import React from 'react';
import Header from './Header';
import Footer from './Footer';
import s from './style.module.less';
import '../style/base.less';

class Template extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    );
  }
}

export default Template;
