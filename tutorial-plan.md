# Tutorial Plan: In-Context Tooltips and Hints for Progression System

## Objective

Design and implement a minimum viable tutorial flow that explains the AN-AW-GL progression system using in-context tooltips and hints.

## Approach

Utilize Approach 3: In-Context Tooltips and Hints for its simplicity, elegance, and adherence to KISS and DRY principles.

## Confidence Level

8/10 - Reasonably confident in this approach as a good starting point, but effectiveness depends on implementation details.

## Plan

1.  **Test-Driven Development (TDD):**

    - **Define Test Cases:** Create unit tests for the tutorial framework and hint display logic. Tests should cover:
      - Hint sequence progression.
      - Hint content display.
      - Hint triggering based on game events (e.g., puzzle completion).
      - Interactive element functionality within hints.
    - **Implement Test Framework:** Set up a basic framework for managing tutorial steps and displaying hints.

2.  **Step Sequence Framework:**

    - **Data Structure:** Define a simple data structure (e.g., JSON or TypeScript objects) to represent the tutorial step sequence. Each step will include:
      - Target UI element (CSS selector or component reference).
      - Hint text explaining the concept (AN, AW, or GL).
      - Optional interactive element (e.g., a button to simulate AW earning).
      - Trigger event (e.g., component mount, button click).
    - **Logic:** Implement logic to progress through the step sequence, display hints, and handle interactive elements.

3.  **Design Screens Explaining AN-AW-GL Progression (Content Design):**

    - **Concise Text:** Write clear and concise text for each hint, explaining AN, AW, and GL in simple terms.
    - **Visuals (Optional):** Consider using simple icons or diagrams within tooltips to visually represent AN, AW, and GL.
    - **AW Earning Demo:** Design a simple interactive element (e.g., a button labeled "Complete Puzzle") within the AW hint to demonstrate AW earning. Clicking the button would simulate puzzle completion and visually update the player's AW in the UI (and tooltip).

4.  **Implement Interactive Elements to Demonstrate Earning AW:**
    - **AW Simulation:** Implement the logic to simulate AW earning when the interactive element in the AW hint is activated. This might involve temporarily increasing the player's AW and displaying the updated value.

## Plan Diagram (Mermaid)

```mermaid
graph LR
    A[Start: Architect Mode] --> B{Information Gathering: Review Milestone Summaries};
    B --> C{Approach Evaluation: KISS & DRY};
    C --> D[Choose Approach 3: In-Context Tooltips/Hints];
    D --> E{Plan Development (TDD)};
    E --> F[1. Test-Driven Development];
    F --> G[2. Step Sequence Framework];
    G --> H[3. Design Hint Content (AN-AW-GL)];
    H --> I[4. Implement AW Earning Demo];
    I --> J{Plan Review with User};
    J -- User Approves --> K[Switch to Code Mode];
    J -- User Rejects/Changes --> C;
    K --> L[Code Mode: Implement Tutorial];
    L --> M[End: Code Mode];

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
    style E fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#ccf,stroke:#333,stroke-width:2px
```
