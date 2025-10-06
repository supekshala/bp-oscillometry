// Simulates oscillometric signal from a BP cuff
// The signal shows pressure oscillations as the cuff deflates

export interface SignalDataPoint {
  time: number;
  pressure: number;
  oscillation: number;
}

export class OscillometricSignalGenerator {
  private time: number = 0;
  private baselinePressure: number = 180; // Starting cuff pressure
  private deflationRate: number = 3; // mmHg per second
  private systolic: number = 120;
  private diastolic: number = 80;
  private heartRate: number = 72; // BPM
  
  constructor(systolic: number = 120, diastolic: number = 80, heartRate: number = 72) {
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.heartRate = heartRate;
  }

  // Generate the next data point
  getNextPoint(): SignalDataPoint {
    this.time += 0.1; // 100ms intervals
    
    // Cuff pressure decreases linearly
    this.baselinePressure -= this.deflationRate * 0.1;
    
    // Calculate oscillation amplitude based on current pressure
    const oscillationAmplitude = this.calculateOscillation(this.baselinePressure);
    
    // Add heartbeat oscillations (sine wave based on heart rate)
    const heartbeatFrequency = this.heartRate / 60; // Hz
    const oscillation = oscillationAmplitude * Math.sin(2 * Math.PI * heartbeatFrequency * this.time);
    
    return {
      time: this.time,
      pressure: this.baselinePressure + oscillation,
      oscillation: oscillationAmplitude,
    };
  }

  // Calculate oscillation amplitude based on cuff pressure
  // Oscillations are maximum around mean arterial pressure (MAP)
  private calculateOscillation(pressure: number): number {
    const map = this.diastolic + (this.systolic - this.diastolic) / 3;
    
    // Gaussian-like curve centered at MAP
    const sigma = 20; // Width of the curve
    const maxAmplitude = 8; // Maximum oscillation amplitude
    
    if (pressure < this.diastolic - 20 || pressure > this.systolic + 40) {
      return 0.5; // Minimal oscillations outside the range
    }
    
    const amplitude = maxAmplitude * Math.exp(-Math.pow(pressure - map, 2) / (2 * sigma * sigma));
    return Math.max(0.5, amplitude);
  }

  reset(systolic?: number, diastolic?: number, heartRate?: number) {
    this.time = 0;
    this.baselinePressure = 180;
    if (systolic) this.systolic = systolic;
    if (diastolic) this.diastolic = diastolic;
    if (heartRate) this.heartRate = heartRate;
  }

  isComplete(): boolean {
    return this.baselinePressure < 60; // Stop when pressure drops below 60 mmHg
  }
}
