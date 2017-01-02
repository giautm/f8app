/**
 * @flow
 */

'use strict';
import {
  InteractionManager,
} from 'react-native';
import Parse from 'parse/react-native';
import logError from 'logError';


import type { ThunkAction } from './types';

const Maps = Parse.Object.extend('Maps');
const Notification = Parse.Object.extend('Notification');

function loadParseQuery(type: string, query: Parse.Query): ThunkAction {
  return (dispatch) => {
    return query.find({
      success: (list) => {
        // We don't want data loading to interfere with smooth animations
        InteractionManager.runAfterInteractions(() => {
          // Flow can't guarantee {type, list} is a valid action
          dispatch(({type, list}: any));
        });
      },
      error: logError,
    });
  };
}

export const loadSessions = (): ThunkAction =>
  loadParseQuery('LOADED_SESSIONS', new Parse.Query('Agenda')
    .include('speakers').ascending('startTime')
);

export const loadMaps = (): ThunkAction =>
  loadParseQuery('LOADED_MAPS', new Parse.Query(Maps))

export const loadNotifications = (): ThunkAction =>
  loadParseQuery('LOADED_NOTIFICATIONS', new Parse.Query(Notification))
