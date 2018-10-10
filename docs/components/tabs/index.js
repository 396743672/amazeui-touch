const fs = require('fs');
import React from 'react';
import {
  Doc,
  Markdown,
  Highlight,
} from '../../utils';
import Api from './api'

export default class extends React.Component {
  render() {
    return (
      <Doc>
        <Api />
        <Highlight
          demo="tabs"
        >
          {fs.readFileSync(`${__dirname}/../../../kitchen-sink/pages/TabsExample.js`, 'utf-8')}
        </Highlight>
      </Doc>
    );
  }
}


