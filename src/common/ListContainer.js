/**
 * @flow
 * @providesModule ListContainer
 */
'use strict';
import React from 'react';
import ReactNative, {
  Animated,
  Dimensions,
  NativeModules,
  Platform,
  View,
  StyleSheet,
  ActivityIndicator as ActivityIndicatorIOS,
  ProgressBarAndroid,
} from 'react-native';
import Relay from 'react-relay';
import F8Header from 'F8Header';
import F8SegmentedControl from 'F8SegmentedControl';
import ParallaxBackground from 'ParallaxBackground';
import ViewPager from './ViewPager';
import RelayRenderer from 'react-relay/lib/RelayRenderer.js';

import { Text } from 'F8Text';

import type {Item as HeaderItem} from 'F8Header';

type Props = {
  title: string;
  leftItem?: HeaderItem;
  rightItem?: HeaderItem;
  extraItems?: Array<HeaderItem>;
  selectedSegment?: number;
  selectedSectionColor: string;
  backgroundImage: number;
  backgroundColor: string;
  parallaxContent?: ?ReactElement;
  stickyHeader?: ?ReactElement;
  onSegmentChange?: (segment: number) => void;
  children?: any;
};

type State = {
  idx: number;
  anim: Animated.Value;
  stickyHeaderHeight: number;
};

const EMPTY_CELL_HEIGHT = Dimensions.get('window').height > 600 ? 200 : 150;

const ActivityIndicator = Platform.OS === 'ios'
  ? ActivityIndicatorIOS
  : ProgressBarAndroid;

class MainRoute extends Relay.Route {}
MainRoute.queries = { viewer: () => Relay.QL`query { viewer }` };
MainRoute.routeName = 'MainRoute';

class RelayLoading extends React.Component {
  render() {
    const child = React.Children.only(this.props.children);
    if (!child.type.getFragmentNames) {
      return child;
    }
    return (
      <RelayRenderer
        Container={child.type}
        queryConfig={new MainRoute()}
        environment={Relay.Store}
        render={({props}) => this.renderChild(child, props)}
      />
    );
  }

  renderChild(child, props) {
    if (!props) {
      return (
        <View style={{height: 400}}>
          {child.props.renderHeader && child.props.renderHeader()}
          <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }
    return React.cloneElement(child, {...this.props, ...props});
  }
}

class ListContainer extends React.Component {
  props: Props;
  state: State;
  _refs: Array<any>;
  _pinned: any;

  static defaultProps = {
    selectedSectionColor: 'white',
  };

  static contextTypes = {
    openDrawer: React.PropTypes.func,
    hasUnreadNotifications: React.PropTypes.boolean,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      idx: this.props.selectedSegment || 0,
      anim: new Animated.Value(0),
      stickyHeaderHeight: 0,
    };

    (this: any).renderFakeHeader = this.renderFakeHeader.bind(this);
    (this: any).handleStickyHeaderLayout = this.handleStickyHeaderLayout.bind(this);
    (this: any).handleShowMenu = this.handleShowMenu.bind(this);
    (this: any).handleSelectSegment = this.handleSelectSegment.bind(this);
    this._refs = [];
  }

