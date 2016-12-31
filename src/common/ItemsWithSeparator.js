/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  PixelRatio,
  StyleSheet,
  View,
} from 'react-native';

class ItemsWithSeparator extends React.Component {
  props: {
    style?: any;
    separatorStyle?: any;
    children?: any;
  };

  render() {
    const children = [];
    const lastIndex = React.Children.count(this.props.children) - 1;
    const separatorStyle = [styles.separator, this.props.separatorStyle];
    React.Children.forEach(this.props.children, (child, ii) => {
      children.push(child);
      if (ii !== lastIndex) {
        children.push(<View key={`separator-${ii}`} style={separatorStyle} />);
      }
    });

    return (
      <View style={this.props.style}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#0322500A',
    height: 1 / PixelRatio.get(),
  },
});

export default ItemsWithSeparator;
