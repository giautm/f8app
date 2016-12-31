/**
 * @flow
 */

'use strict';
import {
  Platform,
} from 'react-native';

const backIcons = {
  android: require('./img/back_white.png'),
  ios: require('./img/x-white.png'),
};

export default backIcons[Platform.OS];
