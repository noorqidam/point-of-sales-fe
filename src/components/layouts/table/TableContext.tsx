import * as React from "react";

export enum TableAction {
  ACT_SEARCH = "ACT_SEARCH",
  ACT_LIMIT = "ACT_LIMIT",
  ACT_PAGE = "ACT_PAGE",
}

interface TableContextProps {
  children: React.ReactNode;
}

type FilterDispatchProps =
  | {
      type: "ACT_SEARCH";
      value: string;
    }
  | {
      type: "ACT_LIMIT";
      value: number;
    }
  | {
      type: "ACT_PAGE";
      value: number;
    };

export interface FilterParameters {
  search: string;
  limit: number;
  page: number;
}

export const initialFilterState: FilterParameters = {
  search: "",
  limit: 50,
  page: 1,
};

const FilterContext = React.createContext<{
  filter: FilterParameters;
  dispatchFilter: React.Dispatch<FilterDispatchProps>;
  isFilterChanged: boolean;
}>({
  filter: initialFilterState,
  dispatchFilter: () => {},
  isFilterChanged: false,
});

const filterReducer = (
  filter: FilterParameters,
  action: FilterDispatchProps
) => {
  switch (action.type) {
    case TableAction.ACT_SEARCH: {
      return {
        ...filter,
        search: action.value,
      };
    }

    case TableAction.ACT_LIMIT: {
      return {
        ...filter,
        limit: action.value,
      };
    }

    case TableAction.ACT_PAGE: {
      return {
        ...filter,
        page: action.value,
      };
    }

    default: {
      return filter;
    }
  }
};

export const TableContext: React.FC<TableContextProps> = ({ children }) => {
  const [filter, dispatchFilter] = React.useReducer(
    filterReducer,
    initialFilterState
  );

  const stringifiedFilter = JSON.stringify(filter);
  const stringifiedInitialFilter = JSON.stringify(initialFilterState);

  const isFilterChanged = stringifiedFilter !== stringifiedInitialFilter;

  return (
    <FilterContext.Provider value={{ filter, dispatchFilter, isFilterChanged }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => React.useContext(FilterContext);
