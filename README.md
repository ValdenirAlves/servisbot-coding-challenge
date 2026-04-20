# Welcome!
Thank you for taking the time to participate in this **fullstack** code challenge!

Feel free to fork this repo, or create your own repo and complete the task below.  

## Note
* You are free to use whatever technologies you wish to complete the task
* You are encouraged to handle the provided data sets in a way that is efficient, and that best meets the requirements of application features specified below.
* Build a RESTful API that that returns data (all read endpoints) - see data models specified below. You can use NodeJS and ExpressJS or similar
* You are **not** required to produce a production ready application, this is a chance to showcase your abilities - so do try show what you know!
* Comments or notes are more than welcome

## Introduction

Within this repo, you will find a **data** directory. This contains some dummy data that you can use within your application. Please take some time to familiarize yourself with this data structure, as it may impact your choices and application significantly.


### Bot Data Model

A Bot definition looks like this
```json
{
  "id": "04140c19-0c46-43c6-8e78-f459cd3b3370",       // Immutable Required UUID
  "name": "Bot One",                                  // Mutable Required String
  "description": "First Bot",                         // Mutable Optional String
  "status": "DISABLED",                               // Mutable Required String Enum ["DISABLED", "ENABLED", "PAUSED"]
  "created": 1713809849892                            // Immutable Required Epoch Timestamp
}
```

### Worker Data Model

A Worker definition looks like this
```json
{
  "id": "6f4fdfd9-da33-4711-9386-579e8101dc43",       // Immutable Required UUID
  "name": "Worker One",                               // Mutable Required String
  "description": "First Worker",                      // Mutable Optional String
  "bot": "Bot One",                                   // Mutable Required String - references a unique bot
  "created": 1713773401591                            // Immutable Required Epoch Timestamp
}
```

### Log Data Model

A Log definition looks like this
```json
{
  "id": "a3922ad6-49ed-4cf3-8293-cc4d58a5d4c9",        // Immutable Required UUID
  "created": "2024-04-22T14:14:14.926Z",               // Immutable Required ISO Timestamp
  "message": "Some Message",                           // Mutable Required String
  "bot": "44700aa2-cba6-43d2-9ad4-8d8a499bd356",       // Immutable Required UUID - references a unique bot
  "worker": "e5d7874c-fd2d-41b8-abc1-2e311964ae8c"     // Immutable Required UUID - references a unique worker
}
```

## Data Model Relationships (Cardinality)

The data relationship is as follows
* Bot 1:M Worker
* Bot 1:M Log
* Worker 1:M Log


## The Challenge!

Create an application that implements the following features
* View the list of bots
* View the list of workers for a bot
* View the list of logs for a bot
* View the list of logs for a worker associated with a bot

There are no wireframes or design considerations specified.
You are free to apply a UI/UX that delivers an intuitive application experience for the feature set above.


## Fullstack Bot Dashboard (20/04/2026)
## Tech Stack
- React + Vite
- Node.js + Express
- Vitest + React Testing Library

## Running locally

### Install dependencies
npm install

### Start backend
npm run server

API will run on:
http://localhost:3001

### Start frontend
npm run dev

App will run on:
http://localhost:5173

### Run tests
npm test

## Improvements & Decisions
## Architecture
- REST API using Node.js and Express to serve the application data
- Kept the frontend focused on presentation and interaction
- Used a service layer in the backend to isolate data access and relationship handling

## Async handling
- All data access is asynchronous, simulating real-world API behavior
- Implemented loading and error handling in the UI

### Data consistency
- Handled inconsistent relationships in the dataset:
  - Workers reference bots by name
  - Logs reference bots by ID
- Normalized relationships in the backend service layer without modifying the original dataset

### Performance
- Introduced in-memory indexing (lookup maps) to avoid repeated array scans
- Achieved constant-time lookups (O(1)) for data access

## UX improvements
- Added empty state handling for:
  - Bots with no workers
  - Bots with no logs
- This prevents empty screens and improves user feedback

### Testing
- Backend:
  - Tested core data aggregation logic in `dataService`
- Frontend:
  - Tested UI behavior and empty states in `BotDashboard`
- Focused on critical paths and edge cases

### Scalability considerations
- Current implementation uses in-memory data and indexing for simplicity
- In a production environment:
  - Data would be stored in a database with proper indexing
  - Relationships would be handled via queries or joins
  - API would support pagination, filtering, and caching

- The UI currently uses a native `<select>` for simplicity.
  - For larger datasets, a searchable dropdown (e.g., react-select) would improve usability

- Logs are currently rendered in a simple table.
  - For large datasets, this could lead to performance issues due to long lists.
  - In a production scenario, I would introduce pagination or list virtualization to avoid excessive rendering and improve performance.

## Notes
- The dataset was kept unchanged to respect the original contract
- Data normalization and relationship handling were implemented in the backend
- The solution prioritizes clarity, simplicity, and separation of concerns