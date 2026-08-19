import Spinner from "../../components/admin/Spinner";
import PatientRow from "./PatientRow";
import { usePatients } from "./usePatients";
import Table from "../../components/admin/Table";
import Menus from "../../components/admin/Menus";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { PAGE_SIZE } from "../../utils/constants";
import styled from "styled-components";

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: inherit;
`;

function PatientTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { isLoading, patients } = usePatients({ q });

  if (isLoading) return <Spinner />;

  let filteredPatients;

  const filterValue = searchParams.get("gender") || "all";
  if (filterValue === "all") filteredPatients = patients;
  if (filterValue === "male")
    filteredPatients = patients.filter((patient) => patient.gender === true);
  if (filterValue === "female")
    filteredPatients = patients.filter((patient) => patient.gender === false);

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "yearOfBirth-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedPatients = filteredPatients?.sort((a, b) => {
    if (field === "name") {
      return a[field].localeCompare(b[field]) * modifier;
    } else {
      return (a[field] - b[field]) * modifier;
    }
  });

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPatients = sortedPatients.slice(startIndex, endIndex);
  return (
    <Menus>
      <div style={{ marginBottom: 12 }}>
        <SearchInput
          placeholder="Tìm theo tên/sđt/địa chỉ..."
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            if (!next) searchParams.delete("q");
            else searchParams.set("q", next);
            searchParams.set("page", "1");
            setSearchParams(searchParams);
          }}
        />
      </div>
      <Table columns="1fr 0.5fr 1fr 1fr 1fr 2fr">
        <Table.Header>
          <div>Patient</div>
          <div>Gender</div>
          <div>Year of Birth</div>
          <div>Phone</div>
          <div>Address</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedPatients}
          render={(patient) => (
            <PatientRow patient={patient} key={patient._id} />
          )}
        />
        <Table.Footer>
          <Pagination count={patients.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default PatientTable;
