import * as React from 'react';
import { connect } from 'react-redux';
import History from './History';
import { Grid, Box, Divider } from '@material-ui/core';
import * as moment from 'moment';
import { push, goBack } from "react-router-redux";
import { tl } from '../../components/translate';
import ClientNameWithInfoModal from '../Client/ClientInfoModal';
import styles from './Assessment.module.css';

const Timeline = ({ assessments, client, gotoAssessment }) => {
  return (<Grid container>
    {client && (
      <Grid classes={{ root: styles.timeline }}>
        <ClientNameWithInfoModal clientId={client.id} fontWeight={600} fontSize="16px" />
        <Box>
          {
            client.dob && <Box fontSize="14px"> {moment().diff(client.dob, 'years')} {moment().diff(client.dob, 'months') % 12} {tl('years old')} </Box>
          }
          {
            client.gender && <Box fontSize="14px"> {client.gender}</Box>
          }
        </Box>
        <Box fontSize="14px"><Box component="span" fontWeight={600}>{tl('Phone')}</Box> {client.phone}</Box>
      </Grid>
    )}
    <Divider></Divider>
    {assessments && Boolean(assessments.length) && <History history={assessments} gotoAssessment={gotoAssessment} />}
  </Grid>);
};

export default connect(({ assessments, clients }, { clientId }) => ({
  assessments: assessments.collection,
  clients,
  client: clients.find(({ id }) => Number(clientId) === id)
}), (dispatch) => ({
  gotoAssessment: ({ id, clientId }) => dispatch(push(`/assessment/${id}/?clientId=${clientId}`))
}))(Timeline);