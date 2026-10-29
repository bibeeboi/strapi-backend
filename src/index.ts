import type { Core } from '@strapi/strapi';

const targets = [
  'api::berita.berita',
  'api::video.video',
  'api::gallery.gallery',
  'api::quick-action.quick-action',
  'api::site-setting.site-setting',
];

async function getAdminOrgAndRole(
  strapi: Core.Strapi,
  adminUserId: number,
  adminUserEmail: string
) {
  const user: any = await strapi.entityService.findOne('admin::user', adminUserId, {
    populate: ['roles'],
  });

  const isSuperAdmin = user?.roles?.some((r: any) => r.code === 'strapi-super-admin');

  const operator: any = await strapi.documents('api::operator.operator').findFirst({
    filters: { email: adminUserEmail },
    populate: ['organization'],
  });

  return { isSuperAdmin, org: operator?.organization };
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      if (!targets.includes(context.uid)) return next();

      const sessionUser = (strapi.requestContext?.get() as any)?.state?.user;
      if (!sessionUser) return next();

      const { isSuperAdmin, org } = await getAdminOrgAndRole(
        strapi,
        sessionUser.id,
        sessionUser.email
      );
      if (isSuperAdmin) return next();

      if (context.action === 'create' && org) {
        (context.params as any).data.organization = org.documentId;
      }

      if (['findMany', 'findOne'].includes(context.action) && org) {
        (context.params as any).filters = {
          ...(context.params as any).filters,
          organization: org.id,
        };
      }

      return next();
    });
  },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'],

      async afterCreate(event) {
        const { result } = event;

        const roles: any[] = result?.roles ?? [];
        const isOperator = roles.some((r) => r.name === 'Operator');
        if (!isOperator || !result?.email) return;

        const existing = await strapi.documents('api::operator.operator').findFirst({
          filters: { email: result.email },
        });
        if (existing) return;

        await strapi.documents('api::operator.operator').create({
          data: { email: result.email },
        });
      },
    });
  },
};
