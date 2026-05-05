import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    return await ctx.db.insert("tasks", { text, isCompleted: false });
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) return;
    await ctx.db.patch(id, { isCompleted: !task.isCompleted });
  },
});
