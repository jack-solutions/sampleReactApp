import * as React from 'react';
import { connect } from 'react-redux';
import { push, goBack } from "react-router-redux";
import { Redirect } from 'react-router';
import Timeline from './Timeline';
import AssessmentForm from './AssessmentForm';
import { Grid } from '@material-ui/core';
import * as clientActions from '../../actions/client';
import * as assessmentActions from '../../actions/assessments';
import styles from './Assessment.module.css';

const Assessment = ({ clientId, actions, assessment, mode, assessmentId }) => {
  React.useEffect(() => {
    if (clientId) {
      actions.getClient(clientId);
      actions.getAssessments(clientId);
    }
  }, [clientId]);
  return (<Grid container>
    <Grid item classes={{ root: styles.historyRoot }} xs={12} md={4} lg={4}>
      <Timeline clientId={clientId} />
    </Grid>
    <Grid item classes={{ root: styles.assessmentRoot }} xs={12} md={8} lg={8}>
      <AssessmentForm
        assessmentId={assessmentId}
        clientId={clientId}
        assessmentData={assessment}
        mode={mode}
        onSave={actions.saveAssessment}
        openEdit={(assessmentId) => actions.navigateTo(`/assessment/${assessmentId}/edit/?clientId=${clientId}`)}
        goBack={() => actions.goBack()} />
    </Grid>
  </Grid>);
};

export default connect(({ assessments }, { assessmentId }) => {
  return {
    assessment: assessmentId === 'lastTouched' && assessments.lastTouched ?
      assessments.lastTouched :
      assessments.collection.find(({ id }) => Number(assessmentId) === id)
  }
}, (dispatch) => ({
  actions: {
    getClient: (clientId) => dispatch(clientActions.getClientById(clientId)),
    getAssessments: (clientId) => dispatch(assessmentActions.getClientAssessments(clientId)),
    saveAssessment: async (assessment) => {
      let assessmentData = {
        clientId: assessment.clientId,
        assessment: assessment.assessment,
        assessmentImage: assessment.assessmentImage,
        diagnosis: assessment.diagnosis,
        symptoms: assessment.symptoms,
        tests: assessment.tests,
        attachments: assessment.attachments
      };

      if (assessment.riskfactor) {
        assessmentData.riskFactor = assessment.risk;
      }

      if (assessment.showFollowUp) {
        assessmentData.followup = {
          days: assessment.days,
          format: assessment.frequencyType == "daily" ? "days" : "week",
          note: assessment.note
        };
      }

      if (assessment.medication && assessment.medication.length) {
        let prescriptionData = [];
        assessment.medication.forEach((data) => {
          let obj = {
            id: data.id,
            brand: data.brand,
            genericName: data.genericName,
            form: data.form,
            strength: data.strength,
            frequency: data.frequency,
            frequencyType: data.frequencyType,
            days: data.days,
            meal: data.meal
          };

          prescriptionData.push(obj);
        });
        assessmentData.medication = prescriptionData;
      }
      if (assessment.id) {
        await dispatch(assessmentActions.updateAssessment(assessment.id, assessmentData));
      } else {
        await dispatch(assessmentActions.createAssessment(assessmentData));
      }
      dispatch((dispatch, getState) => {
        const lastTouchedAssessment = getState().assessments.lastTouched;
        dispatch(push(`/assessment/${lastTouchedAssessment.id}/?clientId=${lastTouchedAssessment.clientId}`));
      })
    },
    navigateTo: (url) => {
      dispatch(push(url));
    },
    goBack: () => {
      dispatch(goBack())
    }
  }
}))(Assessment);