import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Select from "./Select";

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 0;
  min-width: 14rem;
  width: 100%;
`;

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || options[0]?.value || "";

  function handleSortChange(e) {
    searchParams.set("sortBy", e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <SortByContainer>
      <Select
        options={options}
        value={sortBy}
        onChange={handleSortChange}
        style={{
          width: "100%",
          padding: "0.85rem 3.2rem 0.85rem 1.2rem",
          fontSize: "1.35rem",
          height: "3.8rem",
        }}
      />
    </SortByContainer>
  );
}

export default SortBy;
