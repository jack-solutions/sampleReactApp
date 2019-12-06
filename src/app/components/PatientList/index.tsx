import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

 
const cellStyle = {
    verticalalign: 'middle',
    marginleft: '5px',
  };
  
const evenRowStyle = {
    backgroundColor: '#f2f2f2',
    marginTop: '2em',
    marginBottom: '2em',
  };

const oddRowStyle = {
    marginTop: '2em',
    marginBottom: '2em',
};


export function Patient(props) {
    const index = props.index;
    const patientname = props.patientname;
    const starttime = props.starttime;
    const visitreason = props.visitreason;
    const lastvisit = props.lastvisit;
    const rowStyle = props.index % 2 === 0 ? evenRowStyle : oddRowStyle;
    return (
        <TableRow key="patientTable" style={rowStyle}>
            <TableCell style={cellStyle}>{index}</TableCell>
            <TableCell style={cellStyle}>{patientname}</TableCell>
            <TableCell style={cellStyle}>{starttime}</TableCell>
            <TableCell style={cellStyle}>{visitreason}</TableCell>
            <TableCell style={cellStyle}>{lastvisit}</TableCell>
        </TableRow>
    )
 }
 
 export function PatientList(props){
     const patients = props.patients
     return (
        <Table id="patientListTable" className="table">
        <TableHead>
            <TableRow>
                <TableCell>Symbol Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Reason Of Visit</TableCell>
                <TableCell>Last Visit</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        { patients.map(patient =>{
            return (
                <Patient index={patient.id} patientname={patient.name} starttime={patient.startTime}
                    visitreason={patient.reasonOfVisit} lastvisit={patient.dayFromLastVisit}/>)
                }
            )
        }
        </TableBody>
        </Table>
     )
 }

 export default PatientList;