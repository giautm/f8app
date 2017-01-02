/**
 * @flow
 */

'use strict';

import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import F8Colors from 'F8Colors';
import { Text } from 'F8Text';
import F8Touchable from 'F8Touchable';


class MenuItem extends React.Component {
  props: {
    icon: number;
    selectedIcon: number;
    selected: boolean;
    title: string;
    badge: ?string;
    onPress: () => void;
  };

  render() {
    var icon = this.props.selected ? this.props.selectedIcon : this.props.icon;
    var selectedTitleStyle = this.props.selected && styles.selectedTitle;
    var badge;
    if (this.props.badge) {
      badge = (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {this.props.badge}
          </Text>
        </View>
      );
    }
    return (
      <F8Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <Image style={styles.icon} source={icon} />
          <Text style={[styles.title, selectedTitleStyle]}>
            {this.props.title}
          </Text>
          {badge}
        </View>
      </F8Touchable>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: F8Colors.lightText,
  },
  selectedTitle: {
    color: F8Colors.darkText,
  },
  badge: {
    backgroundColor: '#DC3883',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
});

export default MenuItem;
