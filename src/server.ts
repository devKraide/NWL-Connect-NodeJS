import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route";



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

app.listen(
  { port: 3333 }
).then(() => {
  console.log("HTTP Server is running on port: 3333");
});
