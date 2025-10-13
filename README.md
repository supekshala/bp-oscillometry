# Hybrid Oscillometric–Phonocardiogram (PCG) Blood Pressure Algorithm — Technical Report

**Authors:** 
- Kavindu Hettiarachchi, RMIT University 
  - kavindu.hettiarachchi@rmit.edu.au
- Dewdini Gunarathna, Faculty of Medical Sciences, USJ
  - dewdinigunrathna@gmail.com

**Date:** 12 October 2025

---

## Executive Summary

This report analyses the feasibility, design, implementation, validation and regulatory implications of building a hybrid cuff-based non‑invasive blood pressure (NIBP) system that augments oscillometric measurements with simultaneous heart‑sound (phonocardiogram, PCG) capture. It evaluates signal processing approaches, motion‑artifact mitigation, candidate algorithms, hardware and software choices (with emphasis on memory-safe Rust), and a path for clinical validation and regulatory compliance.

### Key Conclusions

- Oscillometry reliably estimates MAP but uses population‑based heuristics to infer systolic and diastolic values; adding direct heart‑sound timing (PCG) during cuff deflation can potentially improve estimation of systolic (Korotkoff equivalent) timing and help disambiguate artifacts.
- Feasible signal processing pipeline: synchronized sampling (pressure transducer + high‑SNR PCG mic), denoising (bandpass + wavelet or adaptive filtering), beat detection, envelope extraction, and fusion rules that combine oscillation amplitude curve + PCG-derived event timings to infer SBP/DBP.
- Memory‑safe languages such as Rust provide strong benefits (zero‑cost abstractions, borrow checker preventing many classes of memory bugs) for embedded medical‑device firmware; critical, safety‑critical modules and sensor drivers are strong candidates for Rust. High‑performance components can remain in C when necessary, with careful interfacing.
- Python is excellent for prototyping, signal analysis, and ML model training but is generally unsuitable for production embedded firmware — C/C++ or Rust are preferred for time‑deterministic, resource‑constrained code.
- Regulatory obligations (ISO 81060‑2, IEC 62304, FDA software guidances) require clinical validation, software life‑cycle documentation, risk management, and traceability of requirements to tests.

---

## 1. Background & Motivation

Automatic oscillometric BP monitors detect cuff pressure oscillations as the cuff deflates and identify MAP at maximum oscillation amplitude. SBP/DBP are then estimated by applying ratio thresholds or algorithmic heuristics against that oscillation amplitude curve. This indirect approach leads to errors in special populations, with motion artifacts, and when arterial properties differ from the populations used to tune proprietary algorithms. Auscultatory (Korotkoff sound) detection, used by clinicians, directly observes acoustic events tied to SBP/DBP but is operator‑dependent and requires a stethoscope.

A hybrid approach — capturing PCG (heart sounds) at the brachial artery concurrently with oscillometry — aims to add direct cardiac/arterial acoustic information to the oscillation‑based estimation. Potential benefits include better timing of systolic onset, differentiation between true heart‑beat oscillations and motion artifacts, and an additional input to machine learning or model‑based estimators.

---

## 2. Evidence & Prior Art

There exist published works and datasets exploring PCG‑based BP estimation and combined approaches. Research has shown both promise and limitations: PCG features can correlate with blood pressure or be used in cuffless approaches (e.g., pulse transit time methods), but cuff‑based hybrid systems are less prevalent in commercial practice and require careful synchronization and validation.

(References and datasets consulted during preparation are listed in the bibliography section.)

---

## 3. System Concept & Block Diagram

### High‑Level Blocks

1. **Cuff + inflation/deflation control** (standard NIBP hardware)
2. **Pressure transducer** (high resolution, sampled at e.g. 500–2000 Hz)
3. **Acoustic sensor** (PCG microphone or accelerometer placed over brachial artery); preamp with anti‑alias filter; sampled at e.g. 2–8 kHz depending on hardware
4. **ADC + synchronized timestamping** (shared clock) to enable time alignment
5. **Embedded processor** (real‑time capable MCU/SoC)
6. **Signal processing + sensor fusion software**
7. **UI and data storage / connectivity**

