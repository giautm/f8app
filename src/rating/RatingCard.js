/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import F8Button from 'F8Button';
import Header from './Header';
import RatingQuestion from './RatingQuestion';

import type { Question } from '../reducers/surveys';
import type { Session } from '../reducers/sessions';

type Props = {
  session: Session;
  questions: Array<Question>;
  onSubmit: (answers: Array<number>) => void;
  style?: any;
};

class RatingCard extends React.Component {
  props: Props;
  state: Object;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  submit() {
    const { onSubmit, questions } = this.props;
    onSubmit(questions.map((_, ii) => this.state[ii]));
  }

  render() {
    const { questions, session, style } = this.props;

    const completed = Object.keys(this.state).length === questions.length;
    return (
      <View style={[styles.container, style]}>
        <ScrollView>
          <Header session={session} />
          {questions.map((question, ii) => (
            <RatingQuestion
              key={ii}
              onChange={(rating) => this.setState({[ii]: rating})}
              question={question}
              rating={this.state[ii]}
              style={styles.question}
            />
          ))}
        </ScrollView>
        <F8Button
          caption="Submit Review"
          onPress={() => completed && this.submit()}
          type={completed ? 'primary' : 'bordered'}
          style={styles.button}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  question: {
    padding: 40,
    paddingVertical: 25,
  },
  button: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
});

export default RatingCard;
