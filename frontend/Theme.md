
## Table of Contents

1.  Overview
2.  Design Philosophy
3.  Technology Stack
4.  Color System Architecture
5.  Theme Modes
6.  Implementation Details
7.  Component Usage
8.  File Structure
9.  Customization Guide
10. Accessibility Guidelines
11. Performance Notes
12. Best Practices
13. Future Enhancements

------------------------------------------------------------------------

## 1. Overview

India Government Theme is a formal, high-contrast
design system inspired by official Indian government portals.

This theme emphasizes:

-   🇮🇳 Saffron (Orange) primary branding
-   ⚪ Pure white backgrounds
-   ⚫ Black text for maximum readability
-   🟢 Optional flag-green accents
-   ♿ Accessibility-first contrast

The goal is to create a professional, official, and trustworthy
interface.

------------------------------------------------------------------------

## 2. Design Philosophy

Core Principles:

-   High contrast (Black on White)
-   Minimal visual effects
-   Structured layouts
-   Strong borders
-   No gradients or glass effects
-   Government-formal appearance
-   WCAG-compliant accessibility

------------------------------------------------------------------------

## 3. Technology Stack

-   next
-   next-themes
-   tailwindcss v4
-   react

------------------------------------------------------------------------

## 4. Color System Architecture

All colors use HSL format stored as CSS variables.

Example:

--primary: 32 100% 50%;

Wrapped inside Tailwind via:

--color-primary: hsl(var(--primary));

------------------------------------------------------------------------

## 5. Theme Modes

### ☀️ Light Mode (Default -- Official Government Look)

``` css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;

  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;

  --primary: 32 100% 50%;
  --primary-foreground: 0 0% 0%;
  --primary-hover: 32 100% 45%;

  --secondary: 0 0% 95%;
  --secondary-foreground: 0 0% 0%;

  --border: 0 0% 85%;
  --input: 0 0% 95%;
  --ring: 32 100% 50%;

  --success: 120 60% 35%;
  --success-foreground: 0 0% 100%;

  --destructive: 0 70% 45%;
  --destructive-foreground: 0 0% 100%;

  --warning: 45 100% 50%;
  --warning-foreground: 0 0% 0%;

  --sidebar: 0 0% 100%;
  --sidebar-foreground: 0 0% 0%;
  --sidebar-border: 0 0% 85%;
  --sidebar-accent: 32 100% 95%;
  --sidebar-primary: 32 100% 50%;
  --sidebar-primary-foreground: 0 0% 0%;
}
```

### 🌙 Dark Mode

``` css
.dark {
  --background: 0 0% 8%;
  --foreground: 0 0% 95%;

  --card: 0 0% 12%;
  --card-foreground: 0 0% 95%;

  --primary: 32 100% 50%;
  --primary-foreground: 0 0% 0%;
  --primary-hover: 32 100% 45%;

  --secondary: 0 0% 20%;
  --secondary-foreground: 0 0% 95%;

  --border: 0 0% 25%;
  --input: 0 0% 20%;
  --ring: 32 100% 50%;

  --sidebar: 0 0% 10%;
  --sidebar-foreground: 0 0% 95%;
  --sidebar-border: 0 0% 25%;
  --sidebar-accent: 32 100% 15%;
  --sidebar-primary: 32 100% 50%;
  --sidebar-primary-foreground: 0 0% 0%;
}
```

------------------------------------------------------------------------

## 6. Implementation Details

Tailwind Mapping:

``` css
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-border: hsl(var(--border));
}
```

Theme Provider Setup:

``` tsx
<ThemeProvider
  attribute="class"
  defaultTheme="light"
  enableSystem
>
  {children}
</ThemeProvider>
```

------------------------------------------------------------------------

## 7. Component Usage

Primary Button:

``` tsx
<button className="bg-primary text-primary-foreground hover:bg-primary-hover border border-border">
  Submit Application
</button>
```

Card:

``` tsx
<div className="bg-card text-card-foreground border border-border p-4">
  Content
</div>
```

------------------------------------------------------------------------

## 8. File Structure

app/ layout.tsx globals.css

components/ theme/ theme-provider.tsx theme-toggle.tsx sideNavBar.tsx

------------------------------------------------------------------------

## 9. Accessibility Guidelines

-   Black text on white background
-   Orange always paired with black text
-   Minimum contrast ratio: 4.5:1
-   Visible focus rings
-   Full keyboard navigation support

------------------------------------------------------------------------

## 10. Best Practices

Do: - Use semantic tokens - Maintain structured layouts - Keep borders
visible

Avoid: - Gradients - Neon colors - Hardcoded Tailwind colors -
Low-contrast text

------------------------------------------------------------------------

## 11. Conclusion

This India Government theme ensures:

-   Authority
-   Clarity
-   Accessibility
-   Formal presentation
-   High contrast readability

------------------------------------------------------------------------

Document Version: 1.0 Last Updated: February 2026
