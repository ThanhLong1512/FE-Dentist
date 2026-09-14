import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Search, X } from "lucide-react";

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 0;
  min-width: 14rem;
  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1.2rem;
  color: var(--color-grey-400);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    color: var(--color-grey-700);
    background: var(--color-grey-100);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 3.8rem;
  box-sizing: border-box;
  padding: 0.85rem 3.4rem 0.85rem 3.8rem;
  font-size: 1.35rem;
  color: var(--color-grey-800);
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: var(--color-grey-400);
  }

  &:hover {
    border-color: var(--color-grey-400);
  }

  &:focus {
    background-color: var(--color-grey-0);
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }
`;

function SearchBar({
  placeholder = "Tìm kiếm...",
  searchKey = "search",
  debounceMs = 300,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get(searchKey) || "";
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  // Sync with URL param if it changes externally
  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  // Debounced search param update
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();
      const currentVal = searchParams.get(searchKey) || "";

      if (trimmed !== currentVal) {
        if (trimmed) {
          searchParams.set(searchKey, trimmed);
        } else {
          searchParams.delete(searchKey);
        }
        searchParams.set("page", "1");
        setSearchParams(searchParams);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, searchKey, debounceMs, searchParams, setSearchParams]);

  const handleClear = () => {
    setSearchTerm("");
    searchParams.delete(searchKey);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  return (
    <SearchContainer>
      <SearchIconWrapper>
        <Search size={16} />
      </SearchIconWrapper>

      <StyledInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <ClearButton type="button" onClick={handleClear} title="Xóa tìm kiếm">
          <X size={14} />
        </ClearButton>
      )}
    </SearchContainer>
  );
}

export default SearchBar;
