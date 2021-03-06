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

| Instance | Harmony Search          | Simulated Annealing  | Memetic Algorithm   |
| -------- | ----------------------- | -------------------- | ------------------- |
|          | **Min / Max / Avg**     | **Min / Max / Avg**  | **Min / Max / Avg** |
| D1-1-16  | 8190 / 10203 / 9029.6   | 112 / 135 / 126.8    | 97 / 105 / 101.8    |
| D1-1-17  | 5181 / 5208 / 5193.6    | 104 / 111 / 108.8    | 80 / 85 / 82.2      |
| D1-2-16  | 11394 / 11498 / 11448.6 | 312 / 326 / 317      | 260 / 269 / 264.6   |
| D1-2-17  | 13434 / 14422 / 14022.6 | 342 / 351 / 346.6    | 299 / 313 / 309     |
| D1-3-16  | 13399 / 14407 / 13773.6 | 371 / 384 / 379      | 292 / 307 / 300.4   |
| D1-3-17  | 9388 / 12373 / 10239.6  | 319 / 328 / 323.4    | 271 / 285 / 276.4   |
| D1-3-18  | 6135 / 7121 / 6514.6    | 43 / 45 / 44         | 28 / 40 / 33.8      |
| D2-1-18  | 16 / 22 / 18.4          | 54 / 57 / 55         | 20 / 25 / 22        |
| D2-2-18  | 5 / 7 / 5.8             | 20 / 30 / 24         | 5 / 7 / 5.8         |
| D2-3-18  | 1 / 2 / 1.4             | 7 / 11 / 9.8         | 0 / 3 / 1.4         |
| D3-1-16  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-1-17  | 1 / 1 / 1               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-1-18  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-2-16  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-2-17  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-2-18  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-3-16  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-3-17  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D3-3-18  | 0 / 0 / 0               | 0 / 0 / 0            | 0 / 0 / 0           |
| D4-1-17  | 2075 / 4063 / 3284.4    | 13 / 17 / 14.4       | 8 / 10 / 8.8        |
| D4-1-18  | 5127 / 5131 / 5129      | 73 / 75 / 73.8       | 57 / 63 / 61.2      |
| D4-2-17  | 4136 / 5148 / 4728.6    | 82 / 111 / 93.2      | 77 / 87 / 80.8      |
| D4-2-18  | 6238 / 7231 / 6800      | 159 / 170 / 162      | 153 / 165 / 159.8   |
| D4-3-17  | 15328 / 18312 / 17412.4 | 299 / 2329 / 724     | 176 / 197 / 186.2   |
| D4-3-18  | 25484 / 25492 / 25487.6 | 2504 / 3493 / 2998.2 | 369 / 390 / 382.4   |
| D5-1-17  | 20 / 22 / 21            | 0 / 11 / 4           | 0 / 0 / 0           |
| D5-1-18  | 13 / 16 / 14.4          | 0 / 0 / 0            | 0 / 0 / 0           |
| D5-2-17  | 16 / 17 / 16.4          | 0 / 0 / 0            | 0 / 0 / 0           |
| D5-2-18  | 46 / 53 / 49.2          | 8 / 11 / 9           | 0 / 2 / 0.8         |
| D5-3-18  | 14000 / 17000 / 15800   | 2000 / 4000 / 3200   | 0 / 0 / 0           |
| D6-1-16  | 14114 / 16093 / 15286.8 | 88 / 123 / 92.4      | 18 / 31 / 22.8      |
| D6-1-17  | 11095 / 12105 / 11469.4 | 53 / 105 / 73        | 18 / 25 / 21.2      |
| D6-1-18  | 8074 / 9087 / 8651      | 41 / 45 / 42.6       | 15 / 22 / 17.6      |
| D6-2-16  | 11116 / 12121 / 11775.8 | 79 / 86 / 81         | 44 / 50 / 46.6      |
| D6-2-17  | 9128 / 11128 / 10104.8  | 59 / 115 / 86.4      | 45 / 55 / 50        |
| D6-2-18  | 7104 / 8090 / 7543.6    | 49 / 1115 / 272      | 20 / 26 / 24        |
| D6-3-16  | 15000 / 16000 / 15400   | 0 / 1000 / 600       | 0 / 0 / 0           |
| D6-3-17  | 19000 / 21000 / 20000   | 1000 / 4000 / 2300   | 0 / 0 / 0           |
| D7-1-17  | 2 / 3 / 2.4             | 14 / 17 / 15         | 0 / 1 / 0.6         |
| D7-2-17  | 2 / 4 / 3.2             | 15 / 20 / 18.6       | 0 / 3 / 1.8         |
