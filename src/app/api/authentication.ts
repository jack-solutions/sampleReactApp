import axios from 'axios';
import { store } from '../../';
import * as NotificationActions from '../actions/notification';

export async function login(credentials) {
  try {
    const response = await axios.post('/api/login', credentials);
    return response.data;
  } catch (err) {
    if (err.response.status = 401) {
      const n = NotificationActions.notificationAdd({
        id: (new Date()).getUTCMilliseconds(),
        variant: 'error',
        message: err.response.data.map(e => e.msg).join(' '),
        autoTimeout: true
      });
      store.dispatch(n);
    }
    return null;
  }
}