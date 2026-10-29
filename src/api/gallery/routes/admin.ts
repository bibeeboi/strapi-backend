export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/galleries',
      handler: 'gallery.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'GET',
      path: '/admin/galleries/:documentId',
      handler: 'gallery.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'POST',
      path: '/admin/galleries',
      handler: 'gallery.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'PUT',
      path: '/admin/galleries/:documentId',
      handler: 'gallery.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/galleries/:documentId',
      handler: 'gallery.deleteAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
  ],
};
