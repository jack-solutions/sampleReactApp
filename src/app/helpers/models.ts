
import clone from 'lodash/clone';

export const fillData = (model, fillData) => {
  return model.map(field => {
    field = clone(field);
    const data = fillData[field.key];
    if (data) {
      field.value = data.value;
      if (field.inputType == 'select' && data.options) {
        field.options = data.options
      }
    };
    return field
  });
}