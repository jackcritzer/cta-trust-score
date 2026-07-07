# CTA Trust Score

A transit reliability engine that combines scheduled service and live train arrivals to estimate route reliability and generate explainable departure recommendations.

## Motivation

Transit schedules don't always reflect what riders experience in real time. This project explores how scheduled service, live arrival data, and service alerts can be combined to answer a practical question:

> **How much should I trust my route right now?**

Instead of simply reporting arrival times, the system evaluates current service conditions and explains whether riders should expect normal, degraded, or unreliable service.

## Features

- Loads and processes GTFS schedule data
- Identifies active trips based on service calendars
- Retrieves live CTA arrival predictions
- Incorporates active service alerts
- Compares scheduled and observed headways
- Generates explainable trust scores and departure recommendations

## Tech Stack

- TypeScript
- Node.js
- GTFS static transit data
- CTA Train Tracker API
- Vitest

## Example Output

```text
Route: Blue Line
Expected headway: 6 min
Observed headway: 9 min

Trust Score: Moderate
Recommendation: Leave 5 minutes earlier than usual.
```

## What I Learned

This project gave me hands-on experience designing a backend decision engine that combines multiple external data sources into a single recommendation. It involved working with large datasets, modeling transit operations, designing algorithms, and producing outputs that are both useful and explainable.

## Future Improvements

- Probability-based arrival predictions
- Historical reliability analysis
- Support for additional transit systems
- Web interface and visualizations
- Interactive route planning
