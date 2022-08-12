import { nonNull, objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    // t.field("createdAt", { type: nonNull("date") });
    // t.field("updatedAt", { type: nonNull("date") });
    t.field("email", { type: nonNull("string") });
    t.string("name");
    t.field("password", { type: nonNull("string") });
    //TODO add PlaidItem relation
  },
});
