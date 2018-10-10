// @see https://github.com/substack/brfs/issues/39#issuecomment-77368613
const fs = require('fs');
import React from 'react';
import {
  Doc,
  Highlight,
} from '../../utils';

import Api from './api'

export default class extends React.Component {
  render() {
    return (
      <Doc>
        <Api />
        <Highlight
          demo="accordion"
        >
          {fs.readFileSync(`${__dirname}/../../../kitchen-sink/pages/AccordionExample.js`, 'utf-8')}
        </Highlight>
      </Doc>
    );
  }
}
