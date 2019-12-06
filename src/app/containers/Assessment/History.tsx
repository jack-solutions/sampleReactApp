import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";

import StepContent from "@material-ui/core/StepContent";

import Typography from "@material-ui/core/Typography";
import "./index.css";

import StepButton from "@material-ui/core/StepButton";
import Grid from "@material-ui/core/Grid";
import ArrowDropRight from "@material-ui/icons/KeyboardArrowRight";
import ArrowDropDown from "@material-ui/icons/KeyboardArrowDown";
import lifecycle from "react-pure-lifecycle";
import moment from 'moment';
import { sortBy } from 'underscore';
import { tl } from "../../components/translate";
import { Box, Link } from '@material-ui/core';
import className from '../../helpers/classNames';
import styles from './Assessment.module.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: '0 8px',
    borderRadius: '5px'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

// create your lifecycle methods
const componentDidMount = props => {
  var container = document.querySelector(".MuiGrid-root");

  var b = container.querySelectorAll("circle");

  for (var i = 0; i < b.length; i++) {
    b[i].setAttribute("r", 8);
  }
};

// make them properties on a standard object
const methods = {
  componentDidMount
};
const VerticalLinearStepper = props => {
  const classes = useStyles();
  const [collapseHistory, setCollapseHistory] = React.useState(true);
  const [getPropsData, setPropsData] = React.useState(true);
  const [activeindex, setActiveIndex] = React.useState({
    steps: props.history
  });

  React.useEffect(() => {
    if (getPropsData) {
      let activeindexData = activeindex;
      activeindexData.steps = props.history ? props.history.sort((a,b) => a.created_at < b.created_at) : [];
      if (
        activeindexData &&
        activeindexData.steps &&
        activeindexData.steps.length
      ) {
        activeindexData.steps[0].open = true;

        setActiveIndex({ ...activeindexData });
        setPropsData(false);
      }
    }
  });

  const setOpenCloseHistoryFn = index => {

    var activeData = { ...activeindex };
    activeData.steps[index].open = !activeData.steps[index].open;
    setActiveIndex(activeData);
  };

  return (
    <div className={`${styles.historyTimelineRoot}`}>
      <Box className={styles.historyTitle} fontSize={'16px'} fontWeight={700}
        onClick={() => setCollapseHistory(!collapseHistory)}
      >{tl("History")}  {!collapseHistory ?
        <ArrowDropDown className={styles.titleArrow} /> : <ArrowDropRight className={styles.titleArrow} />}</Box>
      <Box className={className(styles.historyBlock, { [styles.collapseHistory]: collapseHistory })}>
        <Stepper orientation="vertical">
          {activeindex.steps.map((data, index) => (
            <Step completed={false} disabled={false} active key={data.assessment}>
              <StepButton
                disabled={false}
                onClick={() => {
                  setOpenCloseHistoryFn(index);
                }}
              >
                <Grid container>
                  <Grid item xs={10} className={"txtStart"}>
                    <Box>Client Visit</Box>
                    {data.diagnosis.diagnosis}
                  </Grid>
                  <Grid item xs={2} className={"txtEnd"}>
                    {data.open ? <ArrowDropDown /> : <ArrowDropRight />}
                  </Grid>
                </Grid>
              </StepButton>

              <StepContent>
                <Typography>
                  {moment(data.created_at).format("DD-MM-YYYY")}
                </Typography>

                {data.open ? (
                  <>
                    <Box>
                      <Box component={'span'} fontSize={'14px'} fontWeight={600}>Diagnosis: </Box>
                      <Box component={'span'}>{data.diagnosis.diagnosis}</Box>
                    </Box>

                    <Box>
                      <Box component={'span'} fontSize={'14px'} fontWeight={600}>Symptoms: </Box>
                      <Box component={'span'}>{data.symptoms && data.symptoms.length && Array.isArray(data.symptoms)
                        ? data.symptoms.map(s_data => (
                          <span key={s_data.symptom}>{s_data.symptom},</span>
                        ))
                        : ""}</Box>
                    </Box>
                    <Box>
                      <Box component={'span'} fontSize={'14px'} fontWeight={600}>Tests: </Box>
                      <Box component={'span'}>{data.tests && data.tests.length && Array.isArray(data.tests)
                        ? data.tests.map(s_data => <span>{s_data.test},</span>)
                        : ""}</Box>
                    </Box>
                    <Box>
                      <Link href={`/assessment/${data.id}/?clientId=${data.clientId}`}
                        onClick={(e) => { props.gotoAssessment(data); e.preventDefault(); }} >
                        {tl('seeFull')}
                      </Link>
                    </Box>
                  </>
                ) : (
                    ""
                  )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};

export default lifecycle(methods)(VerticalLinearStepper);
