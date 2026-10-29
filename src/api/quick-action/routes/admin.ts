export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/quick-actions',
      handler: 'quick-action.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'GET',
      path: '/admin/quick-actions/:documentId',
      handler: 'quick-action.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'POST',
      path: '/admin/quick-actions',
      handler: 'quick-action.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'PUT',
      path: '/admin/quick-actions/:documentId',
      handler: 'quick-action.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/quick-actions/:documentId',
      handler: 'quick-action.deleteAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
  ],
};
