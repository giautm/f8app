/**
 * @providesModule AppNavigator
 * @flow
 */

'use strict';

import React from 'react';
import {
  BackAndroid,
  Navigator,
  Platform,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { switchTab } from './actions';

const FilterScreen = require('./filter/FilterScreen');
const LoginModal = require('./login/LoginModal');
const RatingScreen = require('./rating/RatingScreen');

const F8TabsView = require('F8TabsView');
const FriendsScheduleView = require('./tabs/schedule/FriendsScheduleView');
const SessionsCarousel = require('./tabs/schedule/SessionsCarousel');
const SharingSettingsModal = require('./tabs/schedule/SharingSettingsModal');
const SharingSettingsScreen = require('./tabs/schedule/SharingSettingsScreen');
const ThirdPartyNotices = require('./tabs/info/ThirdPartyNotices');

@connect((store) => ({
  isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  tab: store.navigation.tab,
}))
class AppNavigator extends React.Component {
  static childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  };

  _handlers: Array<() => boolean> = [],

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  }

  addBackButtonListener = (listener) => {
    this._handlers.push(listener);
  };

  removeBackButtonListener = (listener) => {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  };

  handleBackButton = () => {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const { navigator } = this.navigator;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'schedule') {
      this.props.dispatch(switchTab('schedule'));
      return true;
    }

    return false;
  };

  renderScene = (route, navigator) => {
    if (route.allSessions) {
      return <SessionsCarousel {...route} navigator={navigator} />;
    }
    if (route.session) {
      return <SessionsCarousel navigator={navigator} session={route.session} />;
    }
    if (route.filter) {
      return <FilterScreen navigator={navigator} />;
    }
    if (route.friend) {
      return <FriendsScheduleView navigator={navigator} friend={route.friend} />;
    }
    if (route.login) {
      return <LoginModal navigator={navigator} onLogin={route.callback} />;
    }
    if (route.share) {
      return <SharingSettingsModal navigator={navigator} />;
    }
    if (route.shareSettings) {
      return <SharingSettingsScreen navigator={navigator} />;
    }
    if (route.rate) {
      return <RatingScreen navigator={navigator} surveys={route.surveys} />;
    }
    if (route.notices) {
      return <ThirdPartyNotices navigator={navigator} />;
    }

    return <F8TabsView navigator={navigator} />;
  };

  render() {
    return (
      <Navigator
        configureScene={(route) => {
          if (Platform.OS === 'android') {
            return Navigator.SceneConfigs.FloatFromBottomAndroid;
          }
          // TODO: Proper scene support
          if (route.shareSettings || route.friend) {
            return Navigator.SceneConfigs.FloatFromRight;
          } else {
            return Navigator.SceneConfigs.FloatFromBottom;
          }
        }}
        initialRoute={{}}
        ref={(ref) => this.navigator = ref}
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default AppNavigator;
