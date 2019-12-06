import * as OngoingActions from '../actions/ongoing';

export default store => next => async action => {
  const {type, payload, meta} = action;

  if (!meta || !meta.async) {
    return next(action);
  }

  next(OngoingActions.ongoingAdd(type));

  try {
    next({type, payload: await payload()});
  } catch (error) {
    const { errorActionCreator } = meta;
    if (errorActionCreator) {
      next(errorActionCreator(error));
    } else {
      next({type, error: true, payload: error});
    }
  }
  next(OngoingActions.ongoingRemove(type));
};
