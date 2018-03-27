import React, { Component } from 'react';
import PropTypes from 'prop-types';

import baseTheme from '../../themes/vanilla';
import { colorIsDark, deepMerge } from '../../utils';

import StyledGrommet from './StyledGrommet';
import doc from './doc';

const createAnnouncer = () => {
  const announcer = document.createElement('div');
  announcer.style.left = '-100%';
  announcer.style.right = '100%';
  announcer.style.position = 'fixed';
  announcer.style['z-index'] = '-1';

  document.body.insertBefore(announcer, document.body.firstChild);

  return announcer;
};

class Grommet extends Component {
  static childContextTypes = {
    grommet: PropTypes.object,
    theme: PropTypes.object,
  }

  getChildContext() {
    const { theme } = this.props;

    const mergedTheme = deepMerge(baseTheme, theme);
    const color = mergedTheme.global.colors.background;
    const dark = color ? colorIsDark(color) : false;

    return {
      grommet: {
        announce: this.announce,
        dark,
      },
      theme: mergedTheme,
    };
  }

  announce = (message, mode = 'polite') => {
    // we only create a new container if we don't have one already
    // we create a separate node so that grommet does not set aria-hidden to it
    const announcer = document.body.querySelector('[aria-live]') || createAnnouncer();

    announcer.setAttribute('aria-live', 'off');
    announcer.innerHTML = message;
    announcer.setAttribute('aria-live', mode);
    setTimeout(() => {
      announcer.innerHTML = '';
    }, 500);
  }

  render() {
    const {
      children,
      theme,
      ...rest
    } = this.props;

    return (
      <StyledGrommet {...rest} theme={deepMerge(baseTheme, theme)}>
        {children}
      </StyledGrommet>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Grommet);
}

export default Grommet;
