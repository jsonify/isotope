# UI Components Implementation Plan

**Objective:** Build essential UI components (Button, ThemeProvider, Periodic Table) with minimum viable functionality using Test-Driven Development (TDD) by selectively importing and adapting components from the `ui-prototype`.

**Components to Implement:**

1.  **Button:** Import from `ui-prototype/components/ui/button.tsx`.
2.  **ThemeProvider:** Import from `ui-prototype/components/theme-provider.tsx`.
3.  **Periodic Table:** Import from `ui-prototype/components/mini-periodic-table.tsx` (rename to `PeriodicTable.tsx` in our project).

**Implementation Approach:**

- **Test-Driven Development (TDD):** For each component, we will follow the TDD cycle:

  1.  Write tests first (define expected behavior and functionality).
  2.  Run tests (tests will initially fail).
  3.  Implement the component (make it pass the tests).
  4.  Refactor (improve code structure and quality while keeping tests passing).

- **Selective Import:** Import only the necessary components from the `ui-prototype` to keep the project focused and avoid unnecessary code.

- **Minimal Viable Functionality (MVP):** Focus on implementing the core functionality of each component first, ensuring it meets the basic requirements and passes the tests. Styling and advanced features can be added iteratively.

**Detailed Plan for Each Component:**

**1. Button Component:**

    *   **Tasks:**
        *   Copy `button.tsx` from `ui-prototype/components/ui` to `src/ui/components/Button.tsx`.
        *   Create `src/ui/components/__tests__/Button.test.tsx`.
        *   Write test cases for:
            *   Rendering with different variants (primary, secondary, etc.).
            *   Handling click events.
            *   Displaying children.
            *   Accessibility attributes.
        *   Implement the `Button` component to pass all tests.

**2. ThemeProvider Component:**

    *   **Tasks:**
        *   Copy `theme-provider.tsx` from `ui-prototype/components` to `src/ui/components/ThemeProvider.tsx`.
        *   Create `src/ui/components/__tests__/ThemeProvider.test.tsx`.
        *   Write test cases for:
            *   Providing a theme context.
            *   Enabling dark mode switching.
            *   Integration with Tailwind CSS theme.
        *   Implement the `ThemeProvider` component to pass all tests.

**3. Periodic Table Component:**

    *   **Tasks:**
        *   Copy `mini-periodic-table.tsx` from `ui-prototype/components` to `src/ui/components/PeriodicTable.tsx`.
        *   Create `src/ui/components/__tests__/PeriodicTable.test.tsx`.
        *   Write test cases for:
            *   Rendering basic grid structure.
            *   Displaying element data (symbol, name, row/column).
            *   State-based styling (completed, current, locked, upcoming).
            *   Interactivity: Links (if `path` prop is provided).
            *   Interactivity: Buttons (if `path` prop is not provided, `onElementClick` prop).
            *   Legend rendering.
        *   Implement the `PeriodicTable` component to pass all tests, ensuring minimal interactivity and a look similar to the provided image.

**Placement:**

- The `PeriodicTable` component will be placed in the center of the app UI for initial testing and viewing.

**Next Steps (After Plan Approval):**

1.  Switch to Code mode.
2.  Set up the test environment.
3.  Start implementing the `Button` component using TDD.
4.  Proceed with `ThemeProvider` and then `PeriodicTable` components, following the detailed plan.
