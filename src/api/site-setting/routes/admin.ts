export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/site-settings',
      handler: 'site-setting.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'GET',
      path: '/admin/site-settings/:documentId',
      handler: 'site-setting.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'POST',
      path: '/admin/site-settings',
      handler: 'site-setting.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'PUT',
      path: '/admin/site-settings/:documentId',
      handler: 'site-setting.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/site-settings/:documentId',
      handler: 'site-setting.deleteAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
  ],
};
