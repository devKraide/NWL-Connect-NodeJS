import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { accessInviteLink } from '../functions/access-invite-link'
import { redis } from '../redis/client'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'Access invite link and redirects user to the subscribe page',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { subscriberId } = request.params

      await accessInviteLink({ subscriberId })

      const redirectUrl = new URL('http://localhost:3000/subscribe')

      redirectUrl.searchParams.set('referrer', subscriberId)

      //301 is a [permanent] redirect » it stocks the browser to cache the redirect, so it will not be updated if the user ( or other ) is redirected again.
      // 302 is a [temporary] redirect || to this application, 302 is the best option because we need to count the number of times some user has been redirected to the subscribe page using a referral link.
      return reply.redirect(redirectUrl.toString(), 302)
    }
  )
}
