import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Select from "./Select";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 0;
  min-width: 14rem;
  width: 100%;
`;

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options[0]?.value || "";

  function handleFilterChange(e) {
    const nextVal = e.target.value;
    searchParams.set(filterField, nextVal);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <FilterContainer>
      <Select
        options={options}
        value={currentFilter}
        onChange={handleFilterChange}
        style={{
          width: "100%",
          padding: "0.85rem 3.2rem 0.85rem 1.2rem",
          fontSize: "1.35rem",
          height: "3.8rem",
        }}
      />
    </FilterContainer>
  );
}

export default Filter;
