import { Get, Post, Delete, Put } from './apiHelper';

const servicesRoot = '/api/symptoms';

const diagnosisRoot = '/api/icd';

const labTest = '/api/lab_tests';

const assessmentsRoot = '/api/assessments';

export const assessmentAttachmentsUrl = (assessmentId) => {
  if (assessmentId) {
    return `/api/assessments/${assessmentId}/attachments`
  } else {
    return `/api/assessments/attachments`;
  }
};

export async function getBatchSymptoms() {
  const response = await Get(`${servicesRoot}`, true);

  return response.data;
}

export async function getBatchDiagnosis() {
  const response = await Get(`${diagnosisRoot}`, true);

  return response.data;
}

export async function getLabTest() {
  const response = await Get(`${labTest}`, true);

  return response.data;
}

export async function saveAssessment(data) {
  const response = await Post(`${assessmentsRoot}`, data, true);

  return response.data;
}

export async function getAssessmentById(assessmentId) {
  const response = await Get(`${assessmentsRoot}/${assessmentId}`, true);
  return response.data;
}

export async function updateAssessment(assessmentId, assessmentData) {
  const response = await Put(`${assessmentsRoot}/${assessmentId}`, assessmentData, true);

  return response.data;
}

export async function deleteAssessment(assessmentId) {
  const response = await Delete(`${assessmentsRoot}/${assessmentId}`, true);
  return response.data;
}

export async function getAssessments(id) {
  const response = await Get(`${assessmentsRoot}` + '/?clientId=' + id, true);

  return response.data;
}
export async function getChildren(id) {
  const response = await Get(`${diagnosisRoot}/${id}` + '/children', true);
  return response.data;
}
export async function getSibblings(id) {
  const response = await Get(`${diagnosisRoot}/${id}` + '/parents', true);
  return response.data;
}
export async function searchDisease(diseaseName) {
  const response = await Get(`${diagnosisRoot}` + '/search/?q=' + diseaseName, true);

  return response.data;
}
