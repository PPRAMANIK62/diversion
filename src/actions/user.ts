"use server";

import { db } from "@/server/db";
import { GeneratedContent, Subscriptions, Users } from "@/server/db/schema";
import { sendWelcomeEmail } from "@/utils/mailtrap";
import { desc, eq, sql } from "drizzle-orm";

/**
 * Updates user points by adding the specified amount
 * @param userId Stripe customer ID
 * @param points Number of points to add
 */
export async function updateUserPoints(userId: string, points: number) {
  if (!userId || typeof points !== "number") {
    return { success: false, data: null, error: "Invalid input parameters" };
  }

  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ points: sql`${Users.points} + ${points}` })
      .where(eq(Users.stripeCustomerId, userId))
      .returning()
      .execute();

    return updatedUser
      ? { success: true, data: updatedUser }
      : { success: false, data: null, error: "User not found" };
  } catch (error) {
    console.error("Error updating user points:", error);
    return {
      success: false,
      data: null,
      error: "Failed to update user points",
    };
  }
}

/**
 * Gets user points by Stripe customer ID
 * @param userId Stripe customer ID
 */
export async function getUserPoints(userId: string): Promise<number> {
  if (!userId) {
    console.error("Invalid userId provided");
    return 0;
  }

  try {
    const users = await db
      .select({
        points: Users.points,
        id: Users.id,
        email: Users.email,
      })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .execute();

    if (!users || users.length === 0) {
      console.log("No user found with stripeCustomerId:", userId);
      return 0;
    }

    return users[0]?.points ?? 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
}

/**
 * Creates or updates a subscription for a user
 */
export async function createOrUpdateSubscription(
  userId: string,
  stripeSubscriptionId: string,
  plan: string,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
) {
  if (!userId || !stripeSubscriptionId) {
    return { success: false, data: null, error: "Invalid input parameters" };
  }

  try {
    const [user] = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        data: null,
        error: `No user found with stripeCustomerId: ${userId}`,
      };
    }

    const [existingSubscription] = await db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1);

    const subscription = existingSubscription
      ? await db
          .update(Subscriptions)
          .set({
            plan,
            status,
            currentPeriodStart,
            currentPeriodEnd,
          })
          .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
          .returning()
          .execute()
      : await db
          .insert(Subscriptions)
          .values({
            userId: user.id,
            stripeSubscriptionId,
            plan,
            status,
            currentPeriodStart,
            currentPeriodEnd,
          })
          .returning()
          .execute();

    return {
      success: true,
      data: subscription[0],
    };
  } catch (error) {
    console.error("Error creating or updating subscription:", error);
    return {
      success: false,
      data: null,
      error: "Failed to create or update subscription",
    };
  }
}

/**
 * Saves generated content to the database
 */
export async function saveGeneratedContent(
  userId: string,
  content: string,
  prompt: string,
  contentType: string,
) {
  if (!userId || !content) {
    return { success: false, data: null, error: "Invalid input parameters" };
  }

  try {
    const [savedContent] = await db
      .insert(GeneratedContent)
      .values({
        userId: sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`,
        content,
        prompt,
        contentType,
      })
      .returning()
      .execute();

    return { success: true, data: savedContent };
  } catch (error) {
    console.error("Error saving generated content:", error);
    return {
      success: false,
      data: null,
      error: "Failed to save generated content",
    };
  }
}

/**
 * Gets user's generated content history
 */
export async function getGeneratedContentHistory(userId: string, limit = 10) {
  if (!userId) {
    console.error("Invalid userId provided");
    return [];
  }

  try {
    return await db
      .select({
        id: GeneratedContent.id,
        content: GeneratedContent.content,
        prompt: GeneratedContent.prompt,
        contentType: GeneratedContent.contentType,
        createdAt: GeneratedContent.createdAt,
      })
      .from(GeneratedContent)
      .where(
        eq(
          GeneratedContent.userId,
          sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`,
        ),
      )
      .orderBy(desc(GeneratedContent.createdAt))
      .limit(limit)
      .execute();
  } catch (error) {
    console.error("Error fetching generated content history:", error);
    return [];
  }
}

/**
 * Creates or updates a user record
 */
export async function createOrUpdateUser(
  clerkUserId: string,
  email: string,
  name: string,
) {
  if (!clerkUserId || !email || !name) {
    return { success: false, data: null, error: "Invalid input parameters" };
  }

  try {
    const [existingUser] = await db
      .select()
      .from(Users)
      .where(eq(Users.stripeCustomerId, clerkUserId))
      .limit(1)
      .execute();

    if (existingUser) {
      const [updatedUser] = await db
        .update(Users)
        .set({ name, email })
        .where(eq(Users.stripeCustomerId, clerkUserId))
        .returning()
        .execute();

      return { success: true, data: updatedUser };
    }

    const [userWithEmail] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)
      .execute();

    if (userWithEmail) {
      const [updatedUser] = await db
        .update(Users)
        .set({ name, stripeCustomerId: clerkUserId })
        .where(eq(Users.email, email))
        .returning()
        .execute();

      await sendWelcomeEmail(email, name);
      return { success: true, data: updatedUser };
    }

    const [newUser] = await db
      .insert(Users)
      .values({ email, name, stripeCustomerId: clerkUserId, points: 50 })
      .returning()
      .execute();

    await sendWelcomeEmail(email, name);
    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return {
      success: false,
      data: null,
      error: "Failed to create or update user",
    };
  }
}
