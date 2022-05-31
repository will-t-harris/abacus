import SchemaBuilder from "@pothos/core";
import PrismaClient from "../prismaClient.js";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";

const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes }>({
  plugins: [PrismaPlugin],
  prisma: {
    client: PrismaClient,
  },
});

builder.prismaObject("User", {
  name: "User",
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
  }),
});

builder.queryType({
  fields: (t) => ({
    user: t.prismaField({
      type: "User",
      resolve: async (query) =>
        PrismaClient.user.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { id: 1 },
        }),
    }),
  }),
});

export const schema = builder.toSchema({});
