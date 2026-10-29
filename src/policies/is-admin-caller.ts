import type { Context } from 'koa';
import type { Core } from '@strapi/strapi';

export default async (
  ctx: Context,
  _config: unknown,
  { strapi }: { strapi: Core.Strapi }
) => {
  const authHeader = ctx.request.header.authorization;
  const [scheme, token] = authHeader?.split(/\s+/) ?? [];
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return false;
  }

  const sessionManager = strapi.sessionManager;
  if (!sessionManager) {
    return false;
  }

  const result = sessionManager('admin').validateAccessToken(token);
  if (!result.isValid) return false;

  const sessionIsActive = await sessionManager('admin').isSessionActive(result.payload.sessionId);
  if (!sessionIsActive) return false;

  const adminUser = await strapi.db.query('admin::user').findOne({
    where: { id: result.payload.userId },
    populate: ['roles'],
  });

  if (!adminUser?.isActive || adminUser.blocked) {
    return false;
  }

  ctx.state.adminUser = adminUser;
  return true;
};
