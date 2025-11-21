# Invoice Generator Application - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles for healthcare/business productivity tool
**Rationale**: Information-dense CRUD application requiring consistency, clarity, and efficiency over visual flair

## Core Design Principles
- **Professional Medical Aesthetic**: Clean, trustworthy, clinical precision
- **Data-First Layout**: Prioritize readability and efficient data entry
- **Clear Hierarchy**: Distinguish between data display and input modes
- **Print Optimization**: Invoice output must be professional and printer-friendly

## Typography
- **Primary Font**: Inter or Roboto (Google Fonts) - excellent for data-heavy interfaces
- **Headings**: 
  - H1: 2xl (24px) - semibold - Page titles
  - H2: xl (20px) - semibold - Section headers
  - H3: lg (18px) - medium - Card titles
- **Body Text**: base (16px) - regular - Form labels, table content
- **Small Text**: sm (14px) - regular - Helper text, metadata
- **Monospace**: Use for invoice numbers, IDs, monetary values

## Layout System
**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6
- Card spacing: gap-6
- Section margins: mb-8
- Form field spacing: space-y-4

**Grid Structure**:
- Dashboard: 4-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) for metric cards
- Tables: Full-width responsive tables with horizontal scroll on mobile
- Forms: 2-column layout on desktop (grid-cols-1 md:grid-cols-2), single column mobile
- Invoice: Single column, max-width container for print compatibility

## Navigation Architecture
**Sidebar Navigation** (Desktop):
- Fixed left sidebar (w-64)
- Logo/brand at top
- Menu items with icons (Heroicons)
- Active state indication
- Collapsible on tablet

**Mobile Navigation**:
- Top header with hamburger menu
- Slide-out drawer navigation
- Bottom fixed action button for primary actions (e.g., "Create Invoice")

## Component Library

### Dashboard Cards
- Metric cards with icon, count, label
- Subtle border, no heavy shadows
- Icon in circle background
- Large number display (3xl font)

### Data Tables
- Striped rows for readability
- Sticky header on scroll
- Action buttons column (Edit/Delete icons)
- Pagination at bottom
- Search/filter bar above table
- Empty state with illustration placeholder

### Forms (CRUD Operations)
- Single-page modal overlays for Create/Edit
- Full-page forms for complex entries (Invoice creation)
- Grouped related fields
- Clear field labels above inputs
- Dropdown selects for categories, manufacturers, doctors, patients
- Input validation indicators (green checkmark/red error)
- Form actions: "Save" (primary button), "Cancel" (secondary button) aligned right

### Invoice Builder Interface
- **Left Panel**: Form inputs (Patient selection, Doctor selection, Date)
- **Center Panel**: Medicine addition interface
  - Searchable dropdown for medicine selection
  - Quantity input
  - Auto-calculated line total
  - "Add Medicine" button
  - List of added medicines with remove option
- **Right Panel/Bottom**: Live invoice preview or total summary card

### Printable Invoice Template
- A4 paper dimensions (210mm x 297mm equivalent)
- Header: Clinic/business name, logo placeholder, invoice number, date
- Billing info section: Patient details (left), Doctor details (right)
- Table: Medicine items with columns (Name, Category, Quantity, Price, Total)
- Footer: Subtotal, tax (if applicable), grand total
- Notes/terms section
- Print-only styling (@media print rules)

## Buttons & Actions
- **Primary Button**: Solid fill, medium rounded (rounded-md), px-6 py-2.5
- **Secondary Button**: Outline style, same sizing
- **Icon Buttons**: Square (40x40px), subtle hover background
- **Danger Actions**: Red accent for delete operations

## Input Fields
- Height: h-10 (40px)
- Border: 1px solid with focus ring
- Rounded: rounded-md
- Padding: px-3
- Dropdowns: Chevron icon right-aligned

## Icons
**Library**: Heroicons (via CDN)
- Navigation: outline style, 24px
- Actions: outline style, 20px  
- Metric cards: solid style, 32px

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2-column grids, collapsible sidebar)
- Desktop: > 1024px (full multi-column layouts, fixed sidebar)

## Print Styles
- Hide: Navigation, action buttons, edit controls
- Show: Only invoice content with proper page breaks
- Black text on white background
- Border styles optimized for print clarity

## Images
**No hero images required** - This is a business application
**Logo Placeholder**: 180x60px in header and invoice template
**Empty State Illustrations**: Simple line illustrations for empty tables/lists (can use placeholder comments)

## Key UX Patterns
- **Confirmation Modals**: For delete actions
- **Toast Notifications**: Success/error feedback (top-right corner)
- **Loading States**: Skeleton screens for data fetching
- **Autosave Indication**: For invoice drafts
- **Keyboard Shortcuts**: Enter to submit forms, Esc to close modals