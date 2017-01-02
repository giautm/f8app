/**
 * @flow
 */

'use strict';

import type { Action } from './types';

type Schedule = {[key: string]: boolean};

export function applyTopicsFilter(topics: Schedule): Action {
  return {
    type: 'APPLY_TOPICS_FILTER',
    topics,
  };
}

export function clearFilter(): Action {
  return {
    type: 'CLEAR_FILTER',
  };
}
