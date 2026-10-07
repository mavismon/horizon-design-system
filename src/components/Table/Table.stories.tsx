// Figma: https://www.figma.com/design/dIHHqSq8c75n4olME0s9JS/Core-Component?node-id=57-1652
// Component (table): node 250:92, 1172 wide. Specimen board: node 251:168 (table | Hover + selected |
// tag tones | _table-cell | _table-row). Usage frame: node 251:353.
// Figma properties: ShowFooter, Summary; rows are _table-row (state default | hover | selected) made of
// _table-cell (type header | primary | text | tag | action | checkbox); tag tone success | neutral |
// error | warning | info; header cell ShowSort. Figma names map to the camelCase props showFooter,
// summary, and the data props columns (header cells, cell types, sortable) and rows (cells, state, selected).
// Variant matrix: ShowFooter (true | false) x row state (default | hover | selected) x tag tone (5).
// No sizes. Composes Checkbox (checkbox column), Link (action cells) and Button (state outline, Previous / Next).
// Not Figma properties (added so the component is usable): selectable, sort, onSortChange,
// onSelectionChange, onPrevious, onNext, previousDisabled, nextDisabled, tableLabel, row ids, action hrefs.
// Figma draws no empty state, no loading state, no focus ring, no disabled Previous / Next, no header
// checkbox state beyond unchecked, no narrow-screen layout and no sorted-descending arrow.
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, DEFAULT_COLUMNS, DEFAULT_ROWS } from "./Table";
import type { TableRowData, TableSort, TableTone } from "./Table";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import samplephoto from "../../assets/images/avatar-sample.jpg";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  decorators: [
    (Story) => (
      <div style={{ width: 1172 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Specimen: table (node 250:92).
export const Default: Story = {};
export const WithoutFooter: Story = { args: { showFooter: false } };
export const WithoutCheckboxColumn: Story = { args: { selectable: false } };

// Specimen: Hover + selected (node 251:171). Row 2 hover, rows 3 and 4 selected.
export const HoverAndSelected: Story = {
  args: {
    rows: DEFAULT_ROWS.map((row) => ({
      ...row,
      state: row.id === "sao-joao" ? ("hover" as const) : ("default" as const),
      selected: row.id === "september-shoulder" || row.id === "web-summit",
    })),
  },
};

// Specimen: tag tones (node 251:350), one row per tone.
const TONES: Array<[TableTone, string]> = [
  ["success", "Live"],
  ["neutral", "Draft"],
  ["error", "Expired"],
  ["warning", "Expiring soon"],
  ["info", "Upcoming"],
];
export const TagTones: Story = {
  args: {
    showFooter: false,
    rows: TONES.map(([tone, label]) => ({
      id: tone,
      cells: {
        season: `Tag tone ${tone}`,
        dates: "1 Jul to 31 Aug 2026",
        appliesTo: "All room types",
        change: "+28%",
        status: { label, tone },
        actions: "Edit",
      },
    })),
  },
};

export const SortedAscending: Story = {
  args: { sort: { key: "season", direction: "ascending" } },
};

export const LongText: Story = {
  args: {
    rows: [
      {
        id: "long",
        cells: {
          season: "Summer peak season for every property in the Casa do Bairro group",
          dates: "1 Jul to 31 Aug 2026 and the first week of September",
          appliesTo: "All room types, including suites and the garden annex",
          change: "+28%",
          status: { label: "Expiring soon", tone: "warning" },
          actions: ["Resend", "Revoke"],
        },
      },
    ],
    summary: "Showing 1 to 1 of 1 seasons",
  },
};

// Not drawn in Figma: first and last page.
export const PreviousDisabled: Story = { args: { previousDisabled: true } };
export const NextDisabled: Story = { args: { nextDisabled: true } };

// Real interaction: tick rows and the header checkbox, click the sort header, click Previous / Next.
// Every control is native (input, button, a), so Tab, Space and Enter work with no extra script.
export const Interactive: Story = {
  render: (args) => {
    const [sort, setSort] = useState<TableSort>({ key: "season", direction: "ascending" });
    const [page, setPage] = useState(1);
    const [selectedCount, setSelectedCount] = useState(0);
    const rows: TableRowData[] = [...DEFAULT_ROWS]
      .sort((a, b) => {
        const left = String(a.cells[sort.key]);
        const right = String(b.cells[sort.key]);
        return sort.direction === "ascending" ? left.localeCompare(right) : right.localeCompare(left);
      })
      .map((row) => ({ ...row, cells: { ...row.cells, actions: { label: "Edit", href: `#${row.id}` } } }));
    return (
      <div onClick={(event) => (event.target as HTMLElement).closest("a") && event.preventDefault()}>
        <Table
          {...args}
          columns={DEFAULT_COLUMNS}
          rows={rows}
          sort={sort}
          onSortChange={setSort}
          onSelectionChange={(ids) => setSelectedCount(ids.length)}
          previousDisabled={page === 1}
          nextDisabled={page === 2}
          onPrevious={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          summary={`Page ${page} of 2, ${selectedCount} selected`}
        />
      </div>
    );
  },
};

// Back office page: SideBar on the left, Header type=backoffice to its right, the table under it.
export const BackOfficePage: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: "flex", width: 1440, height: 1000 }}>
        <SideBar />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Header type="backoffice" pageTitle="Rates" avatarSrc={samplephoto} />
          <div style={{ padding: 24 }}>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};