### Why Synchronization Matters

PCG event timing relative to cuff pressure and oscillation peaks is essential. If sampling clocks drift or are unsynchronized, fusion rules break down.

---

## 4. Signal Processing & Algorithm Design

### 4.1 Acquisition Recommendations

- **Pressure transducer:** sample ≥ 500 Hz; use differential measurement; good SNR for low amplitude oscillations.
- **PCG sensor:** use contact microphone or accelerometer for robustness to ambient noise; sample 2–8 kHz; pre‑filter 20–400 Hz bandpass as primary heart‑sound band, but capture up to 1 kHz for higher harmonics.
- **Simultaneous timestamping** with a single clock domain (hardware timer/ADC trigger) is highly recommended.

### 4.2 Preprocessing

- DC removal and anti‑alias filtering.
- Motion detection using high‑frequency energy or accelerometer; flag segments with motion.
- Adaptive noise reduction: wavelet denoising or spectral subtraction for PCG; high‑pass + low‑pass cascade for oscillation signal to isolate beat‑to‑beat oscillations.

### 4.3 Feature Extraction

- **Oscillometric envelope:** compute oscillation amplitude vs cuff pressure (envelope smoothing, peak detection). Identify MAP at envelope maximum.
- **PCG beat detection:** envelope detection (e.g., Hilbert transform) or energy‑based beat detectors; identify first heart sound (S1) and timing of each beat relative to cuff pressure.
- **Cross‑correlate** oscillation events with PCG beats to confirm true cardiac origin vs artifact.

### 4.4 Fusion Strategies (Examples)

1. **Rule‑based fusion:** If PCG indicates heartbeat presence at cuff pressure near where oscillation amplitude rises (first correlated beats), label that pressure as SBP (analogous to Korotkoff first sound). For DBP, use correlates of disappearance of sound or reach of oscillation amplitude ratios.

2. **Probabilistic estimator:** Build a Bayesian model where oscillation amplitude, PCG presence, motion flag, and cuff pressure feed into a likelihood model for SBP/DBP.

3. **ML model:** Train a model (random forest / gradient boosting / small CNN) on synchronized features (oscillation amplitude curve sections, PCG-derived features, motion metrics) with ground‑truth auscultatory/reference cuff readings.

**Notes:** ML models require high‑quality labeled datasets collected across varied populations to avoid bias and overfitting.

### 4.5 Motion Artifact Handling

- Strongly reject or down‑weight measurements with simultaneous motion detected by accelerometer and inconsistent PCG/oscillation alignment.
- Use median filtering across multiple inflation/deflation cycles or repeated measurements to increase robustness.

---

## 5. Hardware Considerations & Sensor Choices

- Use contact microphone or accelerometer for PCG capture: contact sensors reduce ambient noise and improve SNR.
- ADC dynamic range: must capture small cuff oscillations and higher amplitude pressure changes without clipping.
- Power and size tradeoffs: higher sampling rates increase power; choose an MCU with DMA and dedicated timers for deterministic capture.

---

## 6. Software Engineering & Language Choice

### 6.1 Rust — Pros and Cons

#### Pros

- Memory safety guarantees (compile‑time borrow checker) that prevent use‑after‑free, many buffer overflows, and common concurrency bugs — highly valuable in safety‑critical medical firmware.
- Zero‑cost abstractions and good performance comparable to C/C++.
- Growing ecosystem for embedded (e.g., `no_std`, embedded-hal), and crates for DSP/FFT exist though less mature than C libraries.

#### Cons / Challenges

- Smaller ecosystem for medical device‑specific libraries compared to C/C++.
- Toolchain and certification processes in some regulated environments are still more established for C/C++.
- Need to plan FFI to reuse proven C signal‑processing libraries where needed.

### 6.2 C / C++

Widely used and supported in embedded, many proven DSP libraries and medical device codebases exist. However, memory and concurrency bugs are a real hazard unless mitigated by rigorous processes and static analysis.

### 6.3 Python

Excellent for prototyping, offline signal processing, ML model training, and clinical data analysis. Not recommended for embedded real‑time firmware except on high‑end devices running an OS where Python is permitted (and with strict validation).

