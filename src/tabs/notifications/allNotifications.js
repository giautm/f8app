/**
 * @flow
 */
'use strict';

import { createSelector } from 'reselect';

import type {Notification} from '../../reducers/notifications';

// Merges lists of notifications from server and notifications
// received via push and makes sure there is no duplicates.
function mergeAndSortByTime(server: Array<Notification>, push: Array<Notification>): Array<Notification> {
  const uniquePush = push.filter((pushNotification) => {
    const existsOnServer = server.find(
      (serverNotification) => serverNotification.text === pushNotification.text
    );
    return !existsOnServer;
  });

  const all = [].concat(server, uniquePush);
  return all.sort((a, b) => b.time - a.time);
}

export default createSelector(
  (store) => store.notifications.server,
  (store) => store.notifications.push,
  mergeAndSortByTime
);
