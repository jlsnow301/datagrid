import { DataGrid } from "./datagrid";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

type Person = {
  name: string;
  age: number;
  job: string;
  location: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("age", {
    header: "Age",
  }),
  columnHelper.accessor("job", {
    header: "Job",
  }),
  columnHelper.accessor("location", {
    header: "Location",
  }),
];

const dummyData: Person[] = [
  {
    name: "JC Denton",
    age: 30,
    job: "Developer",
    location: "New York",
  },
  {
    name: "Anna Navarre",
    age: 25,
    job: "Coder",
    location: "Los Angeles",
  },
  {
    name: "Gunther Hermann",
    age: 34,
    job: "Programmer",
    location: "Seattle",
  },
  {
    name: "Walton Simons",
    age: 23,
    job: "Engineer",
    location: "Miami",
  },
  {
    name: "Adam Jensen",
    age: 29,
    job: "Wizard",
    location: "San Francisco",
  },
  {
    name: "David Sarif",
    age: 45,
    job: "CEO",
    location: "New York",
  },
  {
    name: "Faridah Malik",
    age: 28,
    job: "Manager",
    location: "Los Angeles",
  },
];

const THEMES = [
  {
    name: "dark",
    dark: true,
  },
  {
    name: "light",
    dark: false,
  },
  {
    name: "cupcake",
    dark: false,
  },
  {
    name: "cyberpunk",
    dark: false,
  },
  {
    name: "dracula",
    dark: true,
  },
  {
    name: "aqua",
    dark: true,
  },
  {
    name: "luxury",
    dark: true,
  },
] as const;

export function App() {
  const [theme, setTheme] = useState(0);

  function toggleTheme() {
    setTheme((theme) => (theme + 1) % THEMES.length);
  }

  return (
    <div
      className={classNames(
        THEMES[theme].dark && "dark",
        "h-screen w-screen flex flex-col bg-slate-900 justify-center items-center"
      )}
      data-theme={THEMES[theme].name}
    >
      <div className="h-1/2 w-3/4 space-y-2 overflow-hidden flex flex-col">
        <div className="flex justify-end gap-4 items-center text-white">
          {THEMES[theme].name}
          <button className="btn btn-primary" onClick={toggleTheme}>
            Toggle theme
          </button>
        </div>
        <DataGrid ascending columns={columns} data={dummyData} />
      </div>
    </div>
  );
}

/**
 * Joins css classes.
 * @example
 * classNames("foo", "bar") // => "foo bar"
 */
export function classNames(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(" ");
}
