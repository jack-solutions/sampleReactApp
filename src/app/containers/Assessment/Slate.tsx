import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DrawingBoard from "./DrawingBoard";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Redo from "@material-ui/icons/Redo";
import Undo from "@material-ui/icons/Undo";
import Clear from "@material-ui/icons/Clear";
import Grid from "@material-ui/core/Grid";
import Edit from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import { tl } from "../../components/translate";
import FormLabel from "@material-ui/core/FormLabel";
import "./index.css";
import styles from './Assessment.module.css';
import { Box } from '@material-ui/core';

let svgPath = "";
export default class Slate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainData: [],
      addRedoActionData: [],
      open: false,
      assessment: undefined,
      assessmentText: ""
    };
    this.clearAllFn = this.clearAllFn.bind(this);
    this.clearFn = this.clearFn.bind(this);
  }


  componentWillReceiveProps(props) {
    this.setState({
      assessmentText: props.assessment,
      assessment: props.assessmentImage
    })
  }

  clearAllFn(data, svg) {
    this.state.mainData = data;
    svgPath = svg;
  }

  clearFn() {
    this.setState({ mainData: [], addRedoActionData: [] });
  }

  undoFn() {
    if (this.state.mainData && this.state.mainData.length) {
      var mainData = this.state.mainData;
      this.state.addRedoActionData.push(mainData[mainData.length - 1]);
      mainData.splice(mainData.length - 1, 1);
      this.setState({ mainData });
    }
  }

  redoFn() {
    if (this.state.addRedoActionData && this.state.addRedoActionData.length) {
      var addRedoActionData = this.state.addRedoActionData;
      var mainData = this.state.mainData;
      mainData.push(addRedoActionData[addRedoActionData.length - 1]);
      addRedoActionData.splice(addRedoActionData.length - 1, 1);
      this.setState({ mainData, addRedoActionData });
    }
  }

  downloadImageFn() {
    var xml = new XMLSerializer().serializeToString(svgPath);

    var svg64 = btoa(xml);
    var b64Start = "data:image/svg+xml;base64,";

    var image64 = b64Start + svg64;


    this.setState({ assessment: image64, open: false });

    this.props.makeSetPropsValueFn(image64, "assessmentImage");

  }

  render() {
    const pointerEvent = {
      "pointer-events": "none"
    };
    return (
      <React.Fragment>
        <Grid container justify="space-between">
          <FormLabel className={'mt20'} component="legend">
            <Box fontSize={'14px'} fontWeight={600}>{tl("Status")}</Box>
          </FormLabel>

          <Grid item>
            <Button
              disabled={this.props.edit}
              variant="contained"
              onClick={() => {
                this.setState({
                  open: !this.state.open
                });
              }}
              className="icdBtn ButtonField pull-right"
            >
              <Edit />
            </Button>
          </Grid>
        </Grid>

        <Grid container justify="space-between">
          <Grid item xs={12}>
            <TextField
              id="standard-multiline-flexible"
              fullWidth
              multiline
              disabled={this.props.edit}
              rows="3"
              InputProps={{ classes: { root: styles.TextField } }}
              margin="normal"
              variant="outlined"
              onChange={e => {
                this.props.makeSetPropsValueFn(
                  e.target.value,
                  "assessment"
                );
              }}
              value={this.state.assessmentText}
            />
          </Grid>
        </Grid>

        {this.state.assessment ? (
          <Grid container justify="space-between">
            <Grid item xs={11}>
              <img
                className={'assmntImg'}
                src={this.state.assessment}
              />
            </Grid>

            <Grid item xs={1}>
              <i
                style={this.props.edit ? pointerEvent : {}}
                onClick={() => {
                  this.setState({ assessment: undefined });
                  this.props.removeAssessmentImage(
                    undefined,
                    "assessmentImage"
                  );
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

        <Dialog open={this.state.open} classes={{ paper: "slate" }}>
          <DialogTitle className="dgTitle">
            <MuiDialogTitle className="dgTitle" disableTypography>
              <Grid container>
                <Grid item xs={7} className="mrgTp7">
                  <Typography>
                    <b className="whiteColor">
                      {tl("Assessment - free from writing")}
                    </b>
                  </Typography>
                </Grid>

                <Grid item xs={5} className="txtAlgnEnd">
                  <ButtonGroup
                    size="small"
                    aria-label="Small outlined button group"
                  >
                    <Button
                      className="backGrndColor"
                      onClick={() => {
                        this.undoFn();
                      }}
                    >
                      <Undo />
                    </Button>
                    <Button
                      className="backGrndColor"
                      onClick={() => {
                        this.redoFn();
                      }}
                    >
                      <Redo />
                    </Button>
                    <Button
                      className="backGrndColor"
                      onClick={() => {
                        this.clearFn();
                      }}
                    >
                      <Clear />
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </MuiDialogTitle>
          </DialogTitle>
          <DialogContent className={"drawingBoard"}>
            <DrawingBoard
              data={this.state.mainData}
              clearAllFn={this.clearAllFn}
              height={700}
              width={600}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ open: false });
              }}
              variant={"contained"}
            >
              {tl("Cancel")}
            </Button>

            <Button
              onClick={() => {
                this.downloadImageFn();
              }}
              variant={"contained"}
            >
              {tl("OK")}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
