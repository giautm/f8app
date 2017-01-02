/**
 * @flow
 * @providesModule F8TabsView
 */

'use strict';

import React from 'react';
import {
  Navigator,
  TabBarIOS,
} from 'react-native';
const TabBarItemIOS = TabBarIOS.Item;
import F8Colors from 'F8Colors';
import F8InfoView from 'F8InfoView';
import F8MapView from 'F8MapView';
import F8NotificationsView from 'F8NotificationsView';
import GeneralScheduleView from './schedule/GeneralScheduleView';
import MyScheduleView from './schedule/MyScheduleView';
import unseenNotificationsCount from './notifications/unseenNotificationsCount';

import { switchTab } from '../actions';
import { connect } from 'react-redux';

import type {Tab, Day} from '../reducers/navigation';

class F8TabsView extends React.Component {
  props: {
    tab: Tab;
    day: Day;
    onTabSelect: (tab: Tab) => void;
    navigator: Navigator;
  };

  onTabSelect(tab: Tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    var scheduleIcon = this.props.day === 1
      ? require('./schedule/img/schedule-icon-1.png')
      : require('./schedule/img/schedule-icon-2.png');
    var scheduleIconSelected = this.props.day === 1
      ? require('./schedule/img/schedule-icon-1-active.png')
      : require('./schedule/img/schedule-icon-2-active.png');
    return (
      <TabBarIOS tintColor={F8Colors.darkText}>
        <TabBarItemIOS
          title="Schedule"
          selected={this.props.tab === 'schedule'}
          onPress={this.onTabSelect.bind(this, 'schedule')}
          icon={scheduleIcon}
          selectedIcon={scheduleIconSelected}>
          <GeneralScheduleView
            navigator={this.props.navigator}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="My F8"
          selected={this.props.tab === 'my-schedule'}
          onPress={this.onTabSelect.bind(this, 'my-schedule')}
          icon={require('./schedule/img/my-schedule-icon.png')}
          selectedIcon={require('./schedule/img/my-schedule-icon-active.png')}>
          <MyScheduleView
            navigator={this.props.navigator}
            onJumpToSchedule={() => this.props.onTabSelect('schedule')}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Maps"
          selected={this.props.tab === 'map'}
          onPress={this.onTabSelect.bind(this, 'map')}
          icon={require('./maps/img/maps-icon.png')}
          selectedIcon={require('./maps/img/maps-icon-active.png')}>
          <F8MapView />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Notifications"
          selected={this.props.tab === 'notifications'}
          onPress={this.onTabSelect.bind(this, 'notifications')}
          badge={this.props.notificationsBadge || null}
          icon={require('./notifications/img/notifications-icon.png')}
          selectedIcon={require('./notifications/img/notifications-icon-active.png')}>
          <F8NotificationsView navigator={this.props.navigator} />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Info"
          selected={this.props.tab === 'info'}
          onPress={this.onTabSelect.bind(this, 'info')}
          icon={require('./info/img/info-icon.png')}
          selectedIcon={require('./info/img/info-icon-active.png')}>
          <F8InfoView navigator={this.props.navigator} />
        </TabBarItemIOS>
      </TabBarIOS>
    );
  }

}

function select(store) {
  return {
    tab: store.navigation.tab,
    day: store.navigation.day,
    notificationsBadge: unseenNotificationsCount(store) + store.surveys.length,
  };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

export default connect(select, actions)(F8TabsView);
