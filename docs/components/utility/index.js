const fs = require('fs');
import React from 'react';
import {
  Doc,
} from '../../utils';

import Api from './api.md'

export default class extends React.Component {
  render() {
    return (
      <Doc>
        <Api />
      </Doc>
    );
  }
}


