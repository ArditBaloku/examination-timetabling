# examination-timetabling

## Setup

Make sure to have Node version 16 installed. Navigate to the root directory and run

`npm install`

Run the code using

`npm start <algorithm> <instance>`

For example `npm start hs D1-1-16` will run instance `D1-1-16` using Harmony Search

Algorithm options:

- hs - Harmony Search
- sa - Simulated Annealing
- mt - Memetic Algorithm (mix of HS and SA)

## Code structure

```
├── instances               # Problem instances
└── src                     # Main code
    ├── app                 # App setup and common interfaces
    ├── instance-container  # Loads and parses instance
    ├── metaheuristics      # Common metaheuristic functions
    ├── harmony-search      # Harmony Search algorithm
    ├── simulated-annealing # Simulated Annealing algorithm
    └── memetic             # Memetic algorithm
```

## Benchmarks

Benchmarks were run using an AMD Ryzen 5 5500U (12 CPUs) @2.1GHz and 16 GB of RAM. Each instance was ran 5 times for 3 minutes.

| Instance | Harmony Search      | Simulated Annealing | Memetic Algorithm   |
| -------- | ------------------- | ------------------- | ------------------- |
|          | **Min / Max / Avg** | **Min / Max / Avg** | **Min / Max / Avg** |
| D1-1-16  | -                   | -                   | 97 / 105 / 101.8    |
| D1-1-17  | -                   | -                   | 80 / 85 / 82.2      |
| D1-2-16  | -                   | -                   | 260 / 269 / 264.6   |
| D1-2-17  | -                   | -                   | 299 / 313 / 309     |
| D1-3-16  | -                   | -                   | 292 / 307 / 300.4   |
| D1-3-17  | -                   | -                   | 271 / 285 / 276.4   |
| D1-3-18  | -                   | -                   | 28 / 40 / 33.8      |
| D2-1-18  | -                   | -                   | 20 / 25 / 22        |
| D2-2-18  | -                   | -                   | 5 / 7 / 5.8         |
| D2-3-18  | -                   | -                   | 0 / 3 / 1.4         |
| D3-1-16  | -                   | -                   | 0 / 0 / 0           |
| D3-1-17  | -                   | -                   | 0 / 0 / 0           |
| D3-1-18  | -                   | -                   | 0 / 0 / 0           |
| D3-2-16  | -                   | -                   | 0 / 0 / 0           |
| D3-2-17  | -                   | -                   | 0 / 0 / 0           |
| D3-2-18  | -                   | -                   | 0 / 0 / 0           |
| D3-3-16  | -                   | -                   | 0 / 0 / 0           |
| D3-3-17  | -                   | -                   | 0 / 0 / 0           |
| D3-3-18  | -                   | -                   | 0 / 0 / 0           |
| D4-1-17  | -                   | -                   | 8 / 10 / 8.8        |
| D4-1-18  | -                   | -                   | 57 / 63 / 61.2      |
| D4-2-17  | -                   | -                   | 77 / 87 / 80.8      |
| D4-2-18  | -                   | -                   | 153 / 165 / 159.8   |
| D4-3-17  | -                   | -                   | 176 / 197 / 186.2   |
| D4-3-18  | -                   | -                   | 369 / 390 / 382.4   |
| D5-1-17  | -                   | -                   | 0 / 0 / 0           |
| D5-1-18  | -                   | -                   | 0 / 0 / 0           |
| D5-2-17  | -                   | -                   | 0 / 0 / 0           |
| D5-2-18  | -                   | -                   | 0 / 2 / 0.8         |
| D5-3-18  | -                   | -                   | 0 / 0 / 0           |
| D6-1-16  | -                   | -                   | 18 / 31 / 22.8      |
| D6-1-17  | -                   | -                   | 18 / 25 / 21.2      |
| D6-1-18  | -                   | -                   | 15 / 22 / 17.6      |
| D6-2-16  | -                   | -                   | 44 / 50 / 46.6      |
| D6-2-17  | -                   | -                   | 45 / 55 / 50        |
| D6-2-18  | -                   | -                   | 20 / 26 / 24        |
| D6-3-16  | -                   | -                   | 0 / 0 / 0           |
| D6-3-17  | -                   | -                   | 0 / 0 / 0           |
| D7-1-17  | -                   | -                   | 0 / 1 / 0.6         |
| D7-2-17  | -                   | -                   | 0 / 3 / 1.8         |
