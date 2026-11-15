---
title: Report generator
summary: A modular Kotlin library and CLI that turns database queries, CSV files or in-memory data into TXT, HTML, PDF or Markdown reports, with formats loaded as plugins.
layer: data
stack: [Kotlin, Gradle, SPI]
context: Software Components course, RAF
repo: https://github.com/vidanstojic/Implementation-of-report-generation-components-Software-component
gallery:
  - src: ../../assets/projects/report-generator-spi.svg
    alt: CLI and data sources feeding a reporting API that loads TXT, HTML and PDF, and Markdown implementations through SPI
    caption: Output formats are separate modules discovered at runtime.
order: 20
---

## Problem and goal

Generate structured reports from any tabular data, in several formats, without the core library knowing about any particular format.

## Architecture and technical decisions

- **Plugin architecture.** A reporting API defines the contract; each output format is a separate Gradle module discovered at runtime through Java's Service Provider Interface.
- **Formats.** Plain text with fixed-width columns, HTML and PDF with styling, and Markdown.
- **Data sources.** SQL queries against a database, CSV files, and in-memory lists and maps.

## Challenges and how they were solved

- **Calculations shared by every format.** A separate component computes SUM, AVG, COUNT, MIN and MAX, columns derived from arithmetic between other columns, and conditional summaries, so no format reimplements them.
- **Using it without writing code.** A CLI lists the available format plugins, connects to a database or reads a CSV, and builds a report from command-line options.
