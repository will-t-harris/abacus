import prisma from "../prismaClient.js";
import { DateResolver } from "graphql-scalars";
import { builder } from "./builder.js";
import {
  CreateAccountsInput,
  CreatePlaidItemInput,
  GetPlaidItemInput,
  GetPlaidItemsInput,
  GetUserInput,
} from "./inputs.js";
import PlaidService from "../services/Plaid.service.js";

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
    itemId: t.exposeString("itemId"),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});

builder.prismaObject("Account", {
  name: "Account",
  findUnique: (account) => ({ id: account.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});

builder.queryType({
  fields: (t) => ({
    getUser: t.prismaField({
      type: "User",
      args: {
        input: t.arg({ type: GetUserInput, required: true }),
      },
      resolve: async (query, _root, { input }) => {
        const user = await prisma.user.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { email: input.email },
        });

        return user;
      },
    }),

    getPlaidItem: t.prismaField({
      type: "PlaidItem",
      args: {
        input: t.arg({ type: GetPlaidItemInput, required: true }),
      },
      resolve: async (query, _root, { input }) => {
        const plaidItem = await prisma.plaidItem.findUnique({
          ...query,
          rejectOnNotFound: true,
          where: { id: input.id },
        });

        return plaidItem;
      },
    }),

    getPlaidItems: t.prismaField({
      type: ["PlaidItem"],
      args: {
        input: t.arg({ type: GetPlaidItemsInput, required: true }),
      },
      resolve: async (query, _root, { input }) => {
        const plaidItems = await prisma.plaidItem.findMany({
          ...query,
          where: { userId: input.userId },
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
        input: t.arg({ type: CreatePlaidItemInput, required: true }),
      },
      resolve: async (_query, _root, { input }) => {
        const plaidItem = await prisma.plaidItem.create({
          data: {
            institutionName: input.institutionName,
            accessToken: input.accessToken,
            itemId: input.itemId,
            user: {
              connect: {
                //TODO take user id from context
                id: 1,
              },
            },
          },
        });

        return plaidItem;
      },
    }),

    createAccounts: t.prismaField({
      type: ["Account"],
      args: {
        input: t.arg({ type: CreateAccountsInput, required: true }),
      },
      resolve: async (_query, _root, { input }) => {
        const plaidItem = await prisma.plaidItem.findFirst({
          rejectOnNotFound: true,
          //TODO take user id from context
          where: { userId: 1, institutionName: input.institutionName },
        });

        const accounts = await PlaidService.getAccountsForItem({
          accessToken: plaidItem.accessToken,
        });

        return await prisma.$transaction(
          accounts.map((account) =>
            prisma.account.create({
              data: {
                name: account.name,
                type: account.type,
                accountId: account.account_id,
                plaidItem: {
                  connect: {
                    id: plaidItem.id,
                  },
                },
              },
            })
          )
        );
      },
    }),
  }),
});

export const schema = builder.toSchema({});
