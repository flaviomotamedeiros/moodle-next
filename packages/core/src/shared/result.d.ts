/** Explicit success/failure type — avoids throwing for expected domain errors. */
export type Result<T, E extends string = string> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
export declare const ok: <T>(value: T) => Result<T, never>;
export declare const fail: <E extends string>(error: E) => Result<never, E>;
//# sourceMappingURL=result.d.ts.map