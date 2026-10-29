export default {
  routes: [
    {
      method: 'POST',
      path: '/admin-account',
      handler: 'admin-account.create',
      config: { auth: false, policies: ['global::is-admin-caller'] },
    },
    {
      method: 'GET',
      path: '/admin-account',
      handler: 'admin-account.list',
      config: { auth: false, policies: ['global::is-admin-caller'] },
    },
    {
      method: 'PUT',
      path: '/admin-account/:id',
      handler: 'admin-account.update',
      config: { auth: false, policies: ['global::is-admin-caller'] },
    },
    {
      method: 'DELETE',
      path: '/admin-account/:id',
      handler: 'admin-account.remove',
      config: { auth: false, policies: ['global::is-admin-caller'] },
    },
  ],
};
