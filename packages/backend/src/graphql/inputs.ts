import { builder } from "./builder.js";

export const GetUserInput = builder.inputType("GetUserInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

export const GetPlaidItemInput = builder.inputType("GetPlaidItemInput", {
  fields: (t) => ({
    id: t.int({ required: true }),
  }),
});

export const GetPlaidItemsInput = builder.inputType("GetPlaidItemsInput", {
  fields: (t) => ({
    userId: t.int({ required: true }),
  }),
});

export const CreatePlaidItemInput = builder.inputType("CreatePlaidItemInput", {
  fields: (t) => ({
    institutionName: t.string({ required: true }),
    accessToken: t.string({ required: true }),
    itemId: t.string({ required: true }),
  }),
});

export const CreateAccountsInput = builder.inputType("CreateAccountsInput", {
  fields: (t) => ({
    institutionName: t.string({ required: true }),
  }),
});

export const FetchTransactionsForAccountInput = builder.inputType(
  "FetchTransactionsForAccountInput",
  {
    fields: (t) => ({
      accountId: t.string({ required: true }),
    }),
  }
);
