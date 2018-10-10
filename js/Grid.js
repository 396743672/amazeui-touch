import React from 'react';
import PropTypes from 'prop-types';import cx from 'classnames';
import classNameSpace from "./utils/className";


export default class Grid extends React.Component {

  static propTypes = {
    classPrefix: PropTypes.string.isRequired,
    component: PropTypes.node.isRequired,
    collapse: PropTypes.bool,
    avg: PropTypes.number,
    align: PropTypes.oneOf(['right', 'center', 'between', 'around']),
    wrap: PropTypes.oneOf(['wrap', 'wrap-reverse']),
    bordered: PropTypes.bool,
  }

  static defaultProps = {
      classPrefix: 'g',
      component: 'div',
  }

  render() {
    const classNS = classNameSpace(this.props);
    const classSet = classNS.classSet;
    this.prefixClass = classNS.prefixClass;

    const {
      component: Component,
      className,
      collapse,
      bordered,
      avg,
      align,
      wrap,
      ...props
    } = this.props;

    delete props.classPrefix;

    // .g-collapse
    classSet[this.prefixClass('collapse')] = collapse;

    // .g-bordered
    classSet[this.prefixClass('bordered')] = bordered;

    // .g-wrap
    classSet[this.prefixClass(wrap)] = wrap;

    if (avg) {
      classSet[this.prefixClass('avg-' + avg)] = true;
    }

    if (align) {
      classSet[this.prefixClass(align)] = true;
    }

    return (
      <Component
        {...props}
        className={cx(className, classSet)}
      >
        {this.props.children}
      </Component>
    );
  }
}
