const rules = {
  ResourceCentre: {
    employee: 'a',
  },
  ServiceProvider: {
    employee: 'a',
    admin: 'a',
    serviceProvider: (action, user, spProps) =>
      ['read', 'edit', 'admin'].includes(action) && user.id == spProps.id,
  },
  Employee: {
    employee: 'a',
    admin: 'a'
  },
  Service: {
    employee: 'a',
  },
  Patient: {
    employee: 'a',
    serviceProvider: 'a',
  },
  Slot: {
    employee: (action, user, slotProps) => {
      switch (action) {
        case 'admin':
          return user.resourceCentreId == slotProps.resourceCentreId;
        default:
          return false;
      }
    },
    serviceProvider: (action, user, slotProps) => {
      switch (action) {
        case 'admin':
          return user.id == slotProps.serviceProviderId;
        default:
          return false;
      }
    },
  },
};

const actions = { create: 'c', read: 'r', edit: 'e', delete: 'd', admin: 'a', forbidden: 'x' };

export default (user) => {
  return {
    can: (action: string, entity, object?) => {
      try {
        const rule = (rules[entity] || {})[user.role];
        if (user.role == 'Admin') return true;
        if (!user.role || !rule) return false;
        if (typeof rule === 'string') {
          if (rule == 'admin' || rule == 'a') return true;
          return !!~rule.indexOf(actions[action]);
        } else {
          return rule(action, user, object);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  };
};
