import React from 'react';
import PropTypes from 'prop-types';import cx from 'classnames';
import classNameSpace from './utils/className';
import Icon from './Icon';

class List extends React.Component {

  static propTypes = {
    classPrefix: PropTypes.string.isRequired,
    inset: PropTypes.bool,
  }

  static defaultProps = {
    classPrefix: 'list',
  }

  render() {
    const classNS = classNameSpace(this.props);
    const classSet = classNS.classSet;
    this.prefixClass = classNS.prefixClass;

    const {
      className,
      inset,
      ...props
    } = this.props;

    delete props.classPrefix;

    classSet[this.prefixClass('inset')] = inset;

    // TODO: 使用 ul 可能不是太好的选择，在一些需要定义 component 的场合缺乏灵活性
    return (
      <ul
        {...props}
        className={cx(classSet, className)}
      >
      </ul>
    );
  }
}


class ListItem extends React.Component {

  static propTypes = {
    classPrefix: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['header', 'item']),
    title: PropTypes.node,
    subTitle: PropTypes.node,
    href: PropTypes.string,
    linked: PropTypes.bool, // linked flag for custom href like route Link
    linkComponent: PropTypes.any,
    linkProps: PropTypes.object,
    media: PropTypes.node,
    after: PropTypes.node,
    desc: PropTypes.node,
    nested: PropTypes.oneOf(['input', 'radio', 'checkbox']), // nested field
  }

  static defaultProps = {
    classPrefix: 'item',
    role: 'item'
  }

  renderTitleRow = () => {
    let {
      title,
      subTitle,
      href,
      linkComponent,
    } = this.props;

    let itemTitle = title ? (
      <h3
        key="itemTitle"
        className={this.prefixClass('title')}
      >
        {title}
      </h3>
    ) : null;

    let titleChildren = [
      itemTitle,
      this.renderAddon('after'),
      href || linkComponent ? (
        <Icon
          className={this.prefixClass('icon')}
          name="right"
          key="itemChevron"
        />
      ) : null,
    ];

    return subTitle ? (
      <div
        className={this.prefixClass('title-row')}
        key="itemTitleRow"
      >
        {titleChildren}
      </div>
    ) : titleChildren;
  }

  renderMain = () => {
    let {
      media,
      subTitle,
      desc,
      children
    } = this.props;
    let titleRow = this.renderTitleRow();
    let notJustTitle = media || subTitle || desc || children;

    // remove wrapper if without media/subTitle/children
    return notJustTitle ? (
      <div
        key="itemMain"
        className={this.prefixClass('main')}
      >
        {titleRow}
        {this.renderAddon('subTitle')}
        {this.renderAddon('desc')}
        {children}
      </div>
    ) : titleRow;
  }

  wrapLink = (children) =>{
    let {
      linkComponent,
      linkProps,
      href,
      target,
    } = this.props;

    return linkComponent ?
      React.createElement(linkComponent, linkProps, children) : (
      <a
        href={href}
        target={target}
      >
        {children}
      </a>);
  }

  renderAddon = (type) => {
    return this.props[type] ? (
      <div
        key={'item-' + type}
        className={this.prefixClass(type.toLowerCase())}
      >
        {this.props[type]}
      </div>
    ) : null;
  }

  render() {
    const classNS = classNameSpace(this.props);
    const classSet = classNS.classSet;
    this.prefixClass = classNS.prefixClass;

    let {
      className,
      role,
      subTitle,
      href,
      media,
      children,
      linkComponent,
      linked,
      nested,
      ...props
    } = this.props;

    delete props.classPrefix;
    delete props.title;
    delete props.after;
    delete props.linkProps;
    delete props.desc;

    let itemChildren = [
      this.renderAddon('media'),
      this.renderMain(),
    ];

    classSet[this.prefixClass(nested)] = nested;
    classSet[this.prefixClass('header')] = role === 'header';
    classSet[this.prefixClass('linked')] = href || linkComponent || linked;
    subTitle && (classSet[this.prefixClass('content')] = true);

    return (
      <li
        {...props}
        className={cx(classSet, className)}
      >
        {role === 'header' ? children :
          (href || linkComponent) ? this.wrapLink(itemChildren) : itemChildren}
      </li>
    );
  }
}

List.Item = ListItem;

export default List;

/**
 * TODO:
 * - 可选择列表（嵌套 radio/checkbox）图文混排的列表，
 *   考虑的创建可选择列表时根据 nested 属性自动生产 input，而不用再去嵌套 Field，
 *   以便图文混排选择实现。
 * - UE：用户如何知道这个列表是可以选择的（增加相应的提示文字？）
 * - 易用性：链接如何以更好的方式传入类似 react-router Link 这样的组件？
 */
