/**
 * @flow
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'F8Text';

class Section extends React.Component {
  render() {
    var {children, title} = this.props;
    if (React.Children.count(children) === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title.toUpperCase()}
        </Text>
        {children}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginBottom: 50,
  },
  title: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#A0B7FF',
    textAlign: 'center',
    margin: 10,
  },
});

export default Section;
