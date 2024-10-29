import { sparqlEscapeUri, uuid } from "mu";
import { querySudo as query, updateSudo as update } from "@lblod/mu-auth-sudo";
import {
  DEFAULT_GRAPH,
  PUBLIC_GRAPH,
} from "../constants";
const connectionOptions = {
  mayRetry: true,
};
export async function getTombstoneUuid(sub) {
  const queryStr = `
    
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX as: <https://www.w3.org/ns/activitystreams#>
    SELECT  ?uuid  WHERE {
      graph <${DEFAULT_GRAPH}> {
        ?job a as:Tombstone; 
            mu:uuid ?uuid.
    }}`;
  const response = await query(queryStr, {}, connectionOptions);
  if (response?.results?.bindings?.length) {
    return response.results.bindings[0].uuid.value;
  }
  return uuid();
}
export const askByType = async (sub) => {
  const res = await query(
    `
          ask where {
            graph ?g {
                ${sparqlEscapeUri(sub)} a ?type.
                FILTER (?g in (<${DEFAULT_GRAPH}>, <${PUBLIC_GRAPH}>))
              }
            }
    `,
    {},
    connectionOptions,
  );
  return res.boolean;
};

export const makeTombstone = async (sub, rdfType) => {
  const id = await getTombstoneUuid(sub);
  await update(`
    PREFIX as: <https://www.w3.org/ns/activitystreams#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>

    INSERT DATA {
        graph <${DEFAULT_GRAPH}> {
          ${sparqlEscapeUri(sub)} a as:Tombstone ;
              mu:uuid "${id}";
              as:formerType ${sparqlEscapeUri(rdfType)}.
        }
    }
`, {}, connectionOptions);
}
