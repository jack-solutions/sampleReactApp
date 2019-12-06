import * as React from 'react';
import { FormLabel, ButtonGroup, TextField, Grid, Button, Box } from '@material-ui/core';
import { tl } from '../../components/translate';

const RiskFactorRow = ({ assessment, setAssessment, addToAddMoreListingFn}) => {
  return (<Grid container>
    <Grid item xs={10} sm={11} md={11} lg={11}>
      <FormLabel component="legend">
        <Box fontSize={'14px'} fontWeight={600}>{tl("Risk Factor")}</Box>
      </FormLabel>
      <TextField
        disabled={assessment.edit}
        fullWidth
        id="filled-search"
        className="textSearch"
        value={assessment.risk}
        onChange={e => {
          setAssessment({ ...assessment, risk: e.target.value });
        }}
        margin="normal"
      />
    </Grid>

    <Grid item xs={2} sm={1} md={1} lg={1} className="ClearBtn">
      <i
        style={assessment.edit ? pointerEvent : {}}
        onClick={() => {
          addToAddMoreListingFn(2);
        }}
        className="material-icons"
      >
        clear
      </i>
    </Grid>
  </Grid>);
}

export default RiskFactorRow;