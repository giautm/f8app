/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Platform,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import F8Header from 'F8Header';
import F8PageControl from 'F8PageControl';

import Carousel from '../common/Carousel';
import RatingCard from './RatingCard';

import { submitSurveyAnswers } from '../actions';
import type { Dispatch } from '../actions/types';
import type { Session } from '../reducers/sessions';
import type { Survey } from '../reducers/surveys';

type Props = {
  sessions: Array<Session>;
  surveys: Array<Survey>;
  navigator: any;
  dispatch: Dispatch;
};

@connect((store) => ({
  sessions: store.sessions,
}))
class RatingScreen extends React.Component {
  props: Props;
  state: {
    selectedIndex: number;
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  dismiss = () => {
    this.props.navigator.pop();
  };

  handleIndexChange = (selectedIndex: number) => {
    this.setState({ selectedIndex });
  };

  submitAnswers(index: number, answers: Array<number>) {
    const survey = this.props.surveys[index];
    this.props.dispatch(submitSurveyAnswers(survey.id, answers)).then(
      () => this.proceedToPage(index + 1)
    );
  }

  proceedToPage(index: number) {
    if (index < this.props.surveys.length) {
      this.setState({ selectedIndex: index });
    } else {
      this.props.navigator.pop();
      if (Platform.OS === 'android') {
        ToastAndroid.show('Thanks for your review!', ToastAndroid.SHORT);
      }
    }
  }

  renderCard = (index: number) => : ReactElement {
    const survey = this.props.surveys[index];
    const session = this.props.sessions.find((s) => s.id === survey.sessionId);

    return (
      <RatingCard
        style={styles.card}
        session={session}
        questions={survey.questions}
        onSubmit={(answers) => this.submitAnswers(index, answers)}
      />
    );
  };

  render() {
    const {surveys} = this.props;
    return (
      <View style={styles.container}>
        <F8Header
          style={styles.header}
          leftItem={{
            layout: 'icon',
            title: 'Close',
            icon: require('../common/BackButtonIcon'),
            onPress: this.dismiss,
          }}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {surveys.length > 1
                ? 'Review these sessions'
                : 'Review this session'
              }
            </Text>
            <F8PageControl
              count={surveys.length}
              selectedIndex={this.state.selectedIndex}
            />
          </View>
        </F8Header>
        <Carousel
          count={surveys.length}
          selectedIndex={this.state.selectedIndex}
          onSelectedIndexChange={this.handleIndexChange}
          renderCard={this.renderCard}
        />
      </View>
    );
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
    fontSize: 14,
    textAlign: 'center',
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

export default RatingScreen;
