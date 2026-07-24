# Workspace Rules: Antigravity Agent Configuration

## 1. Codebase Architecture
- **Web Target**: Vanilla JavaScript (ES6+), custom CSS variables, zero-dependency lightweight architecture. Focus on 100/100 Core Web Vitals (Zero CLS, low INP).
- **Native Target**: ArkTS / ArkUI (API Level 10+) using Navigation router and declarative syntax.

## 2. Artifact Requirements
- Before editing files, always produce an Implementation Plan detailing affected files.
- For web visual transitions, verify execution using GPU-accelerated properties (`opacity`, `transform`) only. Never animate `width`, `height`, or `margins`.
