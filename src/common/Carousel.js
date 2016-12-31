/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  StyleSheet,
  Platform,
} from 'react-native';
import ViewPager from './ViewPager';

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange?: (index: number) => void;
  renderCard: (index: number) => ReactElement;
  style?: any;
};

class Carousel extends React.Component {
  props: Props;

  render() {
    let cards = [];
    const {count, selectedIndex, renderCard} = this.props;

    for (let i = 0; i < count; i++) {
      let content = null;
      if (Math.abs(i - selectedIndex) < 2) {
        content = renderCard(i);
      }
      cards.push(content);
    }

    return (
      <ViewPager style={styles.carousel} {...this.props} bounces={true}>
        {cards}
      </ViewPager>
    );
  }
}

const styles = StyleSheet.create({
  carousel: {
    ...Platform.select({
      ios: {
        margin: 10,
        overflow: 'visible',
        backgroundColor: 'black',
      },
    },
  },
});

export default Carousel;
