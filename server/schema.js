import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';

import employeeQuery from './schemas/employee/query.graphql';
import companyQuery from './schemas/company/query.graphql';

import employeeMutation from './schemas/employee/mutation.graphql';

import resolvers from './resolvers';

// console.log(includeTypes(employeeQuery, employeeMutation));
// turn type def in template string into executable schema object
const employeeSchema = makeExecutableSchema({
  typeDefs: [employeeQuery, employeeMutation]
});

const companySchema = makeExecutableSchema({
  typeDefs: [companyQuery]
});

const linkTypeDef = `
  extend type Company {
    employees: [Employee]
  }
`;

const schema = mergeSchemas({
  schemas: [employeeSchema, companySchema, linkTypeDef],
  resolvers
});

export { schema };
