/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewPagerAndroid,
  Platform,
} from 'react-native';

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange?: (index: number) => void;
  bounces?: boolean;
  children?: any;
  style?: any;
};

type State = {
  width: number;
  height: number;
  selectedIndex: number;
  initialSelectedIndex: number;
  scrollingTo: ?number;
};

class ViewPager extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      initialSelectedIndex: this.props.selectedIndex,
      selectedIndex: this.props.selectedIndex,
      scrollingTo: null,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedIndex !== this.state.selectedIndex) {
      if (Platform.OS === 'ios') {
        this.scrollview.scrollTo({
          x: nextProps.selectedIndex * this.state.width,
          animated: true,
        });
        this.setState({ scrollingTo: nextProps.selectedIndex });
      } else {
        this.scrollview.setPage(nextProps.selectedIndex);
        this.setState({ selectedIndex: nextProps.selectedIndex });
      }
    }
  }

  adjustCardSize = (e: any) => {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  handleHorizontalScroll = (e: any) => {
    var selectedIndex = e.nativeEvent.position;
    if (selectedIndex === undefined) {
      selectedIndex = Math.round(e.nativeEvent.contentOffset.x / this.state.width);
    }
    if (selectedIndex < 0 || selectedIndex >= this.props.count) {
      return;
    }
    if (this.state.scrollingTo !== null && this.state.scrollingTo !== selectedIndex) {
      return;
    }
    if (this.props.selectedIndex !== selectedIndex || this.state.scrollingTo !== null) {
      this.setState({ scrollingTo: null, selectedIndex });
      const { onSelectedIndexChange } = this.props;
      onSelectedIndexChange && onSelectedIndexChange(selectedIndex);
    }
  };

  render() {
    if (Platform.OS === 'ios') {
      return this.renderIOS();
    } else {
      return this.renderAndroid();
    }
  }

  renderAndroid() {
    return (
      <ViewPagerAndroid
        ref={(ref) => this.scrollview = ref}
        initialPage={this.state.initialSelectedIndex}
        onPageSelected={this.handleHorizontalScroll}
        style={styles.container}>
        {this.renderContent()}
      </ViewPagerAndroid>
    );
  }

  renderIOS() {
    return (
      <ScrollView
        ref={(ref) => this.scrollview = ref}
        contentOffset={{
          x: this.state.width * this.state.initialSelectedIndex,
          y: 0,
        }}
        style={[styles.scrollview, this.props.style]}
        horizontal={true}
        pagingEnabled={true}
        bounces={!!this.props.bounces}
        scrollsToTop={false}
        onScroll={this.handleHorizontalScroll}
        scrollEventThrottle={100}
        removeClippedSubviews={true}
        automaticallyAdjustContentInsets={false}
        directionalLockEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={this.adjustCardSize}>
        {this.renderContent()}
      </ScrollView>
    );
  }

  renderContent(): Array<ReactElement> {
    const { width, height } = this.state;
    const styleIOS = Platform.OS === 'ios' && styles.card;
    return React.Children.map(this.props.children, (child, i) => (
      <View style={[styleIOS, { width, height }]} key={`r_${i}`}>
        {child}
      </View>
    ));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
  }
});

export default ViewPager;
