
/**
 * gallery controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::gallery.gallery',
  ({ strapi }) => ({

    async find(ctx) {
      const user = ctx.state.user;

      // Public: gunakan perilaku default Strapi
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

      // Public: gunakan perilaku default Strapi
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

      const gallery = await strapi
        .query('api::gallery.gallery')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!gallery) {
        return ctx.notFound(
          'Gallery tidak ditemukan atau bukan milik organization Anda'
        );
      }

      return await super.findOne(ctx);
    },

    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login diperlukan');
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

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        organization: currentUser.organization.id,
      };

      return await super.create(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Login diperlukan');
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

      const gallery = await strapi
        .query('api::gallery.gallery')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!gallery) {
        return ctx.forbidden(
          'Anda tidak dapat mengubah gallery organization lain'
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
        return ctx.unauthorized('Login diperlukan');
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

      const gallery = await strapi
        .query('api::gallery.gallery')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: {
              id: organizationId,
            },
          },
        });

      if (!gallery) {
        return ctx.forbidden(
          'Anda tidak dapat menghapus gallery organization lain'
        );
      }

      return await super.delete(ctx);
    },

  })
);
