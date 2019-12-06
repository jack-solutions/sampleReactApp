const classNames = (...items) => {
  let classStringified = '';
  items.forEach((className) => {
    if (typeof className === 'string') {
      classStringified = `${classStringified} ${className}`;
    } else if (typeof className == 'object') {
      Object.keys(className).forEach((key) => {
        if (className[key]) {
          classStringified = `${classStringified} ${key}`;
        }
      });
    }
  });
  return classStringified;
};

export default classNames;
