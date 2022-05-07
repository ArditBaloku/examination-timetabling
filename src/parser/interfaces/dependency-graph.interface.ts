export type DependencyGraph = {
  [key: string]: {
    hard: string[];
    softPrimary: string[];
    softSecondary: string[];
  };
};
