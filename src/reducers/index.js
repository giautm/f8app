/**
 * @flow
 */

'use strict';

import { combineReducers } from 'redux';

export default combineReducers({
  config: require('./config').default,
  notifications: require('./notifications').default,
  maps: require('./maps').default,
  sessions: require('./sessions').default,
  user: require('./user').default,
  schedule: require('./schedule').default,
  topics: require('./topics').default,
  filter: require('./filter').default,
  navigation: require('./navigation').default,
  friendsSchedules: require('./friendsSchedules').default,
  surveys: require('./surveys').default,
});
