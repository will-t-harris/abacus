import SchemaBuilder from "@pothos/core";
import PrismaClient from "../prismaClient.js";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";

const builder = new SchemaBuilder<{
  Context: { user: { id: number } };
  PrismaTypes: PrismaTypes;
}>({
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

builder.prismaObject("PlaidItem", {
  name: "PlaidItem",
  findUnique: (plaidItem) => ({ id: plaidItem.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("institutionName"),
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
    plaidItem: t.prismaField({
      type: "PlaidItem",
      args: {
        id: t.arg({
          type: "Int",
          required: true,
        }),
      },
      resolve: async (query, _root, args) =>
        PrismaClient.plaidItem.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { id: args.id },
        }),
    }),
  }),
});

export const schema = builder.toSchema({});
