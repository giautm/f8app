/**
 * @flow
 * @providesModule F8SegmentedControl
 */
'use strict';

import React from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from 'F8Text';

class SegmentedControl extends React.Component {
  props: {
    values: Array<string>;
    selectionColor: ?string;
    selectedIndex: number;
    onChange: (newIndex: number) => void;
    style?: any;
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.values.map((value, index) => (
          <Segment
            key={value}
            value={value}
            isSelected={index === this.props.selectedIndex}
            selectionColor={this.props.selectionColor || 'white'}
            onPress={() => this.props.onChange(index)}
          />
        ))}
      </View>
    );
  }
}

class Segment extends React.Component {
  props: {
    value: string;
    isSelected: boolean;
    selectionColor: string;
    onPress: () => void;
  };

  render() {
    let accessibilityTraits = ['button'];
    let deselectedLabelStyle;
    let selectedButtonStyle;
    if (this.props.isSelected) {
      accessibilityTraits.push('selected');
      selectedButtonStyle = { borderColor: this.props.selectionColor };
    } else if (Platform.OS === 'android') {
      deselectedLabelStyle = styles.deselectedLabel;
    }

    return (
      <TouchableOpacity
        accessibilityTraits={accessibilityTraits}
        activeOpacity={0.8}
        onPress={this.props.onPress}
        style={[styles.button, selectedButtonStyle]}>
        <Text style={[styles.label, deselectedLabelStyle]}>
          {this.props.value && this.props.value.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}

const HEIGHT = 32;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        paddingLeft: 60,
      },
      ios: {
        paddingBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  button: {
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        paddingBottom: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 3,
        marginRight: 10,
      },
      ios: {
        height: HEIGHT,
        paddingHorizontal: 20,
        borderRadius: HEIGHT / 2,
        borderWidth: 1,
      },
    }),
  },
  label: {
    letterSpacing: 1,
    fontSize: 12,
    color: 'white',
  },
  deselectedLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default SegmentedControl;
