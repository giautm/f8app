/**
 * @flow
 */

'use strict';

import React from 'react';
import {
  AppState,
  Platform,
  PushNotificationIOS,
} from 'react-native';
import { connect } from 'react-redux';
// $FlowIssue
import PushNotification from 'react-native-push-notification';

import {
  storeDeviceToken,
  receivePushNotification,
  updateInstallation,
  markAllNotificationsAsSeen,
} from './actions';
import type { Dispatch } from './actions/types';

import unseenNotificationsCount from './tabs/notifications/unseenNotificationsCount';

const GCD_SENDER_ID = '1076345567071';

@connect((store) => ({
  badge: unseenNotificationsCount(store) + store.surveys.length,
  enabled: store.notifications.enabled === true,
  tab: store.navigation.tab,
}))
class AppBadgeController extends React.Component {
  props: {
    tab: string;
    enabled: boolean;
    badge: number;
    dispatch: Dispatch;
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    const { dispatch } = this.props;
    PushNotification.configure({
      onRegister: ({ token }) => dispatch(storeDeviceToken(token)),
      onNotification: (notif) => dispatch(receivePushNotification(notif)),
      senderID: GCD_SENDER_ID,
      requestPermissions: this.props.enabled,
    });

    this.updateAppBadge();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.enabled && this.props.enabled) {
      PushNotification.requestPermissions();
    }
    if (this.props.badge !== prevProps.badge) {
      this.updateAppBadge();
    }
    if (this.props.tab === 'notifications' && prevProps.tab !== 'notifications') {
      this.eventuallyMarkNotificationsAsSeen();
    }
  }

  handleAppStateChange = (appState) => {
    if (appState === 'active') {
      this.updateAppBadge();
      if (this.props.tab === 'notifications') {
        this.eventuallyMarkNotificationsAsSeen();
      }
    }
  };

  updateAppBadge() {
    if (this.props.enabled && Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(this.props.badge);
      updateInstallation({ badge: this.props.badge });
    }
  }

  eventuallyMarkNotificationsAsSeen() {
    const { dispatch } = this.props;
    setTimeout(() => dispatch(markAllNotificationsAsSeen()), 1000);
  }

  render() {
    return null;
  }
}

export default AppBadgeController;
