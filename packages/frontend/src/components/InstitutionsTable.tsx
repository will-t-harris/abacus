import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { PlaidItem } from "../shared/types";

interface Props {
  institutions: PlaidItem[];
}

export function InstitutionsTable({ institutions }: Props) {
  return (
    <TableContainer width="600px">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Institution</Th>
            <Th>Updated At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {institutions.map(({ updatedAt, institutionName }, index) => (
            <Tr key={`${institutionName}-${index}`}>
              <Td>{institutionName}</Td>
              <Td>{updatedAt.toString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
