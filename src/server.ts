import { fastifyCors } from "@fastify/cors";
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import { fastify } from "fastify";
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import {env} from "./env";
import { accessInviteLinkRoute } from "./routes/access-invite-link-route";
import { getSubscribersInviteClicksRoute } from "./routes/get-subscribers-invite-clicks-route";
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route";
import { getSubscriberInvitesCount } from "./functions/get-subscriber-invites-count";
import { getSubscribersInvitesCountRoute } from "./routes/get-subscriber-invites-count-route";
import { getSubscribersRankingPositionRoute } from "./routes/get-subscriber-ranking-position-route";
import { getRankingRoute } from "./routes/get-ranking-route";



const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//regiter cors plugin and set origin of the frontend by second parameter
app.register(fastifyCors);
//true = possible to access from any origin => adequate for development 

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NLW Connect',
      version: '0.0.1'
    }
  },
  transform : jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {

    routePrefix: '/docs'
}
)

app.register(subscribeToEventRoute);
app.register(accessInviteLinkRoute);
app.register(getSubscribersInviteClicksRoute);
app.register(getSubscribersInvitesCountRoute);
app.register(getSubscribersRankingPositionRoute);
app.register(getRankingRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log("HTTP Server is running on port: 3333");
});
