# Project Roadmap: bp-oscillometry

This document outlines the development plan for the `bp-oscillometry` project. The goal is to build an educational desktop application that demonstrates the oscillometric method for measuring blood pressure.

## Phase 1: Core Algorithm Implementation (Backend)

1.  **Define Data Structures**:
    *   Create Rust structs to represent cuff pressure data points (e.g., `CuffPressureSample { timestamp: u64, pressure: f32 }`).
    *   Define structs for oscillation envelopes and the final blood pressure results (e.g., `BloodPressureResult { sbp: f32, dbp: f32, map: f32 }`).

2.  **Implement Signal Processing Logic**:
    *   Develop a function to extract the oscillation envelope from the raw cuff pressure signal. This may involve filtering and peak detection.
    *   Implement the core algorithm to identify the Mean Arterial Pressure (MAP) from the peak of the oscillation envelope.

3.  **Implement SBP/DBP Calculation**:
    *   Implement the ratio-based method to calculate Systolic (SBP) and Diastolic (DBP) pressures based on the MAP.

4.  **Expose to Frontend**:
    *   Create a Tauri command (e.g., `calculate_bp`) that accepts cuff pressure data and returns the `BloodPressureResult`.

## Phase 2: Frontend UI Development

1.  **Basic Data Input**:
    *   Create a UI component to allow users to input or load sample cuff pressure data (e.g., from a CSV file or a text area).

2.  **Results Display**:
    *   Design and implement a component to display the calculated SBP, DBP, and MAP values clearly.

3.  **Data Visualization (Stretch Goal)**:
    *   Add a chart to visualize the cuff pressure deflation curve.
    *   Overlay the detected oscillation envelope on the same chart.
    *   Mark the points corresponding to SBP, DBP, and MAP on the chart.

## Phase 3: Refinement and Packaging

1.  **Testing**:
    *   Add unit tests for the Rust algorithm to ensure accuracy with known data sets.
    *   Perform end-to-end testing of the application.

2.  **Documentation**:
    *   Update `README.md` with instructions on how to use the application.
    *   Add code comments and documentation for the Rust backend.

3.  **Build and Release**:
    *   Create installers for major operating systems (macOS, Windows, Linux) using Tauri's build process.
