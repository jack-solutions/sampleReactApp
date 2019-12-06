import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Box, Button } from '@material-ui/core';
import Info from "../../components/List/Info";
import * as calendarFns from '../../components/Calendar/functions/calendarFunctions';
import Symptoms from './Symptoms';
import Slate from './Slate';
import Diagnosis from "./Diagnosis";
import MedicationModal from "./MedicationModal";
import LabTest from "./LabTest";
import FollowUp from './FollowUp';
import RiskFactor from './RiskFactor';
import AddMore from './AddMore';
import Attachments from './Attachments';
import Print from './Print';
import * as moment from 'moment';
import { tl } from '../../components/translate';
import styles from './Assessment.module.css';

const Assessment = ({ clientId, onSave, mode, openEdit, goBack, assessmentData, assessmentId }) => {
  const [assessment, setAssessment] = React.useState({
    symptoms: [],
    diagnosis: {},
    assessment: "",
    assessmentImage: "",
    medication: [],
    attachments: [],
    addMore: {
      listing: [
        { key: 1, value: "Follow Up" },
        { key: 2, value: "Risk Factor" }
      ]
    },
    save: false,
    edit: false,
    showFollowUp: false,
    riskfactor: false,
    risk: "",
    days: 7,
    frequencyType: "daily",
    tests: [],
    clientId: clientId
  });
  React.useEffect(() => {
    if (['read', 'edit'].includes(mode) && assessmentData) {
      setAssessment(assessmentData);
    }
  }, [assessmentData])

  const addMore = [
    { key: 1, value: "Follow Up" },
    { key: 2, value: "Risk Factor" }
  ];

  const makeSetPropsValueFn = (data, key) => {
    if (key == "medication") {
      const assessmentData = { ...assessment };
      assessmentData.medication = assessmentData.medication || [];
      assessmentData.medication.push(data);
      setAssessment(assessmentData);
    } else {
      setAssessment({ ...assessment, [key]: data });
    }
  };

  const removeAssessmentImage = (data, key) => {
    setAssessment({ ...assessment, [key]: undefined });
  };

  const removePrescription = (data, key) => {
    const AssementData = { ...assessment };
    AssementData.medication = data;
    setAssessment(AssementData);
  };

  const setAddMoreListing = (key, val) => {
    const addListingData = { ...assessment };
    if (val === 1) {
      addListingData.showFollowUp = true;
    }
    if (val === 2) {
      addListingData.riskfactor = true;
    }

    addListingData.addMore.listing.splice(key, 1);

    setAssessment(addListingData);
  };

  const addToAddMoreListingFn = key => {
    const addListingData = { ...assessment };
    if (key == 1) {
      addListingData.showFollowUp = false;
    }
    if (key == 2) {
      addListingData.riskfactor = false;
    }

    const existdata = addMore.find((i) => i.key === key);

    if (existdata) {
      addListingData.addMore.listing.push(existdata);
      setAssessment(addListingData);
    }
  };

  return (
    <Info classes={{ root: styles.assessmentFormRoot }}>
      <Grid item classes={{ root: styles.formHeader }} xs={12} lg={12}>
        <Box fontWeight={600} fontSize={'20px'}>{assessment.id ? tl('Assessment') : tl('newAssessment')}
          <Box component={'span'} fontWeight={500} fontSize={'18px'} style={{ float: 'right' }}>
            {calendarFns.convertADtoBS(moment(assessment.created_at) || moment()).formatted2}</Box>
        </Box>
      </Grid>
      <Grid classes={{ root: styles.formBody }} container>
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <Symptoms
            makeSetPropsValueFn={makeSetPropsValueFn}
            save={assessment.save}
            edit={mode === 'read'}
            symptoms={assessment.symptoms}
          />
        </Grid>
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <Slate
            save={assessment.save}
            edit={mode === 'read'}
            assessment={assessment.assessment}
            assessmentImage={assessment.assessmentImage}
            makeSetPropsValueFn={makeSetPropsValueFn}
            removeAssessmentImage={removeAssessmentImage}
          />
        </Grid>
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <LabTest
            save={assessment.save}
            edit={mode === 'read'}
            makeSetPropsValueFn={makeSetPropsValueFn}
            tests={assessment.tests}
          />
        </Grid>
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <Diagnosis
            makeSetPropsValueFn={makeSetPropsValueFn}
            save={assessment.save}
            edit={mode === 'read'}
            diagnosis={assessment.diagnosis}
          />
        </Grid>
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <MedicationModal
            removePrescription={removePrescription}
            save={assessment.save}
            edit={mode === 'read'}
            makeSetPropsValueFn={makeSetPropsValueFn}
          />
        </Grid>
        <Grid item classes={{ root: styles.attachmentsRow }} xs={12} lg={12}>
          <Attachments assessmentId={assessmentId}
            attachments={assessment.attachments}
            readOnly={mode === 'read'}
            onfilesChange={(files) => {
              setAssessment({
                ...assessment, attachments: files
              })
            }} />
        </Grid>
        {assessment.showFollowUp ? <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <FollowUp
            assessment={assessment}
            setAssessment={setAssessment}
            addToAddMoreListingFn={addToAddMoreListingFn}
          />
        </Grid> : null}
        {assessment.riskfactor ? (<Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <RiskFactor assessment={assessment} setAssessment={setAssessment} addToAddMoreListingFn={addToAddMoreListingFn} />
        </Grid>
        ) : null}
        <Grid item classes={{ root: styles.formRow }} xs={12} lg={12}>
          <AddMore assessment={assessment} setAddMoreListing={setAddMoreListing} />
        </Grid>
      </Grid>
      <Grid item classes={{ root: styles.formFooter }} xs={12} lg={12}>
        {['edit', 'create'].includes(mode) &&
          <Button classes={{ root: styles.formFooterBtn }} color={'default'} onClick={goBack}>{tl('Cancel')}</Button>
        }
        {mode === 'read' && (<>
          <Print key={'assessmentPrint'} assessment={assessment} clientId={clientId} />
          {moment().diff(moment(assessment.created_at), 'day', true) < 1 && (
            <Button key={'assessmentEdit'} classes={{ root: styles.formFooterBtn }} color={'primary'} variant="contained"
              onClick={() => openEdit(assessment.id)}>
              {tl('Edit')}
            </Button>)}
        </>)}
        {['edit', 'create'].includes(mode) &&
          <Button classes={{ root: styles.formFooterBtn }} color={'primary'} variant="contained"
            onClick={() => onSave(assessment)}>
            {tl('Save')}
          </Button>}
      </Grid>
    </Info>)
};

export default connect(({ clients }, { clientId }) => ({
}), () => ({}))(Assessment);