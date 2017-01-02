/**
 * @flow
 */

'use strict';

import {
  InteractionManager,
} from 'react-native';
import Parse from 'parse/react-native';
import type { Action } from './types';

export async function loadConfig(): Promise<Action> {
  const config = await Parse.Config.get();
  await InteractionManager.runAfterInteractions();
  return {
    type: 'LOADED_CONFIG',
    config,
  };
}
