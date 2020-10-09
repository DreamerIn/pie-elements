/* eslint-disable no-console */
import isEmpty from 'lodash/isEmpty';
import defaults from './defaults';
import { partialScoring } from '@pie-lib/controller-utils';

export function createDefaultModel(model = {}) {
  return new Promise(resolve => resolve({ ...defaults, ...model }));
}

export const normalize = question => ({ ...defaults, ...question });

/**
 *
 * @param {*} question
 * @param {*} session
 * @param {*} env
 * @param {*} updateSession - optional - a function that will set the properties passed into it on the session.
 */
export async function model(question, session, env) {
  return normalize(question);
}


export const getScore = () => 0;

/**
 *
 * The score is partial by default for checkbox mode, allOrNothing for radio mode.
 * To disable partial scoring for checkbox mode you either set model.partialScoring = false or env.partialScoring = false. the value in `env` will
 * override the value in `model`.
 * @param {Object} model - the main model
 * @param {*} session
 * @param {Object} env
 */
export function outcome(model, session, env) {
  return new Promise(resolve => {
    if (!session || isEmpty(session)) {
      resolve({ score: 0, empty: true });
    } else {
      const partialScoringEnabled =
        partialScoring.enabled(model, env) && model.choiceMode !== 'radio';
      const score = getScore(model, session);

      resolve({ score: partialScoringEnabled ? score : score === 1 ? 1 : 0, empty: false });
    }
  });
}

export const createCorrectResponseSession = (question, env) => {
  return new Promise(resolve => {
    if (env.mode !== 'evaluate' && env.role === 'instructor') {
      const { choices } = question || [];

      resolve({
        id: '1',
        value: choices.filter(c => c.correct).map(c => c.value)
      });
    } else {
      resolve(null);
    }
  });
};
