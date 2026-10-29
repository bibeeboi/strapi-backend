export default {
  routes: [
    {
      method: 'GET',
      path: '/admin/videos',
      handler: 'video.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'GET',
      path: '/admin/videos/:documentId',
      handler: 'video.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'POST',
      path: '/admin/videos',
      handler: 'video.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'PUT',
      path: '/admin/videos/:documentId',
      handler: 'video.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
    {
      method: 'DELETE',
      path: '/admin/videos/:documentId',
      handler: 'video.deleteAdmin',
      config: {
        auth: false,
        policies: ['global::is-admin-caller'],
      },
    },
  ],
};
