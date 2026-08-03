# CTA Trust Score

A TypeScript decision engine that combines scheduled service, live train arrivals, and active service alerts to estimate CTA route reliability and generate explainable departure recommendations.

## The question it answers

Transit schedules describe what should happen. Riders need to know what is happening now.

CTA Trust Score evaluates multiple operational signals to answer:

> **How much should I trust my route right now?**

Rather than returning only an arrival time, the engine explains whether service appears normal, degraded, or unreliable and recommends how much extra time a rider should allow.

## How it works

```text
GTFS schedule data ─┐
Live CTA arrivals ──┼─> normalize and compare signals ─> trust score ─> recommendation
Service alerts ─────┘
```

The engine:

1. Loads CTA GTFS schedule data and service calendars.
2. Determines which scheduled trips are active.
3. Retrieves current Train Tracker predictions and service alerts.
4. Compares scheduled and observed service conditions.
5. Produces an explainable reliability assessment.

## Features

- GTFS schedule ingestion and processing
- Active-service calculation using calendar data
- CTA Train Tracker API integration
- Service-alert integration
- Scheduled-versus-observed headway comparison
- Deterministic trust scores and departure recommendations
- Automated tests with Vitest

## Example output

```text
Route: Blue Line
Expected headway: 6 minutes
Observed headway: 9 minutes
Active alert: Signal problem near Clark/Lake

Trust score: Moderate
Recommendation: Leave 5 minutes earlier than usual.
Reason: Trains are arriving less frequently than scheduled and an active alert may cause additional delay.
```

## Tech stack

- TypeScript
- Node.js
- GTFS static transit data
- CTA Train Tracker API
- Vitest

## Local development

### Requirements

- Node.js 20+
- npm
- CTA Train Tracker API key

```bash
git clone https://github.com/jackcritzer/cta-trust-score.git
cd cta-trust-score
npm install
npm test
```

## Engineering focus

This project explores how to combine independent operational data sources into one useful and explainable conclusion. The main challenge is not fetching the data; it is defining how conflicting, delayed, or incomplete signals should affect the result without hiding the reasoning from the user.

## Current scope

The current implementation focuses on CTA rail service and deterministic recommendations. Historical reliability, probability-based predictions, route planning, and a web interface are outside the current scope.
