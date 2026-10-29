export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/beritas',
      handler: 'berita.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'GET',
      path: '/admin/beritas/:documentId',
      handler: 'berita.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'POST',
      path: '/admin/beritas',
      handler: 'berita.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'PUT',
      path: '/admin/beritas/:documentId',
      handler: 'berita.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/beritas/:documentId',
      handler: 'berita.deleteAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
  ],
};
