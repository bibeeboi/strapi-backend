import type { Context } from 'koa';
import type { Core } from '@strapi/strapi';

interface CreateAdminBody {
  email?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  roleId?: number;
}

interface UpdateAdminBody {
  firstname?: string;
  lastname?: string;
  isActive?: boolean;
  blocked?: boolean;
  roleId?: number;
}

interface AdminRole {
  name: string;
}

interface AdminUser {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  isActive: boolean;
  blocked: boolean;
  roles?: AdminRole[];
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx: Context) {
    const { email, firstname, lastname, password, roleId } =
      (ctx.request.body ?? {}) as CreateAdminBody;

    if (!email || !password || !roleId) {
      return ctx.badRequest('email, password, dan roleId wajib diisi');
    }

    const role = await strapi.db.query('admin::role').findOne({ where: { id: roleId } });
    if (!role) return ctx.badRequest('Role tidak ditemukan');

    const exists = await strapi.service('admin::user').exists({ email });
    if (exists) return ctx.badRequest('Email sudah terdaftar sebagai admin user');

    const user = await strapi.service('admin::user').create({
      email,
      firstname,
      lastname,
      password,
      roles: [role.id],
      isActive: true,
    });

    ctx.body = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  },

  async list(ctx: Context) {
    const users = await strapi.db.query('admin::user').findMany({ populate: ['roles'] });

    ctx.body = users.map((user: AdminUser) => ({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isActive: user.isActive,
      blocked: user.blocked,
      roles: user.roles?.map((role) => role.name),
    }));
  },

  async update(ctx: Context) {
    const id = Number(ctx.params.id);
    const { firstname, lastname, isActive, blocked, roleId } =
      (ctx.request.body ?? {}) as UpdateAdminBody;
    const data: Record<string, unknown> = { firstname, lastname, isActive, blocked };

    if (roleId) {
      const role = await strapi.db.query('admin::role').findOne({ where: { id: roleId } });
      if (!role) return ctx.badRequest('Role tidak ditemukan');
      data.roles = [role.id];
    }

    const updated = await strapi.service('admin::user').updateById(id, data);
    if (!updated) return ctx.notFound();
    ctx.body = { id: updated.id, email: updated.email };
  },

  async remove(ctx: Context) {
    const id = Number(ctx.params.id);
    if (ctx.state.adminUser?.id === id) {
      return ctx.badRequest('Admin tidak dapat menghapus dirinya sendiri');
    }

    const deleted = await strapi.service('admin::user').deleteById(id);
    if (!deleted) return ctx.notFound();
    ctx.body = { message: 'Admin user dihapus', id: deleted.id };
  },
});
