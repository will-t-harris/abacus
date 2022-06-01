import SchemaBuilder from "@pothos/core";
import prisma from "../prismaClient.js";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver } from "graphql-scalars";

const builder = new SchemaBuilder<{
  Context: { user: { id: number } };
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.addScalarType("Date", DateResolver, {});

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
    institutionName: t.exposeString("institutionName"),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});

builder.queryType({
  fields: (t) => ({
    getUser: t.prismaField({
      type: "User",
      args: {
        email: t.arg({
          type: "String",
          required: true,
        }),
      },
      resolve: async (query, _root, args) => {
        const user = await prisma.user.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { email: args.email },
        });

        return user;
      },
    }),
    getPlaidItem: t.prismaField({
      type: "PlaidItem",
      args: {
        id: t.arg({
          type: "Int",
          required: true,
        }),
      },
      resolve: async (query, _root, args) => {
        const plaidItem = await prisma.plaidItem.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { id: args.id },
        });

        return plaidItem;
      },
    }),
    getPlaidItems: t.prismaField({
      type: ["PlaidItem"],
      args: {
        userId: t.arg({
          type: "Int",
          required: true,
        }),
      },
      resolve: async (query, _root, args) => {
        const plaidItems = await prisma.plaidItem.findMany({
          ...query,
          where: { userId: args.userId },
        });

        return plaidItems;
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createPlaidItem: t.prismaField({
      type: "PlaidItem",
      args: {
        institutionName: t.arg({
          type: "String",
          required: true,
        }),
        accessToken: t.arg({
          type: "String",
          required: true,
        }),
        itemId: t.arg({
          type: "String",
          required: true,
        }),
      },
      resolve: async (_query, _root, args) =>
        prisma.plaidItem.create({
          data: {
            institutionName: args.institutionName,
            accessToken: args.accessToken,
            itemId: args.itemId,
            user: {
              connect: {
                //TODO take user id from context
                id: 1,
              },
            },
          },
        }),
    }),
  }),
});

export const schema = builder.toSchema({});
