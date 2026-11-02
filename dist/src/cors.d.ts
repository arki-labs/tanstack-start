/**
 * The `cors` option of `tanstackStart()`: its source type and the schema boot checks it with.
 * Internal on purpose: `./dot` re-exports the type only, so no Zod type reaches the public API.
 */
import { z } from 'zod';
/** Checks a `CorsOptions` value at boot; `dot.test-d.ts` proves it accepts exactly that type. */
export declare const corsSchema: z.ZodReadonly<z.ZodObject<{
    origins: z.ZodReadonly<z.ZodArray<z.ZodString>>;
    extensions: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>>;
//# sourceMappingURL=cors.d.ts.map