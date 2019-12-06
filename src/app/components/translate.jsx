import * as React from 'react';
import { I18nContext } from '../index';
import { translate } from '../../translations/translate';


const tl = (key) => (
  <I18nContext.Consumer>
    {({ language }) => (
      <React.Fragment>
        {translate(key, language)}
      </React.Fragment>
    )}
  </I18nContext.Consumer>
)

export { tl, translate as t };