### 6.4 Practical Recommendation

- **Prototype & model training:** Python (NumPy/SciPy, PyWavelets, scikit‑learn, PyTorch/TensorFlow).
- **Embedded production firmware:** Rust preferred for safety‑critical code (drivers, real‑time processing). Where ecosystem maturity requires, use vetted C libraries with careful FFI and encapsulate them behind safe Rust interfaces.
- **Desktop/cloud components:** Python or Rust depending on deployment needs.

---

## 7. Validation, Clinical Testing & Regulatory Pathway

- Follow ISO 81060‑2 for clinical validation of automated sphygmomanometers; validate across subject demographics and blood pressure ranges.
- Apply IEC 62304 for software life‑cycle and risk classification; prepare design history file, hazard analysis, and traceability.
- FDA guidance documents for device software functions and premarket submissions list required documentation; early engagement with regulators and a robust clinical plan is advised.
- Clinical validation must include reference auscultatory or invasive measurements as appropriate and demonstrate accuracy against accepted standards.

---

## 8. Risks, Limitations & Open Questions

- PCG in cuff environment may pick up cuff vibration and ambient noise — sensor choice and placement are critical.
- Proprietary oscillometry algorithms vary; combining PCG does not guarantee superiority without rigorous training and validation across populations (arrhythmias, arterial stiffness, pregnancy, pediatric cases).
- Data scarcity: need representative datasets with synchronized cuff pressure, PCG, and reference BP readings.

---

## 9. Development Plan (Phases)

1. **Literature & dataset review** — assemble PCG + cuff datasets; run feasibility tests in lab. (3–6 months)
2. **Prototype acquisition hardware** — build cuff + PCG sensor prototype with synchronized ADC. (1–3 months)
3. **Signal processing & prototype algorithm** — offline processing in Python, small ML experiments. (2–4 months)
4. **Embedded porting** — implement critical pipeline in Rust/C for real‑time on target MCU. (2–4 months)
5. **Preclinical testing** — bench tests, healthy volunteers, performance under motion. (3–6 months)
6. **Clinical validation & regulatory submission** — per ISO 81060‑2 and IEC 62304. (variable)

---

## 10. Bibliography

Studies / standards / guidance consulted:

- Frontiers review on oscillometric blood pressure measurement (oscillometry principles).
- Multiple academic papers on PCG‑based BP estimation and datasets (arXiv, ScienceDirect).
- ISO 81060‑2:2018 standard (clinical validation of automated sphygmomanometers).
- IEC 62304 software life‑cycle standard and FDA software guidance (premarket submissions).
- Embedded systems articles and industry writing on Rust benefits for safety‑critical embedded systems.
- Studies on motion artifact impacts on oscillometry.

---

## Appendix A — Example Fusion Pseudocode

High level pseudocode (for concept illustration only):

```python
# Acquire synchronized arrays
cuff_pressure[t], cuff_oscillation[t], pcg[t], accel[t]

# Preprocess
denoise(cuff_oscillation)
bandpass(pcg, 20, 400)
motion_flag = detect_motion(accel)

# Extract features
osc_envelope = envelope(cuff_oscillation)
map_idx = argmax(osc_envelope)

# Fusion loop
for each cuff_pressure window around map_idx:
    if motion_flag(window): 
        continue
    
    pcg_beats = detect_beats(pcg_window)
    correlation = align_oscillations_with_beats(osc_envelope_window, pcg_beats)
    
    if correlation strong:
        sbp_candidate = pressure_at_first_correlated_beat
        dbp_candidate = pressure_at_last_correlated_beat_or_ratio_rule

# Aggregate and return
aggregate candidates across windows and return median
```

---

## Closing Remarks

A hybrid oscillometric–PCG cuff system is technically feasible and could improve BP estimation in some scenarios, but success hinges on careful sensor design, robust motion artifact rejection, representative clinical datasets, and a rigorous regulatory validation plan. Using Rust for embedded firmware offers meaningful safety advantages and is a recommended option where the toolchain and certification plan allow it.

---

*End of report.*
