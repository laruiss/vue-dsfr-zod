import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// We can now use `.openapi()` to specify OpenAPI metadata
z.string().openapi({ description: 'Some string' });