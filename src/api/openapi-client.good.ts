import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const createProut_Body = z
  .object({
    name: z.string(),
    age: z.number().gte(18),
    email: z.string().email(),
  })
  .passthrough();

export const schemas = {
  createProut_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/users",
    alias: "getUsers",
    requestFormat: "json",
    response: z.array(
      z
        .object({
          id: z.number(),
          name: z.string(),
          age: z.number().gte(18),
          email: z.string().email(),
        })
        .passthrough()
    ),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z
          .object({
            error: z
              .object({ code: z.number(), message: z.string() })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/users",
    alias: "createProut",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: createProut_Body,
      },
    ],
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        age: z.number().gte(18),
        email: z.string().email(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z
          .object({
            error: z
              .object({ code: z.number(), message: z.string() })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "getUsersId",
    requestFormat: "json",
    response: z
      .object({
        id: z.number(),
        name: z.string(),
        age: z.number().gte(18),
        email: z.string().email(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z
          .object({
            error: z
              .object({ code: z.number(), message: z.string() })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
