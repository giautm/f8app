/**
 * @flow
 * @providesModule F8PageControl
 */
'use strict';

import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

const Circle = ({ isSelected }) => (
  <View style={[styles.circle, isSelected ? styles.full : styles.empty]} />
);

class PageControl extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
    count: PropTypes.number.isRequired,
    selectedIndex: PropTypes.number.isRequired,
  };

  render() {
    const images = [];
    for (let i = 0; i < this.props.count; i++) {
      images.push(<Circle key={i} isSelected={this.props.selectedIndex === i} />);
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.innerContainer}>
          {images}
        </View>
      </View>
    );
  }
}

const CIRCLE_SIZE = 4;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
  },
  circle: {
    margin: 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  full: {
    backgroundColor: '#fff',
  },
  empty: {
    backgroundColor: '#fff5',
  },
});

export default PageControl;

export const __cards__ = (define) => {
  define('Simple 2', () => <PageControl count={2} selectedIndex={0} />);
  define('Simple 5', () => <PageControl count={5} selectedIndex={2} />);
};
