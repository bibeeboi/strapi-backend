import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::berita.berita',
  ({ strapi }) => ({

    async find(ctx) {
      const user = ctx.state.user;

      // Public
      if (!user) {
        return await super.find(ctx);
      }

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: {
            organization: true,
          },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden(
          'User belum memiliki organization'
        );
      }

      const organizationId = currentUser.organization.id;

      const query = ctx.query as any;

      query.filters = {
        ...(query.filters || {}),
        organization: {
          id: organizationId,
        },
      };

      return await super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return await super.findOne(ctx);
      }

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: {
            organization: true,
          },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden(
          'User belum memiliki organization'
        );
      }

      const organizationId = currentUser.organization.id;

      const berita = await strapi
        .query('api::berita.berita')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!berita) {
        return ctx.notFound(
          'Berita tidak ditemukan atau bukan milik organization Anda'
        );
      }

      return await super.findOne(ctx);
    },

    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized(
          'Login diperlukan'
        );
      }

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: {
            organization: true,
          },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden(
          'User belum memiliki organization'
        );
      }

      const organizationId = currentUser.organization.id;

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        organization: organizationId,
      };

      return await super.create(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized(
          'Login diperlukan'
        );
      }

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: {
            organization: true,
          },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden(
          'User belum memiliki organization'
        );
      }

      const organizationId = currentUser.organization.id;

      const berita = await strapi
        .query('api::berita.berita')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!berita) {
        return ctx.forbidden(
          'Anda tidak dapat mengubah berita organization lain'
        );
      }

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        organization: organizationId,
      };

      return await super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized(
          'Login diperlukan'
        );
      }

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: {
            organization: true,
          },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden(
          'User belum memiliki organization'
        );
      }

      const organizationId = currentUser.organization.id;

      const berita = await strapi
        .query('api::berita.berita')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!berita) {
        return ctx.forbidden(
          'Anda tidak dapat menghapus berita organization lain'
        );
      }

      return await super.delete(ctx);
    },

  })
);