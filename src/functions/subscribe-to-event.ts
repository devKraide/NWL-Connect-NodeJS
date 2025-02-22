import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/tables/subscriptions'
import { redis } from '../redis/client'

interface SubscribeToEventParams {
  name: string
  email: string
  referredId?: string | null
}

export async function subscribeToEvent({
  name,
  email,
  referredId,
}: SubscribeToEventParams) {
  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscribers.length > 0) {
    return { subscriberId: subscribers[0].id }
  }

  const result = await db
    .insert(subscriptions)
    .values({
      name,
      email,
    })
    .returning()

  if(referredId) {
    await redis.zincrby('referrals:ranking', 1, referredId)
  }

  const subscriber = result[0]

  return {
    subscriberId: subscriber.id,
  }
}
