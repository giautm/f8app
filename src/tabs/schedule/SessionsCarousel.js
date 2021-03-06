/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */
'use strict';

import React from 'react';
import {
  Text,
  View,
  Navigator,
  Platform,
  StyleSheet,
} from 'react-native';
import Parse from 'parse/react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import F8SessionDetails from 'F8SessionDetails';
import F8PageControl from 'F8PageControl';
import F8Header from 'F8Header';
import formatTime from './formatTime';
import Carousel from '../../common/Carousel';
import BackIcon from '../../common/BackButtonIcon';

import {connect} from 'react-redux';
import {loadFriendsSchedules, shareSession} from '../../actions';

import type {Dispatch} from '../../actions/types';

import type {Session} from '../../reducers/sessions';

type Context = {
  rowIndex: number; // TODO: IndexWithinSection
  sectionLength: number;
  sectionTitle: string;
};

type Props = {
  allSessions?: {[sectionID: string]: {[sessionID: string]: Session}};
  session: Session;
  navigator: Navigator;
  dispatch: Dispatch;
};

class SessionsCarusel extends React.Component {
  props: Props;
  state: {
    day: number;
    count: number;
    selectedIndex: number;
    flatSessionsList: Array<Session>;
    contexts: Array<Context>;
  };

  constructor(props: Props) {
    super(props);

    var flatSessionsList = [];
    var contexts: Array<Context> = [];
    var allSessions = this.props.allSessions;
    if (!allSessions) {
      const {session} = this.props;
      allSessions = {
        [formatTime(session.startTime)]: {[session.id]: session}
      };
    }

    // TODO: Add test
    for (let sectionID in allSessions) {
      const sectionLength = Object.keys(allSessions[sectionID]).length;
      let rowIndex = 0;
      for (let sessionID in allSessions[sectionID]) {
        const session = allSessions[sectionID][sessionID];
        flatSessionsList.push(session);
        contexts.push({
          rowIndex,
          sectionLength,
          sectionTitle: sectionID,
        });
        rowIndex++;
      }
    }

    const selectedIndex = flatSessionsList.findIndex((s) => s.id === this.props.session.id);
    if (selectedIndex === -1) {
      console.log(this.props.session);
      console.log(flatSessionsList);
    }

    this.state = {
      day: this.props.session.day,
      count: flatSessionsList.length,
      selectedIndex,
      flatSessionsList,
      contexts,
    };
    (this: any).dismiss = this.dismiss.bind(this);
    (this: any).handleIndexChange = this.handleIndexChange.bind(this);
    (this: any).renderCard = this.renderCard.bind(this);
    (this: any).shareCurrentSession = this.shareCurrentSession.bind(this);
  }

  render() {
    var {rowIndex, sectionLength, sectionTitle} = this.state.contexts[this.state.selectedIndex];
    var rightItem;
    if (Platform.OS === 'android') {
      rightItem = {
        title: 'Share',
        icon: require('./img/share.png'),
        onPress: this.shareCurrentSession,
      };
    }
    return (
      <View style={styles.container}>
        <F8Header
          style={styles.header}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: BackIcon,
            onPress: this.dismiss,
          }}
          rightItem={rightItem}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              <Text style={styles.day}>DAY {this.state.day}</Text>
              {'\n'}
              <Text style={styles.time}>{sectionTitle}</Text>
            </Text>
            <F8PageControl
              count={sectionLength}
              selectedIndex={rowIndex}
            />
          </View>
        </F8Header>
        <Carousel
          count={this.state.count}
          selectedIndex={this.state.selectedIndex}
          onSelectedIndexChange={this.handleIndexChange}
          renderCard={this.renderCard}
        />
      </View>
    );
  }

  renderCard(index: number): ReactElement {
    return (
      <F8SessionDetails
        style={styles.card}
        navigator={this.props.navigator}
        session={this.state.flatSessionsList[index]}
        onShare={this.shareCurrentSession}
      />
    );
  }

  shareCurrentSession() {
    const session = this.state.flatSessionsList[this.state.selectedIndex];
    this.props.dispatch(shareSession(session));
  }

  componentDidMount() {
    this.track(this.state.selectedIndex);
    this.props.dispatch(loadFriendsSchedules());
  }

  dismiss() {
    this.props.navigator.pop();
  }

  handleIndexChange(selectedIndex: number) {
    this.track(selectedIndex);
    this.setState({ selectedIndex });
  }

  track(index: number) {
    const {id} = this.state.flatSessionsList[index];
    Parse.Analytics.track('view', {id});
    AppEventsLogger.logEvent('View Session', 1, {id});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...Platform.select({
      android: {
        backgroundColor: '#5597B8',
      },
    }),
  },
  headerContent: {
    ...Platform.select({
      android: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      ios: {
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
      },
    }),
  },
  title: {
    color: 'white',
    fontSize: 12,
    ...Platform.select({
      ios: {
        textAlign: 'center',
      },
    }),
  },
  day: {
    ...Platform.select({
      android: {
        fontSize: 9,
      },
      ios: {
        fontWeight: 'bold',
      },
    }),
  },
  time: {
    ...Platform.select({
      android: {
        fontWeight: 'bold',
        fontSize: 17,
      },
    }),
  },
  card: {
    ...Platform.select({
      ios: {
        borderRadius: 2,
        marginHorizontal: 3,
      },
    }),
  },
});

export default connect()(SessionsCarusel);
