/**
 * @providesModule AppRoot
 * @flow
 */

'use strict';

import React from 'react';
import {
  AppState,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import CodePush from 'react-native-code-push';
import { connect } from 'react-redux';
import {
  loadConfig,
  loadMaps,
  loadNotifications,
  loadSessions,
  loadFriendsSchedules,
  loadSurveys,
  updateInstallation,
} from './actions';
import { version } from './env.js';

import AppNavigator from './AppNavigator';
import LoginScreen from './login/LoginScreen';
import PushNotificationsController from './PushNotificationsController';

@connect(({ user }) => ({
  isLoggedIn: user.isLoggedIn || user.hasSkippedLogin,
}))
class AppRoot extends React.Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // TODO: Make this list smaller, we basically download the whole internet
    this.props.dispatch(loadNotifications());
    this.props.dispatch(loadMaps());
    this.props.dispatch(loadConfig());
    this.props.dispatch(loadSessions());
    this.props.dispatch(loadFriendsSchedules());
    this.props.dispatch(loadSurveys());

    updateInstallation({ version });
    CodePush.sync({ installMode: CodePush.InstallMode.ON_NEXT_RESUME });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (appState) => {
    if (appState === 'active') {
      this.props.dispatch(loadSessions());
      this.props.dispatch(loadNotifications());
      this.props.dispatch(loadSurveys());
      CodePush.sync({ installMode: CodePush.InstallMode.ON_NEXT_RESUME });
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      return (
        <View style={styles.container}>
          <StatusBar
            translucent={true}
            backgroundColor="rgba(0, 0, 0, 0.2)"
            barStyle="light-content"
           />
          <AppNavigator />
          <PushNotificationsController />
        </View>
      );
    }

    return <LoginScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppRoot;
