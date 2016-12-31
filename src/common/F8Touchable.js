/**
 * @flow
 * @providesModule F8Touchable
 */

'use strict';

import React from 'react';
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

function TouchableIOS(props: Object): ReactElement {
  return (
    <TouchableHighlight
      accessibilityTraits="button"
      underlayColor="#3C5EAE"
      {...props}
    />
  );
}

const touchables = {
  android: TouchableNativeFeedback,
  ios: F8TouchableIOS,
};

export default touchables[Platform.OS];
