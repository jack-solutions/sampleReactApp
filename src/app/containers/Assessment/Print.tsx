import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import * as moment from "moment";
import ReactToPrint from "react-to-print";
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import * as calendarFns from '../../components/Calendar/functions/calendarFunctions';
import { tl } from '../../components/translate';
const MyComponent = ({ assessment }) => {
  return <div dangerouslySetInnerHTML={{ __html: assessment.assessment }} />;
}
const AssessmentPrint = ({ assessment, userContext, client, clientId }) => {
  const componentRef = React.useRef();
  if (!client) return null;
  const renderBtn = () => {
    return (<ReactToPrint
      trigger={() => (
        <Button variant={"contained"}>{tl("Print")}</Button>
      )}
      content={() => componentRef.current}
    />)
  };
  return (
    <>
      {renderBtn()}
      <iframe className="ifrm">
        <table
          ref={componentRef}
          className="fullWdth"
          id="table"
          cellSpacing="0"
        >
          <thead>
            <tr>
              <td colSpan={1} className="pdngLft15" />
              <td colSpan={5} className={"pdngTop50 brdBtm"}>
                <Typography>
                  {userContext &&
                    userContext.resourceCentre &&
                    !isEmpty(userContext.resourceCentre)
                    ? userContext.resourceCentre.name
                    : ""}
                </Typography>
                <Typography>
                  {userContext &&
                    userContext.resourceCentre &&
                    !isEmpty(userContext.resourceCentre)
                    ? userContext.resourceCentre.address
                    : ""}
                  ,{" "}
                  {userContext &&
                    userContext.resourceCentre &&
                    !isEmpty(userContext.resourceCentre)
                    ? userContext.resourceCentre.city
                    : ""}
                </Typography>
                <Typography>
                  {userContext &&
                    userContext.resourceCentre &&
                    !isEmpty(userContext.resourceCentre)
                    ? userContext.resourceCentre.phone
                    : ""}
                </Typography>
              </td>

              <td colSpan={5} className="pdngTop50 txtAlgnRight brdBtm">
                <table>
                  <tr>
                    <td>
                      <Typography>
                        {userContext &&
                          userContext.user &&
                          !isEmpty(userContext.user)
                          ? userContext.user.title + "."
                          : ""}
                        {userContext &&
                          userContext.user &&
                          !isEmpty(userContext.user)
                          ? userContext.user.firstName +
                          " " +
                          userContext.user.lastName
                          : ""}
                      </Typography>
                      <Typography>
                        {userContext &&
                          userContext.user &&
                          !isEmpty(userContext.user)
                          ? userContext.user.qualification + "."
                          : ""}
                      </Typography>
                      <Typography>
                        {" "}
                        Registration No.
                        {userContext &&
                          userContext.user &&
                          !isEmpty(userContext.user)
                          ? userContext.user.registrationNumber + "."
                          : ""}
                      </Typography>
                    </td>
                  </tr>
                </table>
              </td>
              <td colSpan={1} className="pdngright15" />
            </tr>
          </thead>
          <tbody className={"pdngTop50 pdngBottom50"}>
            <tr>
              <td colSpan={1} />
              <td className={"pdngTop15"} colSpan={10}>
                <>
                  <Typography>
                    {client.firstName || ''}&nbsp;{client.lastName || ''}
                  </Typography>

                  <Typography className="printFont">{client.phone || ''}</Typography>
                </>
              </td>
              <td colSpan={1} />
            </tr>
            {assessment && assessment.symptoms && Array.isArray(assessment.symptoms) ? (
              <tr>
                <td colSpan={1} />
                <td className={"pdngTop15"} colSpan={10}>
                  <>
                    <Typography>Chief complaints</Typography>

                    <Typography className="printFont">
                      {assessment &&
                        assessment.symptoms
                        && Array.isArray(assessment.symptoms)
                        ? assessment.symptoms.map((data, index) => (
                          <>
                            {data.symptom}&nbsp;
                              {assessment.symptoms.length == index + 1
                              ? ""
                              : ","}
                            &nbsp;
                            </>
                        ))
                        : "No"}
                    </Typography>
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}

            {assessment.assessment ? (
              <tr>
                <td colSpan={1} />
                <td className={"pdngTop15"} colSpan={10}>
                  <>
                    <Typography>Status</Typography>

                    {assessment.assessment ? (
                      <Typography className="printFont">
                        <MyComponent assessment={assessment} />
                      </Typography>
                    ) : (
                        <Typography className="printFont">No</Typography>
                      )}
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}

            {assessment.assessmentImage ? (
              <tr>
                <td colSpan={1} />
                <td colSpan={10}>
                  <img
                    className="asmntImg"
                    src={assessment.assessmentImage}
                  />
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}
            {assessment && assessment.tests && Array.isArray(assessment.tests) ? (
              <tr>
                <td colSpan={1} />
                <td className="pdngTop15" colSpan={10}>
                  <>
                    <Typography>Lab tests</Typography>

                    <Typography className="printFont">
                      {assessment && assessment.tests && Array.isArray(assessment.tests)
                        ? assessment.tests.map((data, index) => (
                          <>
                            {data.test}&nbsp;
                              {assessment.tests.length == index + 1 ? "" : ","}
                            &nbsp;
                            </>
                        ))
                        : "No"}
                    </Typography>
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}
            {assessment.diagnosis.diagnosis ? (
              <tr>
                <td colSpan={1} />
                <td className="pdngTop15" colSpan={10}>
                  <>
                    <Typography>Diagnosis</Typography>

                    {assessment.diagnosis.diagnosis ? (
                      <Typography className="printFont">
                        {assessment.diagnosis.code}&nbsp;
                        {assessment.diagnosis.diagnosis}
                      </Typography>
                    ) : (
                        <Typography className="printFont">No</Typography>
                      )}
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}

            {assessment &&
              assessment.medication &&
              assessment.medication.length ? (
                <tr>
                  <td colSpan={1} />
                  <td className="pdngTop15" colSpan={10}>
                    <>
                      <Typography>Medicines</Typography>

                      <Typography component={'div'} className="printFont">
                        <table className="fullWdth">
                          {assessment &&
                            assessment.medication &&
                            assessment.medication.length
                            ? assessment.medication.map((data, index) => (
                              <tbody>
                                <tr>
                                  <td colSpan={4}>
                                    {data.genericName} <br />
                                    {data.brandName}
                                  </td>
                                  <td colSpan={4}>
                                    {data.frequency} times/day {data.meal} meal
                                  </td>
                                  <td colSpan={4}>
                                    {data.frequency * data.days} tablets (
                                    {data.days}{" "}
                                    {data.frequencyType == "daily"
                                      ? "days"
                                      : "week"}
                                    )
                                  </td>
                                </tr>
                              </tbody>
                            ))
                            : "No"}
                        </table>
                      </Typography>
                    </>
                  </td>
                  <td colSpan={1} />
                </tr>
              ) : (
                ""
              )}
            {assessment.showFollowUp ? (
              <tr>
                <td colSpan={1} />
                <td className="pdngTop15" colSpan={10}>
                  <>
                    <Typography>
                      {" "}
                      Follow up in {assessment.days}{" "}
                      {assessment.frequencyType == "daily" ? "days" : "week"}
                    </Typography>
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}

            {assessment.riskfactor ? (
              <tr>
                <td colSpan={1} />
                <td className="pdngTop15" colSpan={10}>
                  <>
                    <Typography> Risk Factor</Typography>

                    <Typography className="printFont">
                      {assessment.risk}
                    </Typography>
                  </>
                </td>
                <td colSpan={1} />
              </tr>
            ) : (
                ""
              )}

            <tr>
              <td colSpan={1} />
              <td colSpan={10} className="pdngTop15">
                <Typography>
                  {" "}
                  {userContext &&
                    userContext.user &&
                    !isEmpty(userContext.user) &&
                    userContext.user.title
                    ? userContext.user.title + "."
                    : ""}
                  {userContext &&
                    userContext.user &&
                    !isEmpty(userContext.user) &&
                    userContext.user.firstName
                    ? userContext.user.firstName +
                    " " +
                    userContext.user.lastName
                    : ""}
                </Typography>

                <Typography className="printFont">
                  {userContext &&
                    userContext.user &&
                    !isEmpty(userContext.user) &&
                    userContext.user.qualification
                    ? userContext.user.qualification + "."
                    : ""}
                </Typography>
              </td>
              <td colSpan={1} />
            </tr>
            <tr>
              <td colSpan={1} />
              <td className="pdngTop15" colSpan={10}>
                <Typography>
                  Dated: {calendarFns.convertADtoBS(moment(assessment.created_at)).formatted2}
                </Typography>
              </td>
              <td colSpan={1} />
            </tr>
          </tbody>

          <tfoot className="pFooter">
            <tr>
              <td colSpan={1} className="prntFootermain" />
              <td colSpan={5} className="prntFooterCont">
                <Typography>
                  {client.firstName}&nbsp;{client.lastName}&nbsp;
                  {client.phone}
                </Typography>

                <p />
              </td>

              <td colSpan={5} className="prntFooterCont1">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <Typography>Powered by Okhati</Typography>
                      </td>
                      <td>
                        <img
                          height="35px"
                          src="https://cdn-assets-cloud.frontify.com/local/frontify/h_lNxVXLqrDqb2kyrixW3lMmUl7n-aBRzJUzyvzD7_-xWNyzdNelgV4ke4zoF7uPQXJPVU25PimTum-JGbomXNz_WgyVrog_I64U35uLaL_zO1E-zaC6HtKw6uhv8wsp?width=800"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan={1} className="prntFootermainend" />
            </tr>
          </tfoot>
        </table>
      </iframe>
    </>
  );
};

export default connect((state, { clientId }) => ({
  userContext: state.userContext,
  client: state.clients.find(({ id }) => Number(clientId) === id)
}), () => ({}))(AssessmentPrint)