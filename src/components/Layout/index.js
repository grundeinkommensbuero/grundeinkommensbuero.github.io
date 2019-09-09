import React from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import './style.css'
import '../style/base.less'

class Template extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Navigation />
        {children}
        <Footer />
      </div>
    )
  }
}

export default Template
