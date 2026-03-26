import { describe, it, expect } from "vitest";
import * as templates from "../src/artifacts/templates.js";

describe("Import Templates Test", () => {
    it("should just import templates", () => {
        expect(templates).toBeDefined();
    });
});
