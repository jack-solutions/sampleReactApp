import * as React from 'react';
import { FormLabel, ButtonGroup, TextField, Grid, Button, Box } from '@material-ui/core';
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import { tl } from '../../components/translate';
import styles from './Assessment.module.css';

const FollowUpRow = ({ assessment, setAssessment, addToAddMoreListingFn }) => {
  return (
    <Grid container className={styles.margin20Top}>
      <FormLabel component="legend">
        <Box fontSize={'14px'} fontWeight={600}>{tl("Follow up")}</Box>
      </FormLabel>
      <Grid container className={styles.margin16Top}>
        <Grid item xs={3}>
          <ButtonGroup
            size="small"
            aria-label="small outlined button group"
          >
            <Button
              size="small"
              disabled={assessment.days <= 1 || assessment.edit}
              onClick={e => {
                setAssessment({
                  ...assessment,
                  days: assessment.days - 1
                });
              }}
            >
              <Remove />
            </Button>

            <TextField
              id="days"
              type="number"
              disabled={assessment.edit}
              InputProps={{
                classes: {
                  input: styles.followUpDaysTextInput
                }
              }}
              onChange={e => {
                setAssessment({ ...assessment, days: e.target.value });
              }}
              value={assessment.days}
            />

            <Button
              size="small"
              disabled={assessment.edit}
              onClick={e => {
                setAssessment({
                  ...assessment,
                  days: assessment.days + 1
                });
              }}
            >
              <Add />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3} className={styles.textAlightCenter}>
          <ButtonGroup
            size="small"
            aria-label="small outlined button group"
          >
            <Button
              disabled={assessment.edit}
              onClick={e => {
                setAssessment({
                  ...assessment,
                  frequencyType: "daily"
                });
              }}
              className={
                assessment.frequencyType == "daily"
                  ? "mealBackgroundColor btnPadding"
                  : "btnPadding"
              }
            >
              <b>{tl("Days")}</b>
            </Button>
            <Button
              disabled={assessment.edit}
              onClick={e => {
                setAssessment({
                  ...assessment,
                  frequencyType: "weekly"
                });
              }}
              className={
                assessment.frequencyType == "weekly"
                  ? "mealBackgroundColor btnPadding"
                  : "btnPadding"
              }
            >
              <b>{tl("Week")}</b>
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={5} >
          <TextField
            disabled={assessment.edit}
            fullWidth
            id="filled-search"
            className="textSearch"
            value={assessment.note}
            onChange={e => {
              setAssessment({ ...assessment, note: e.target.value });
            }}
            margin="normal"
          />
        </Grid>

        <Grid item xs={1} className={styles.textAlightRight}>
          <i
            style={assessment.edit ? pointerEvent : {}}
            onClick={() => {
              addToAddMoreListingFn(1);
            }}
            className="material-icons"
          >
            clear
                  </i>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FollowUpRow;