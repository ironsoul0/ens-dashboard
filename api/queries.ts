import { gql } from "@apollo/client";

export type TRegistrationFragment = {
  registrant: { id: string };
  expiryDate: number;
  registrationDate: number;
  domain: {
    name: string;
    resolvedAddress?: { id: string };
  };
};

export const CORE_REGISTRATION_FIELDS = gql`
  fragment CoreRegistrationFields on Registration {
    registrant {
      id
    }
    expiryDate
    registrationDate
    domain {
      name
      resolvedAddress {
        id
      }
    }
  }
`;

export const QUERY_BY_ENS_NAME = gql`
  ${CORE_REGISTRATION_FIELDS}

  query GetRegistrationByENS($name: String) {
    registrations(where: { domain_: { name: $name } }) {
      ...CoreRegistrationFields
    }
  }
`;

export const QUERY_BY_ETH_ADDRESS = gql`
  ${CORE_REGISTRATION_FIELDS}

  query GetRegistrationByENS($resolvedAddress: String) {
    registrations(where: { domain_: { resolvedAddress: $resolvedAddress } }) {
      ...CoreRegistrationFields
    }
  }
`;

export const QUERY_REGISTRATIONS = gql`
  ${CORE_REGISTRATION_FIELDS}

  query GetRegistrations($first: Int, $skip: Int) {
    registrations(
      orderBy: registrationDate
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      ...CoreRegistrationFields
    }
  }
`;
