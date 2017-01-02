/**
 * @flow
 */

'use strict';

import Parse from 'parse/react-native';

import type { Action } from './types';

export async function loadSurveys(): Promise<Action> {
  const list = await Parse.Cloud.run('surveys');
  return {
    type: 'LOADED_SURVEYS',
    list,
  };
}

export async function submitSurveyAnswers(id: string, answers: Array<any>): Promise<Action> {
  await Parse.Cloud.run('submit_survey', {id, answers});
  return {
    type: 'SUBMITTED_SURVEY_ANSWERS',
    id,
  };
}
