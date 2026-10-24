export interface WorldState {
  animus: {
    complexity: number;
    speed: number;
  };
  metaverse: {
    devices: any[];
  };
}

export const saveWorldState = (state: WorldState) => {
  localStorage.setItem('sovereign-world-state', JSON.stringify(state));
};

export const loadWorldState = (): WorldState | null => {
  const saved = localStorage.getItem('sovereign-world-state');
  return saved ? JSON.parse(saved) : null;
};
