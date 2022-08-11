import { asNexusMethod, nonNull, objectType } from "nexus";
import { GraphQLDate } from "graphql-iso-date";

asNexusMethod(GraphQLDate as any, "date");

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.field("createdAt", { type: nonNull("date") });
    t.field("updatedAt", { type: nonNull("date") });
    t.field("email", { type: nonNull("string") });
    t.string("name");
    t.field("password", { type: nonNull("string") });
    //TODO add PlaidItem relation
  },
});