  render() {
    var leftItem = this.props.leftItem;
    if (!leftItem && Platform.OS === 'android') {
      leftItem = {
        title: 'Menu',
        icon: this.context.hasUnreadNotifications
          ? require('./img/hamburger-unread.png')
          : require('./img/hamburger.png'),
        onPress: this.handleShowMenu,
      };
    }

    const segments = [];
    const content = React.Children.map(this.props.children, (child, idx) => {
      segments.push(child.props.title);
      return <RelayLoading>{React.cloneElement(child, {
        ref: (ref) => { this._refs[idx] = ref; },
        onScroll: (e) => this.handleScroll(idx, e),
        style: styles.listView,
        showsVerticalScrollIndicator: false,
        scrollEventThrottle: 16,
        contentInset: {bottom: 49, top: 0},
        automaticallyAdjustContentInsets: false,
        renderHeader: this.renderFakeHeader,
        scrollsToTop: idx === this.state.idx,
      })}</RelayLoading>;
    });

    let {stickyHeader} = this.props;
    if (segments.length > 1) {
      stickyHeader = (
        <View>
          <F8SegmentedControl
            values={segments}
            selectedIndex={this.state.idx}
            selectionColor={this.props.selectedSectionColor}
            onChange={this.handleSelectSegment}
          />
          {stickyHeader}
        </View>
      );
    }
    // TODO: Bind to ViewPager animation
    const backgroundShift = segments.length === 1
      ? 0
      : this.state.idx / (segments.length - 1);

    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <ParallaxBackground
            minHeight={this.state.stickyHeaderHeight + F8Header.height}
            maxHeight={EMPTY_CELL_HEIGHT + this.state.stickyHeaderHeight + F8Header.height}
            offset={this.state.anim}
            backgroundImage={this.props.backgroundImage}
            backgroundShift={backgroundShift}
            backgroundColor={this.props.backgroundColor}>
            {this.renderParallaxContent()}
          </ParallaxBackground>
          <F8Header
            title={this.props.title}
            leftItem={leftItem}
            rightItem={this.props.rightItem}
            extraItems={this.props.extraItems}>
            {this.renderHeaderTitle()}
          </F8Header>
          {this.renderFixedStickyHeader(stickyHeader)}
        </View>
        <ViewPager
          count={segments.length}
          selectedIndex={this.state.idx}
          onSelectedIndexChange={this.handleSelectSegment}>
          {content}
        </ViewPager>
        {this.renderFloatingStickyHeader(stickyHeader)}
      </View>
    );
  }

  renderParallaxContent() {
    if (Platform.OS === 'android') {
      return <View />;
    }
    if (this.props.parallaxContent) {
      return this.props.parallaxContent;
    }
    return (
      <Text style={styles.parallaxText}>
        {this.props.title}
      </Text>
    );
  }

  renderHeaderTitle(): ?ReactElement {
    if (Platform.OS === 'android') {
      return null;
    }
    var transform;
    if (!this.props.parallaxContent) {
      var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      transform = {
        opacity: this.state.anim.interpolate({
          inputRange: [distance - 20, distance],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      };
    }
    return (
      <Animated.Text style={[styles.headerTitle, transform]}>
        {this.props.title}
      </Animated.Text>
    );
  }

  handleScroll(idx: number, e: any) {
    if (idx !== this.state.idx) {
      return;
    }
    let y = 0;
    if (Platform.OS === 'ios') {
      this.state.anim.setValue(e.nativeEvent.contentOffset.y);
      const height = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      y = Math.min(e.nativeEvent.contentOffset.y, height);
    }
    this._refs.forEach((ref, ii) => {
      if (ii !== idx && ref) {
        ref.scrollTo && ref.scrollTo({y, animated: false});
      }
    });

  }

  renderFakeHeader() {
    if (Platform.OS === 'ios') {
      const height = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      return (<View style={{height}} />);
    }
  }

  renderFixedStickyHeader(stickyHeader: ?ReactElement) {
    return Platform.OS === 'ios'
      ? <View style={{height: this.state.stickyHeaderHeight}} />
      : stickyHeader;
  }

  renderFloatingStickyHeader(stickyHeader: ?ReactElement) {
    if (!stickyHeader || Platform.OS !== 'ios') {
      return;
    }
    var opacity = this.state.stickyHeaderHeight === 0 ? 0 : 1;
    var transform;

    // If native pinning is not available, fallback to Animated
    if (!NativeModules.F8Scrolling) {
      var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;
      var translateY = this.state.anim.interpolate({
        inputRange: [0, distance],
        outputRange: [distance, 0],
        extrapolateRight: 'clamp',
      });
      transform = [{translateY}];
    }

    return (
      <Animated.View
        ref={(ref) => { this._pinned = ref; }}
        onLayout={this.handleStickyHeaderLayout}
        style={[styles.stickyHeader, {opacity}, {transform}]}>
        {stickyHeader}
      </Animated.View>
    );
  }

  handleStickyHeaderLayout({nativeEvent: { layout, target }}: any) {
    this.setState({stickyHeaderHeight: layout.height});
  }

  componentWillReceiveProps(nextProps: Props) {
    if (typeof nextProps.selectedSegment === 'number' &&
        nextProps.selectedSegment !== this.state.idx) {
      this.setState({idx: nextProps.selectedSegment});
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!NativeModules.F8Scrolling) {
      return;
    }

    if (this.state.idx !== prevState.idx ||
        this.state.stickyHeaderHeight !== prevState.stickyHeaderHeight) {
      var distance = EMPTY_CELL_HEIGHT - this.state.stickyHeaderHeight;

      if (this._refs[prevState.idx] && this._refs[prevState.idx].getScrollResponder) {
        const oldScrollViewTag = ReactNative.findNodeHandle(
          this._refs[prevState.idx].getScrollResponder()
        );
        NativeModules.F8Scrolling.unpin(oldScrollViewTag);
      }

      if (this._refs[this.state.idx] && this._refs[this.state.idx].getScrollResponder) {
        const newScrollViewTag = ReactNative.findNodeHandle(
          this._refs[this.state.idx].getScrollResponder()
        );
        const pinnedViewTag = ReactNative.findNodeHandle(this._pinned);
        NativeModules.F8Scrolling.pin(newScrollViewTag, pinnedViewTag, distance);
      }
    }
  }

  handleSelectSegment(idx: number) {
    if (this.state.idx !== idx) {
      const {onSegmentChange} = this.props;
      this.setState({idx}, () => onSegmentChange && onSegmentChange(idx));
    }
  }

  handleShowMenu() {
    this.context.openDrawer();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    ...Platform.select({
      android: {
        elevation: 2,
        backgroundColor: 'transparent',
        // FIXME: elevation doesn't seem to work without setting border
        borderRightWidth: 1,
        marginRight: -1,
        borderRightColor: 'transparent',
      },
    }),
  },
  listView: {
    ...Platform.select({
      android: {
        backgroundColor: 'white',
      },
      ios: {
        backgroundColor: 'transparent',
      },
    }),
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  parallaxText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  stickyHeader: {
    position: 'absolute',
    top: F8Header.height,
    left: 0,
    right: 0,
  },
});

export default ListContainer;
