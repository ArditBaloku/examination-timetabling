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
