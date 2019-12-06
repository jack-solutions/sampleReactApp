
import { ReducerBuilder } from './ReducerBuilder';
import * as AssessmentActions from '../actions/assessments';

const INITIAL_STATE = {
  collection: [],
  lastTouched: null
};

function setAssessments(state, payload) {
  return { ...state, collection: payload };
}

function setAssessment(state, payload) {
  const newCollection = state.collection.filter(({ id }) => payload.id !== id);
  newCollection.push(payload);
  return { ...state, collection: newCollection };
}

function putAssessment(state, payload) {
  const newState = setAssessment(state, payload);
  newState.lastTouched = payload;
  return newState;
}

const reducer = ReducerBuilder.create(INITIAL_STATE)
  .mapAction(AssessmentActions.Type.GET_ASSESSMENTS, setAssessments)
  .mapAction(AssessmentActions.Type.GET_ASSESSMENT_BY_ID, setAssessment)
  .mapAction(AssessmentActions.Type.CREATE_ASSESSMENT, putAssessment)
  .mapAction(AssessmentActions.Type.UPDATE_ASSESSMENT, putAssessment)
  .build();
export default reducer;
