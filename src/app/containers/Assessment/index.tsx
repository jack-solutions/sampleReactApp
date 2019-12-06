import * as React from "react";
import { connect } from "react-redux";

import Info from "../../components/List/Info";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Remove from "@material-ui/icons/Remove";
import TextField from "@material-ui/core/TextField";
import ReactToPrint from "react-to-print";
import FormLabel from "@material-ui/core/FormLabel";
import Add from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { tl } from "../../components/translate";
import { Pills } from "../../Svgicons/2pills";
import { push } from "react-router-redux";
import * as moment from "moment";

import { findWhere, isEmpty, each } from "underscore";

import Symptoms from "./Symptoms";
import Diagnosis from "./Diagnosis";
import Slate from "./Slate";
import MedicationModal from "./MedicationModal";
import LabTest from "./LabTest";

import VerticalLinearStepper from "./History";

import {
  saveAssessment,
  updateAssessment,
  gtAssessment,
  getAssessments
} from "../../api/assessment";

import { getClientDetails } from "../../api/client";

import * as calendarFns from "../../components/Calendar/functions/calendarFunctions";
import "./index.css";
export const Assessment = (props) => {
  const { navigateTo, StoreData } = props;
  const [assessment, setAssessment] = React.useState({
    symptoms: [],
    diagnosis: {},
    assessment: "",
    assessmentImage: "",
    prescription: [],
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
    tests: []
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const [isEditable, setisEditable] = React.useState(true);

  const medication = {
    genericName: "",
    brandName: "",
    form: "Tablet",
    frequency: 3,
    frequencyType: "daily",
    meal: "after",
    days: 7,
    type: Pills
  };

  const makeSetPropsValueFn = (data, key) => {
    if (key == "prescription") {
      var AssementData = { ...assessment };
      AssementData.prescription.push(data);
      setAssessment(AssementData);
    } else {
      setAssessment({ ...assessment, [key]: data });
    }
  };

  const removePrescription = (data, key) => {
    var AssementData = { ...assessment };
    AssementData.prescription = data;
    setAssessment(AssementData);
  };

  const removeAssessmentImage = (data, key) => {
    setAssessment({ ...assessment, [key]: undefined });
  };

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }
  const menuId = "primary-search-account-menu";

  const addMore = [
    { key: 1, value: "Follow Up" },
    { key: 2, value: "Risk Factor" }
  ];

  const setAddMoreListing = (key, val) => {
    var addListingData = { ...assessment };
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
    var addListingData = { ...assessment };
    if (key == 1) {
      addListingData.showFollowUp = false;
    }
    if (key == 2) {
      addListingData.riskfactor = false;
    }

    var existdata = findWhere(addMore, { key: key });

    if (existdata && !isEmpty(existdata)) {
      addListingData.addMore.listing.push(existdata);
      setAssessment(addListingData);
    }
  };

  const [patient, setPatient] = React.useState({});
  const [patientHistory, setpatientHistory] = React.useState([]);

  React.useEffect(() => {

    getClientDetails(props.clientId).then(response => {
      setPatient(response);
    });

    getAssessments(props.clientId).then(response => {
      setpatientHistory(response);
    });
  }, []);

  React.useEffect(() => {
    if (isEditable) {
      var existData = window.location.pathname.split("/");
      if (existData && existData.length > 2) {
        gtAssessment(existData[2]).then(response => {
          setAssessment(response);
        });
        setisEditable(false);
      }
    }
  }, []);

  const saveAssessmentFn = () => {
    let assessmentData = {
      clientId: parseInt(localStorage.getItem("patientId")),
      assessment: assessment.assessment,
      assessmentImage: assessment.assessmentImage,
      diagnosis: assessment.diagnosis,
      symptoms: assessment.symptoms,
      tests: assessment.tests
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

    if (assessment.prescription && assessment.prescription.length) {
      let prescriptionData = [];
      each(assessment.prescription, function (data) {
        let obj = {
          id: data.id ? data.id : undefined,
          genericName: data.genericName,
          genericId: data.genericId ? data.genericId : undefined,
          form: data.form,
          strength: data.strength ? data.strength : undefined
        };

        prescriptionData.push(obj);
      });

      assessmentData.medications = prescriptionData;
    }

    if (assessment.id) {
      assessmentData.id = assessment.id;
      updateAssessment(assessmentData).then(response => {
        setAssessment({
          ...assessment,
          save: false,
          edit: true,

          editButtonDisabled: true
        });
      });
    } else {
      saveAssessment(assessmentData).then(response => {
        navigateTo("/assessment/" + response.id + "/edit");
        setAssessment({
          ...assessment,
          save: false,
          edit: true,
          id: response.id
        });
      });
    }
  };

  const setEditFn = () => {
    setAssessment({ ...assessment, edit: false });

    setTimeout(function () {
      setAssessment({
        ...assessment,
        edit: true,
        save: false,
        editButtonDisabled: true
      });
    }, 3600000);
  };
  const componentRef = React.useRef();

  function createMarkup() {
    return { __html: assessment.assessment };
  }
  function MyComponent() {
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "bottom" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "bottom" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {assessment.addMore &&
        assessment.addMore.listing &&
        assessment.addMore.listing.length
        ? assessment.addMore.listing.map((data, index) => (
          <MenuItem
            onClick={() => {
              setAnchorEl(false);
              setAddMoreListing(index, data.key);
            }}
          >
            {tl(data.value)}
          </MenuItem>
        ))
        : ""}
    </Menu>
  );
  const pointerEvent = {
    "pointer-events": "none"
  };
  return (
    <Info>
      <iframe className="ifrm">
        <table
          ref={componentRef}
          className="fullWdth"
          name="table"
          id="table"
          cellspacing="0"
        >
          <thead>
            <tr>
              <td colspan="1" className="pdngLft15" />
              <td colspan="5" className={"pdngTop50 brdBtm"}>
                <Typography>
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.resourceCentre &&
                    !isEmpty(StoreData.userContext.resourceCentre)
                    ? StoreData.userContext.resourceCentre.name
                    : ""}
                </Typography>
                <Typography>
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.resourceCentre &&
                    !isEmpty(StoreData.userContext.resourceCentre)
                    ? StoreData.userContext.resourceCentre.address
                    : ""}
                  ,{" "}
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.resourceCentre &&
                    !isEmpty(StoreData.userContext.resourceCentre)
                    ? StoreData.userContext.resourceCentre.city
                    : ""}
                </Typography>
                <Typography>
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.resourceCentre &&
                    !isEmpty(StoreData.userContext.resourceCentre)
                    ? StoreData.userContext.resourceCentre.phone
                    : ""}
                </Typography>
              </td>

              <td colspan="5" className="pdngTop50 txtAlgnRight brdBtm">
                <table>
                  <tr>
                    <td>
                      <Typography>
                        {StoreData &&
                          StoreData.userContext &&
                          StoreData.userContext.user &&
                          !isEmpty(StoreData.userContext.user)
                          ? StoreData.userContext.user.title + "."
                          : ""}
                        {StoreData &&
                          StoreData.userContext &&
                          StoreData.userContext.user &&
                          !isEmpty(StoreData.userContext.user)
                          ? StoreData.userContext.user.firstName +
                          " " +
                          StoreData.userContext.user.lastName
                          : ""}
                      </Typography>
                      <Typography>
                        {StoreData &&
                          StoreData.userContext &&
                          StoreData.userContext.user &&
                          !isEmpty(StoreData.userContext.user)
                          ? StoreData.userContext.user.qualification + "."
                          : ""}
                      </Typography>
                      <Typography>
                        {" "}
                        Registration No.
                        {StoreData &&
                          StoreData.userContext &&
                          StoreData.userContext.user &&
                          !isEmpty(StoreData.userContext.user)
                          ? StoreData.userContext.user.registrationNumber + "."
                          : ""}
                      </Typography>
                    </td>
                  </tr>
                </table>
              </td>
              <td colspan="1" className="pdngright15" />
            </tr>
          </thead>
          <tbody className={"pdngTop50 pdngBottom50"}>
            <tr>
              <td colspan="1" />
              <td className={"pdngTop15"} colspan="10">
                <>
                  <Typography>
                    {patient.firstName}&nbsp;{patient.lastName}
                  </Typography>

                  <Typography className="printFont">{patient.phone}</Typography>
                </>
              </td>
              <td colspan="1" />
            </tr>
            {assessment && assessment.symptoms && assessment.symptoms.length ? (
              <tr>
                <td colspan="1" />
                <td className={"pdngTop15"} colspan="10">
                  <>
                    <Typography>Chief complaints</Typography>

                    <Typography className="printFont">
                      {assessment &&
                        assessment.symptoms &&
                        assessment.symptoms.length
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
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}

            {assessment.assessment ? (
              <tr>
                <td colspan="1" />
                <td className={"pdngTop15"} colspan="10">
                  <>
                    <Typography>Status</Typography>

                    {assessment.assessment ? (
                      <Typography className="printFont">
                        <MyComponent />
                      </Typography>
                    ) : (
                        <Typography className="printFont">No</Typography>
                      )}
                  </>
                </td>
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}

            {assessment.assessmentImage ? (
              <tr>
                <td colspan="1" />
                <td colspan="10">
                  <img
                    className="asmntImg"
                    src={assessment.assessmentImage}
                  />
                </td>
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}
            {assessment && assessment.tests && assessment.tests.length ? (
              <tr>
                <td colspan="1" />
                <td className="pdngTop15" colspan="10">
                  <>
                    <Typography>Lab tests</Typography>

                    <Typography className="printFont">
                      {assessment && assessment.tests && assessment.tests.length
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
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}
            {assessment.diagnosis.diagnosis ? (
              <tr>
                <td colspan="1" />
                <td className="pdngTop15" colspan="10">
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
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}

            {assessment &&
              assessment.prescription &&
              assessment.prescription.length ? (
                <tr>
                  <td colspan="1" />
                  <td className="pdngTop15" colspan="10">
                    <>
                      <Typography>Medicines</Typography>

                      <Typography className="printFont">
                        <table className="fullWdth">
                          {assessment &&
                            assessment.prescription &&
                            assessment.prescription.length
                            ? assessment.prescription.map((data, index) => (
                              <>
                                <tr>
                                  <td colspan="4">
                                    {data.genericName} <br />
                                    {data.brandName}
                                  </td>
                                  <td colspan="4">
                                    {data.frequency} times/day {data.meal} meal
                                  </td>
                                  <td colspan="4">
                                    {data.frequency * data.days} tablets (
                                    {data.days}{" "}
                                    {data.frequencyType == "daily"
                                      ? "days"
                                      : "week"}
                                    )
                                  </td>
                                </tr>
                              </>
                            ))
                            : "No"}
                        </table>
                      </Typography>
                    </>
                  </td>
                  <td colspan="1" />
                </tr>
              ) : (
                ""
              )}
            {assessment.showFollowUp ? (
              <tr>
                <td colspan="1" />
                <td className="pdngTop15" colspan="10">
                  <>
                    <Typography>
                      {" "}
                      Follow up in {assessment.days}{" "}
                      {assessment.frequencyType == "daily" ? "days" : "week"}
                    </Typography>
                  </>
                </td>
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}

            {assessment.riskfactor ? (
              <tr>
                <td colspan="1" />
                <td className="pdngTop15" colspan="10">
                  <>
                    <Typography> Risk Factor</Typography>

                    <Typography className="printFont">
                      {assessment.risk}
                    </Typography>
                  </>
                </td>
                <td colspan="1" />
              </tr>
            ) : (
                ""
              )}

            {/* <tr>
              <td colspan="1" />
              <td style={{ "padding-top": "15px" }} colspan="10">
                <img
                  height="35px"
                  src="https://www.pinclipart.com/picdir/middle/163-1635333_common-types-cursive-font-gif-signatures-cliparts-good.png"
                />
              </td>
              <td colspan="1" />
            </tr> */}

            <tr>
              <td colspan="1" />
              <td colspan="10" className="pdngTop15">
                <Typography>
                  {" "}
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.user &&
                    !isEmpty(StoreData.userContext.user) &&
                    StoreData.userContext.user.title
                    ? StoreData.userContext.user.title + "."
                    : ""}
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.user &&
                    !isEmpty(StoreData.userContext.user) &&
                    StoreData.userContext.user.firstName
                    ? StoreData.userContext.user.firstName +
                    " " +
                    StoreData.userContext.user.lastName
                    : ""}
                </Typography>

                <Typography className="printFont">
                  {StoreData &&
                    StoreData.userContext &&
                    StoreData.userContext.user &&
                    !isEmpty(StoreData.userContext.user) &&
                    StoreData.userContext.user.qualification
                    ? StoreData.userContext.user.qualification + "."
                    : ""}
                </Typography>
              </td>
              <td colspan="1" />
            </tr>
            <tr>
              <td colspan="1" />
              <td className="pdngTop15" colspan="10">
                <Typography>
                  Dated: {calendarFns.convertADtoBS(moment()).formatted2}
                </Typography>
              </td>
              <td colspan="1" />
            </tr>
          </tbody>

          <tfoot className="pFooter">
            <tr>
              <td colspan="1" className="prntFootermain" />
              <td colspan="5" className="prntFooterCont">
                <Typography>
                  {patient.firstName}&nbsp;{patient.lastName}&nbsp;
                  {patient.phone}
                </Typography>

                <p />
              </td>

              <td colspan="5" className="prntFooterCont1">
                <table>
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
                </table>
              </td>
              <td colspan="1" className="prntFootermainend" />
            </tr>
          </tfoot>
        </table>
      </iframe>

      <Container fixed>
        <Grid container>
          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom>
              <b>
                {patient.firstName}&nbsp;{patient.lastName}
              </b>
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              <b>
                {tl("Phone")}: {patient.phone}
              </b>
            </Typography>
            <VerticalLinearStepper history={patientHistory} />
          </Grid>

          <Grid item xs={7}>
            <Typography variant="h6" gutterBottom>
              <b>{tl("Assessment")}</b>
            </Typography>
            <Symptoms
              makeSetPropsValueFn={makeSetPropsValueFn}
              save={assessment.save}
              edit={assessment.edit}
              symptoms={assessment.symptoms}
            />
            <Slate
              save={assessment.save}
              edit={assessment.edit}
              assessment={assessment.assessment}
              assessmentImage={assessment.assessmentImage}
              makeSetPropsValueFn={makeSetPropsValueFn}
              removeAssessmentImage={removeAssessmentImage}
            />

            <LabTest
              save={assessment.save}
              edit={assessment.edit}
              makeSetPropsValueFn={makeSetPropsValueFn}
              tests={assessment.tests}
            />

            <Diagnosis
              makeSetPropsValueFn={makeSetPropsValueFn}
              save={assessment.save}
              edit={assessment.edit}
              diagnosis={assessment.diagnosis}
            />

            <MedicationModal
              removePrescription={removePrescription}
              save={assessment.save}
              edit={assessment.edit}
              makeSetPropsValueFn={makeSetPropsValueFn}
              medication={medication}
            />

            {assessment.showFollowUp ? (
              <Grid container>
                <Grid className="mrgnTop24" item xs={3}>
                  <FormLabel className="mrgnBtm12" component="legend">
                    <b>{tl("Follow up")}</b>
                  </FormLabel>
                  <ButtonGroup
                    size="small"
                    aria-label="small outlined button group"
                  >
                    <Button
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
                      onChange={e => {
                        setAssessment({ ...assessment, days: e.target.value });
                      }}
                      value={assessment.days}
                    />

                    <Button
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
                <Grid className="flwUpBtn" item xs={3}>
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

                <Grid item xs={5} className="mtp30">
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
                    variant="filled"
                  />
                </Grid>

                <Grid item xs={1} className="flwClearBtn">
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
            ) : (
                ""
              )}
            {assessment.riskfactor ? (
              <Grid container className="mt24">
                <Grid item xs={10} sm={11} md={11} lg={11}>
                  <FormLabel component="legend">
                    <b>{tl("Risk Factor")}</b>
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
                    variant="filled"
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
              </Grid>
            ) : (
                ""
              )}

            {assessment &&
              assessment.addMore &&
              assessment.addMore.listing &&
              assessment.addMore.listing.length ? (
                <Grid className={"addMoreMrgn"}>
                  <Grid>
                    <Button
                      onClick={handleProfileMenuOpen}
                      className={"btnUnderLine"}
                      disabled={assessment.edit}
                    >
                      {tl("Add more +")}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            <Grid container className={"justifyCntEnd"}>
              {assessment.edit ? (
                <Grid>
                  <Button
                    disabled={assessment.editButtonDisabled}
                    onClick={() => {
                      setEditFn();
                    }}
                    className="mr10"
                    variant={"contained"}
                  >
                    {tl("Edit")}
                  </Button>

                  <ReactToPrint
                    trigger={() => (
                      <Button variant={"contained"}>{tl("Print")}</Button>
                    )}
                    content={() => componentRef.current}
                  />
                </Grid>
              ) : (
                  <Grid>
                    <Button
                      onClick={() => {
                        saveAssessmentFn();
                        setAssessment({ ...assessment });
                      }}
                      className={"succesBtn"}
                      variant={"contained"}
                    >
                      {assessment.id ? "Update Assessment" : "Save Assessment"}
                    </Button>
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Grid>
        {renderMenu}
      </Container>
    </Info>
  );
};

export default connect(
  state => ({
    StoreData: state
  }),
  dispatch => ({
    navigateTo: url => {
      dispatch(push(url));
    }
  })
)(Assessment);
