# bp-oscillometry

**Oscillometric Blood Pressure Algorithm**

`rust-oscillo` is a research and educational project that implements a **blood pressure measurement algorithm** in Rust using the **oscillometric method** — the same principle used by most automatic blood pressure monitors.

This project allows you to take **cuff pressure waveforms** (like the signal from an automated blood pressure cuff) and estimate:
- **Systolic Blood Pressure (SBP)** – the maximum pressure when your heart beats  
- **Diastolic Blood Pressure (DBP)** – the minimum pressure between beats  
- **Mean Arterial Pressure (MAP)** – the average pressure in your arteries

---

## How the Algorithm Works

We measure blood pressure indirectly using **oscillations in a cuff**. Here's a step-by-step explanation in simple terms:

1. **Inflate the cuff**  
   - The cuff tightens around your arm until blood flow stops.  

2. **Slowly deflate the cuff**  
   - As the cuff deflates, your blood starts to flow again, creating **tiny vibrations in the cuff pressure**.  
   - These vibrations are called **oscillations**.  

3. **Measure oscillations**  
   - The algorithm looks at the **height of each oscillation**.  
   - Oscillations start small, grow bigger, and then shrink as the cuff pressure drops.  

4. **Find the mean pressure (MAP)**  
   - The **largest oscillation** corresponds roughly to the average pressure in your arteries.  

5. **Estimate systolic and diastolic pressure**  
   - The algorithm looks at where the oscillation heights **start increasing** (systolic) and **start decreasing** (diastolic).  
   - Simple ratios of the maximum oscillation are used to calculate SBP and DBP.  

6. **Output the result**  
   - The algorithm returns your estimated **SBP, DBP, and MAP**.

---

## Why Rust?

- **Safe and fast:** Rust prevents common bugs and runs efficiently for real-time signal processing.  
- **Reusable:** Can later integrate with embedded devices or hospital systems.  
- **Educational:** Great for learning both signal processing and medical technology development.

---

## Getting Started

### Install Rust
Follow instructions at [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install).


