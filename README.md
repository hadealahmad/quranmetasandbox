# 📖 Quran Meta Interactive Sandbox

A premium, high-fidelity, bilingual (Arabic & English) visual playground and metadata explorer designed to query, audit, and compare Quranic structural alignments across major Recitations (Riwayahs): **Hafs**, **Qalun**, and **Warsh**.

Built on top of the ultra-lightweight `quran-meta` engine, this sandbox features custom monochrome glassmorphic aesthetics, fluid micro-animations, and full RTL/LTR language toggling powered by the unified **Rubik** variable font family.

---

## ⚡ The Sandbox vs. The Original Library

This project is a dedicated interactive visual environment. Here is how it compares to the core database library:

| Dimension | 📦 `quran-meta` (Core Library) | 🎨 Quran Meta Sandbox |
| :--- | :--- | :--- |
| **Interface** | **Headless & Programmatic**: A lightweight package designed for programmatic integrations in TypeScript, JavaScript, and Node environments. | **Visual & Interactive**: A premium, responsive web interface styled with a monochromatic glassmorphic Shadcn theme, suitable for both desktop and mobile viewports. |
| **Visualization** | None. Returns raw coordinate arrays and objects (e.g. `[surah, ayah]`). | **Rich Layouts**: Offers multi-dimensional stats dashboards, responsive input controls, interactive cards, and a comparative alignment matrix. |
| **Recitation Comparison** | **Separate modules**: Requires manually importing and invoking engines (e.g., `quran-meta/hafs` vs `quran-meta/warsh`) individually in code. | **Unified Cross-Recitation Table**: Compares global statistics side-by-side, dynamically auditing column counts and automatically displaying glowing LED mismatch status indicators where differences occur. |
| **Interactive Querying** | Must be coded and executed in a console or script runner. | **Instant Multi-Mode Search**: 6 powerful search/lookup sliders and text fields (Surah/Ayah, Page, Juz, Manzil, Ruku, Absolute Ayah ID) with interactive selected cards. |
| **Code Generation** | None. | **Live Code Playground**: Generates clean, ready-to-use ESM imports and functions dynamically as you interact with the UI, complete with one-click clipboard copying. |

---

## ✨ Features

- **Double-Script Typography**: Fully unified typography system using the **Rubik** variable font family, offering pristine legibility for both Latin (English) and Arabic script layouts.
- **Unified Comparative Matrix**: Compare Hafs, Qalun, and Warsh statistics dynamically, checking Ayah, Surah, Page, Juz, Ruku, Manzil, Rub al-Hizb, and Sajdah counts.
- **Dynamic LED Difference Indicators**: Automatic, glowing pulse alerts that highlight differences between the three Recitations.
- **Bilingual Interface (العربية & English)**: Toggle translations instantly with full, responsive layout shifting (RTL ↔ LTR direction adjustment).
- **Interactive Closed Dropdowns**: Selecting a Surah transforms the selection field into a rich, detailed metadata card with Meccan/Medinan indicators, verse count, and calligraphy.
- **Monochrome Glassmorphic Theme**: Dark/Light mode selector styled in monochrome Shadcn preset `b3QvrJJs8`.

---

## 🚀 Getting Started

### Prerequisites

You must have [Bun](https://bun.sh) or [Node.js](https://nodejs.org) installed on your system.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd quranmetasandbox
   ```

2. Install the workspace dependencies:
   ```bash
   bun install
   # or npm install
   ```

3. Launch the local development server:
   ```bash
   bun run dev
   # or npm run dev
   ```

4. Build the optimized production bundle:
   ```bash
   bun run build
   # or npm run build
   ```

---

## 🤝 Credits & Acknowledgements

This sandbox is powered by the incredible core package:
- **Library Name**: `quran-meta`
- **Repository**: [github.com/quran-center/quran-meta](https://github.com/quran-center/quran-meta)
- **Authors**: Quran Center Team

We extend our sincere gratitude to the developers of `quran-meta` for compiling such a robust, precise, and lightweight engine containing standard coordinates for all major Recitations (Riwayahs).

---

## 📄 License

The code in this sandbox is open-source software licensed under the **MIT License**.

The underlying `quran-meta` library is licensed under its respective license.
