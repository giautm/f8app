/**
 * @flow
 */

'use strict';

import {
  Platform,
  VibrationIOS,
} from 'react-native';
import { updateInstallation } from './installation';
import { loadNotifications } from './parse';
import { loadSurveys } from './surveys';
import { switchTab } from './navigation';

import type { Action, ThunkAction } from './types';

type PushNotification = {
  foreground: boolean;
  message: string;
  // react-native-push-notification library sends Object as data
  // on iOS and JSON string on android
  // TODO: Send PR to remove this inconsistency
  data: string | Object;
};

function normalizeData(s: string | Object): Object {
  if (s && typeof s === 'object') {
    return s;
  }
  try {
    return JSON.parse(s);
  } catch (e) {
    return {};
  }
}

export async function storeDeviceToken(deviceToken: string): Promise<Action> {
  console.log('Got device token', deviceToken);
  const pushType = Platform.OS === 'android' ? 'gcm' : undefined;
  await updateInstallation({
    pushType,
    deviceToken,
    deviceTokenLastModified: Date.now(),
  });
  return {
    type: 'REGISTERED_PUSH_NOTIFICATIONS',
  };
}

export function turnOnPushNotifications(): Action {
  return {
    type: 'TURNED_ON_PUSH_NOTIFICATIONS',
  };
}

export function skipPushNotifications(): Action {
  return {
    type: 'SKIPPED_PUSH_NOTIFICATIONS',
  };
}

export function receivePushNotification(notification: PushNotification): ThunkAction {
  return (dispatch) => {
    const {foreground, message } = notification;
    const data = normalizeData(notification.data);

    if (!foreground) {
      dispatch(switchTab('notifications'));
    }

    if (foreground) {
      dispatch(loadNotifications());
      dispatch(loadSurveys());

      if (Platform.OS === 'ios') {
        VibrationIOS.vibrate();
      }
    }

    if (data.e /* ephemeral */) {
      return;
    }

    const timestamp = new Date().getTime();
    dispatch({
      type: 'RECEIVED_PUSH_NOTIFICATION',
      notification: {
        text: message,
        url: data.url,
        time: timestamp,
      },
    });
  };
}

export function markAllNotificationsAsSeen(): Action {
  return {
    type: 'SEEN_ALL_NOTIFICATIONS',
  };
}
