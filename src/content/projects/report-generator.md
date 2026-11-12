---
title: Report generator
summary: A modular Kotlin library and CLI that turns database queries, CSV files or in-memory data into TXT, HTML, PDF or Markdown reports, with formats loaded as plugins.
layer: data
stack: [Kotlin, Gradle, SPI]
context: Software Components course, RAF
repo: https://github.com/vidanstojic/Implementation-of-report-generation-components-Software-component
order: 20
---

- **Plugin architecture.** A reporting API defines the contract; each output format is a separate Gradle module discovered at runtime through Java's Service Provider Interface.
- **Formats.** Plain text with fixed-width columns, HTML and PDF with styling, and Markdown.
- **Calculations.** A separate component computes SUM, AVG, COUNT, MIN and MAX, derived columns from arithmetic between columns, and conditional summaries.
- **CLI.** Lists the available format plugins, connects to a database or reads a CSV, and builds a report from command-line options.
