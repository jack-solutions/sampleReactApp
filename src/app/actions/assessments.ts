import { actionCreator, actionCreatorAsync } from './actionHelpers';
import * as api from '../api/assessment';

export enum Type {
  GET_ASSESSMENTS = 'UPDATE_BOOKING',
  GET_ASSESSMENT_BY_ID = 'GET_ASSESSMENT_BY_ID',
  UPDATE_ASSESSMENT = 'UPDATE_ASSESSMENT',
  CREATE_ASSESSMENT = 'CREATE_ASSESSMENT',
  DELETE_ASSESSMENT = 'DELETE_ASSESSMENT'
};

export const getClientAssessments = (clientId) => {
  return async (dispatch) => {
    await dispatch(
      actionCreatorAsync(Type.GET_ASSESSMENTS, async () => {
        return await api.getAssessments(clientId);
      }),
    );
  }
}

export const getAssessmentById = (assessmentId) => {
  return async (dispatch) => {
    await dispatch(
      actionCreatorAsync(Type.GET_ASSESSMENT_BY_ID, async () => {
        return await api.getAssessmentById(assessmentId);
      }),
    );
  }
}

export const updateAssessment = (assessmentId, assessmentData) => {
  return async (dispatch) => {
    await dispatch(
      actionCreatorAsync(Type.UPDATE_ASSESSMENT, async () => {
        return await api.updateAssessment(assessmentId, assessmentData);
      }),
    );
  }
}

export const createAssessment = (assessmentData) => {
  return async (dispatch) => {
    await dispatch(
      actionCreatorAsync(Type.CREATE_ASSESSMENT, async () => {
        return await api.saveAssessment(assessmentData);
      }),
    );
  }
}

export const deleteAssessment = (assessmentId) => {
  return async (dispatch) => {
    await dispatch(
      actionCreatorAsync(Type.DELETE_ASSESSMENT, async () => {
        return await api.deleteAssessment(assessmentId);
      }),
    );
  }
}