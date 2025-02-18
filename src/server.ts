import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";
import { z } from "zod";
import { STATUS_CODES } from "http";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//regiter cors plugin and set origin of the frontend by second parameter
app.register(fastifyCors);
//true = possible to access from any origin => adequate for development 

app.post("/subscriptions", {
  schema: {
    body: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  },
}, (request, reply) => {
  const { name, email } = request.body

  return reply.status(201)
    .send({
      name,
      email
    })

})

app.listen(
  { port: 3333 }
).then(() => {
  console.log("HTTP Server is running on port: 3333");
});
