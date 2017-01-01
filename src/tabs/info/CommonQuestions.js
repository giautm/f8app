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
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'F8Text';
import F8Touchable from 'F8Touchable';
import ItemsWithSeparator from '../../common/ItemsWithSeparator';
import Section from './Section';

class CommonQuestions extends React.Component {
  render() {
    let content = this.props.faqs.map(({answer, question}) =>
      (<Row answer={answer} question={question} key={question} />)
    );
    return (
      <Section title="Common questions">
        <ItemsWithSeparator separatorStyle={styles.separator}>
          {content}
        </ItemsWithSeparator>
      </Section>
    );
  }
}

class Row extends React.Component {
  props: {
    question: string;
    answer: string;
  };

  state: {
    expanded: boolean;
  };

  constructor() {
    super();
    this.state = { expanded: false };
  }

  render() {
    var answer;
    if (this.state.expanded) {
      answer = (
        <View style={styles.answer}>
          <Text style={styles.text}>
            {this.props.answer}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <F8Touchable onPress={() => this.toggle()}>
          <View style={styles.question} >
            <Text style={styles.symbol}>
              {this.state.expanded ? '\u2212' : '+'}
            </Text>
            <Text style={styles.text}>
              {this.props.question}
            </Text>
          </View>
        </F8Touchable>
        {answer}
      </View>
    );
  }

  toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded: !this.state.expanded});
  }
}

const styles = StyleSheet.create({
  separator: {
    marginHorizontal: 20,
  },
  question: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  symbol: {
    fontSize: 15,
    lineHeight: 21,
    width: 22,
    color: '#99A7B9',
  },
  answer: {
    padding: 14,
    paddingLeft: 20 + 22,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: '#002350',
    flex: 1,
  },
});

export default CommonQuestions;
