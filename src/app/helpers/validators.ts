export const isRequired = ({ msg }) => {
  const validator = (data) => {
    return !!data;
  }
  validator.msg = msg;
  return validator;
}
export const hasLength = ({ gt, lt, msg }) => {
  const validator = (data) => {
    let valid = false;
    if (gt) valid = data.length > gt;
    if (lt) valid = valid && data.length < lt;
    return valid;
  };
  validator.msg = msg;
  return validator;
}

export const isPhoneNumber = ({ msg }) => {
  const validator = (data) => {
    if (!data) return true;
    return !isNaN(Number(data)) && data.match(/^9[8|7]\d{8}$/);
  }
  validator.msg = msg;
  return validator;
}


export const isEmail = ({ msg }) => {
  const validator = (data) => {
    return data.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }
  validator.msg = msg;
  return validator;
}

export const isNumber = ({ msg }) => {
  const validator = (data) => {
    return !isNaN(Number(data)) && data.match(/\d+/);
  }
  validator.msg = msg;
  return validator;
}

export const validate = (data, validators) => {
  const messages = [];
  const isValid = validators.reduce((aggr, validator) => {
    let valid = validator(data);
    if (!valid) messages.push(validator.msg)
    return aggr && valid;
  }, true);
  return { isValid, messages };
}