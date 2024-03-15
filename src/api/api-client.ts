import { Zodios, makeErrors } from '@zodios/core'
import { z } from "zod"

const errors = makeErrors([
  {
    status: "default",
    schema: z.object({
      error: z.object({
        code: z.number(),
        message: z.string(),
      }),
    }),
  },
]);

const user = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
});

const apiClient = new Zodios('/api', [
  {
    method: "get",
    path: "/users",
    alias: "getUsers",
    response: z.array(user),
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "getUser",
    response: user,
    errors,
  },
  {
    method: "post",
    path: "/users",
    alias: "createUser",
    parameters: [
      {
        name: "user",
        type: "Body",
        schema: user.omit({ id: true }),
      },
    ],
    response: user,
    errors,
  },  
  {
    method: "post",
    path: "/demandes-agrements",
    alias: "createEmptyDemandeAgrement",
    response: user.partial({ id: true }),
    errors,
  },  
]);

apiClient.getUsers()