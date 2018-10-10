import React from 'react';

class Markdown extends React.Component {

  static defaultProps = {
    component: 'div',
  }

  render() {
    const {
      component: Component,
      children,
      className,
      ...props,
      } = this.props;

    return (
      <Component
        dangerouslySetInnerHTML={{__html: children}}
        className={`markdown-body ${className}`}
        {...props}
      />
    );
  }
}

class Doc extends React.Component {
  // do something here
  render() {
    return (
      <div
        className="doc-content-container"
      >
        <div
          className="doc-content"
        >
          {this.props.children}
          <p
            className="am-text-right doc-version am-text-sm"
          >
            Version: {__VERSION__}
          </p>
        </div>
      </div>
    );
  }
}

import Highlight from './Highlight';
import Prism from './Prism';
import QRCode from './QRCode';

export {
  Markdown,
  Highlight,
  Doc,
  Prism,
  QRCode,
};
