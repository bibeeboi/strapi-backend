/**
 * quick-action controller
 */

import { factories } from '@strapi/strapi';

async function resolveAdminOrganization(strapi: any, adminUser: any) {
  const adminRecord = await strapi.db.query('admin::user').findOne({
    where: { id: adminUser.id },
    populate: ['roles'],
  });

  const isSuperAdmin = adminRecord?.roles?.some(
    (role: any) => role.code === 'strapi-super-admin'
  );

  if (isSuperAdmin) {
    return { isSuperAdmin: true, organizationId: null };
  }

  const operator = await strapi.db.query('api::operator.operator').findOne({
    where: { email: adminUser.email },
    populate: ['organization'],
  });

  if (!operator?.organization) {
    return { isSuperAdmin: false, organizationId: null };
  }

  return {
    isSuperAdmin: false,
    organizationId: operator.organization.id,
  };
}

export default factories.createCoreController(
  'api::quick-action.quick-action',
  ({ strapi }) => ({
    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return await super.find(ctx);

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: { organization: true },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden('User belum memiliki organization');
      }

      const query = ctx.query as any;
      query.filters = {
        ...(query.filters || {}),
        organization: { id: currentUser.organization.id },
      };

      return await super.find(ctx);
    },

    async findAdmin(ctx) {
      const adminUser = ctx.state.adminUser;
      if (!adminUser) {
        return ctx.unauthorized('Login admin diperlukan');
      }

      const { isSuperAdmin, organizationId } = await resolveAdminOrganization(strapi, adminUser);

      if (!isSuperAdmin && !organizationId) {
        return ctx.forbidden('Admin belum terhubung ke organization');
      }

      const query = ctx.query as any;
      if (!isSuperAdmin) {
        query.filters = {
          ...(query.filters || {}),
          organization: { id: organizationId },
        };
      }

      return await super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      if (!user) return await super.findOne(ctx);

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: { organization: true },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden('User belum memiliki organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: { id: currentUser.organization.id },
          },
        });

      if (!quickAction) {
        return ctx.notFound(
          'Quick action tidak ditemukan atau bukan milik organization Anda'
        );
      }

      return await super.findOne(ctx);
    },

    async findOneAdmin(ctx) {
      const adminUser = ctx.state.adminUser;
      if (!adminUser) {
        return ctx.unauthorized('Login admin diperlukan');
      }

      const { isSuperAdmin, organizationId } = await resolveAdminOrganization(strapi, adminUser);

      if (!isSuperAdmin && !organizationId) {
        return ctx.forbidden('Admin belum terhubung ke organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            ...(isSuperAdmin ? {} : { organization: { id: organizationId } }),
          },
        });

      if (!quickAction) {
        return ctx.notFound(
          'Quick action tidak ditemukan atau bukan milik organization Anda'
        );
      }

      return await super.findOne(ctx);
    },

    async create(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login diperlukan');

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: { organization: true },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden('User belum memiliki organization');
      }

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        organization: currentUser.organization.id,
      };

      return await super.create(ctx);
    },

    async createAdmin(ctx) {
      const adminUser = ctx.state.adminUser;
      if (!adminUser) {
        return ctx.unauthorized('Login admin diperlukan');
      }

      const { isSuperAdmin, organizationId } = await resolveAdminOrganization(strapi, adminUser);

      if (!isSuperAdmin && !organizationId) {
        return ctx.forbidden('Admin belum terhubung ke organization');
      }

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        ...(isSuperAdmin ? {} : { organization: organizationId }),
      };

      return await super.create(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login diperlukan');

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: { organization: true },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden('User belum memiliki organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: { id: currentUser.organization.id },
          },
        });

      if (!quickAction) {
        return ctx.forbidden(
          'Anda tidak dapat mengubah quick action organization lain'
        );
      }

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        organization: currentUser.organization.id,
      };

      return await super.update(ctx);
    },

    async updateAdmin(ctx) {
      const adminUser = ctx.state.adminUser;
      if (!adminUser) {
        return ctx.unauthorized('Login admin diperlukan');
      }

      const { isSuperAdmin, organizationId } = await resolveAdminOrganization(strapi, adminUser);

      if (!isSuperAdmin && !organizationId) {
        return ctx.forbidden('Admin belum terhubung ke organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            ...(isSuperAdmin ? {} : { organization: { id: organizationId } }),
          },
        });

      if (!quickAction) {
        return ctx.forbidden(
          'Anda tidak dapat mengubah quick action organization lain'
        );
      }

      ctx.request.body.data = {
        ...(ctx.request.body.data || {}),
        ...(isSuperAdmin ? {} : { organization: organizationId }),
      };

      return await super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Login diperlukan');

      const currentUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: user.id },
          populate: { organization: true },
        });

      if (!currentUser?.organization) {
        return ctx.forbidden('User belum memiliki organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            organization: { id: currentUser.organization.id },
          },
        });

      if (!quickAction) {
        return ctx.forbidden(
          'Anda tidak dapat menghapus quick action organization lain'
        );
      }

      return await super.delete(ctx);
    },

    async deleteAdmin(ctx) {
      const adminUser = ctx.state.adminUser;
      if (!adminUser) {
        return ctx.unauthorized('Login admin diperlukan');
      }

      const { isSuperAdmin, organizationId } = await resolveAdminOrganization(strapi, adminUser);

      if (!isSuperAdmin && !organizationId) {
        return ctx.forbidden('Admin belum terhubung ke organization');
      }

      const quickAction = await strapi
        .query('api::quick-action.quick-action')
        .findOne({
          where: {
            documentId: ctx.params.documentId,
            ...(isSuperAdmin ? {} : { organization: { id: organizationId } }),
          },
        });

      if (!quickAction) {
        return ctx.forbidden(
          'Anda tidak dapat menghapus quick action organization lain'
        );
      }

      return await super.delete(ctx);
    },
  })
);
