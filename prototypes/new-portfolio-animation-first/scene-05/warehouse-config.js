// Synthetic gameplay values, not manufacturer guidance or observed reliability.
export const WAREHOUSE_DEFAULTS = {
  seed: 4162026, monthSeconds: 240, stepSeconds: .05,
  tileSeconds: .32, handlingSeconds: .6, pallets: 36,
  arrivalSeconds: 2.8, mechanics: 3, bays: 1, policy: 'after-job',
  minorRate: .0006, majorRate: .00015, opportunityHours: 10,
  wearPerHour: .00045, wearRisk: 2, overdueRisk: 2,
  initialCondition: .84, serviceRecovery: .14,
  maintenance: true, incidents: true,
  minor: {name: 'Minor fault', parts: 450000, wrench: 4, crew: 1, minimumHours: 2, recovery: .06},
  major: {name: 'Major repair', parts: 4500000, wrench: 24, crew: 2, minimumHours: 12, recovery: .24},
  bayLease: 2000000,
  component: {name: 'Worn drive component', parts: 1800000, wrench: 8, crew: 1, minimumHours: 8, recovery: 1}
};
