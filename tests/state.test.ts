import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { SetupStep, readState, writeState, updateStep } from "../src/utils/state";

describe("state management", () => {
  const testDir = path.join(process.cwd(), "test-state-temp");
  const conductorDir = path.join(testDir, "conductor");
  const statePath = path.join(conductorDir, "setup_state.json");

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(conductorDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("readState", () => {
    it("should return null if state file doesn't exist", () => {
      const state = readState(testDir);
      expect(state).toBeNull();
    });

    it("should read state from file if it exists", () => {
      const mockState = {
        currentStep: SetupStep.PRODUCT,
        maturity: "greenfield" as const,
        completedSteps: [SetupStep.DISCOVERY],
        data: {},
      };
      fs.writeFileSync(statePath, JSON.stringify(mockState));

      const state = readState(testDir);
      expect(state).toEqual(mockState);
    });

    it("should return null if state file is invalid JSON", () => {
      fs.writeFileSync(statePath, "invalid json");
      const state = readState(testDir);
      expect(state).toBeNull();
    });
  });

  describe("writeState", () => {
    it("should write state to file", () => {
      const mockState = {
        currentStep: SetupStep.DISCOVERY,
        maturity: "brownfield" as const,
        completedSteps: [],
        data: { projectName: "Test" },
      };
      writeState(testDir, mockState as any);

      expect(fs.existsSync(statePath)).toBe(true);
      const savedState = JSON.parse(fs.readFileSync(statePath, "utf-8"));
      expect(savedState).toEqual(mockState);
    });

    it("should create conductor directory if it doesn't exist", () => {
      fs.rmSync(conductorDir, { recursive: true, force: true });
      const mockState = {
        currentStep: SetupStep.DISCOVERY,
        maturity: "brownfield" as const,
        completedSteps: [],
        data: { projectName: "Test" },
      };
      writeState(testDir, mockState as any);

      expect(fs.existsSync(conductorDir)).toBe(true);
      expect(fs.existsSync(statePath)).toBe(true);
    });
  });

  describe("updateStep", () => {
    it("should update current step and add to completedSteps", () => {
      const initialState = {
        currentStep: SetupStep.DISCOVERY,
        maturity: "greenfield" as const,
        completedSteps: [],
        data: {},
      };
      fs.writeFileSync(statePath, JSON.stringify(initialState));

      const updatedState = updateStep(testDir, SetupStep.PRODUCT);
      expect(updatedState.currentStep).toBe(SetupStep.PRODUCT);
      expect(updatedState.completedSteps).toContain(SetupStep.DISCOVERY);

      const savedState = JSON.parse(fs.readFileSync(statePath, "utf-8"));
      expect(savedState.currentStep).toBe(SetupStep.PRODUCT);
    });

    it("should not add to completedSteps if already present", () => {
        const initialState = {
          currentStep: SetupStep.PRODUCT,
          maturity: "greenfield" as const,
          completedSteps: [SetupStep.DISCOVERY],
          data: {},
        };
        fs.writeFileSync(statePath, JSON.stringify(initialState));
  
        const updatedState = updateStep(testDir, SetupStep.GUIDELINES);
        expect(updatedState.completedSteps).toEqual([SetupStep.DISCOVERY, SetupStep.PRODUCT]);
      });

    it("should throw error if state file doesn't exist", () => {
      fs.rmSync(statePath, { force: true });
      expect(() => updateStep(testDir, SetupStep.PRODUCT)).toThrow("Cannot update step: No existing setup state found.");
    });
  });
});
