import {
  Attestation,
  CredentialPayload,
  CredentialSchema,
  DidKey,
  LatestCredentialPayload,
  RefreshService,
  StatusList2021Entry
} from "../../types"
import { VERIFIABLE_CREDENTIAL_TYPE_NAME } from "../utils"
import { DEFAULT_CONTEXT } from "./common"

export class CredentialPayloadBuilder {
  _builder: Partial<LatestCredentialPayload> // TODO: type????

  constructor() {
    this._builder = Object.assign({
      "@context": DEFAULT_CONTEXT,
      type: VERIFIABLE_CREDENTIAL_TYPE_NAME
    })
  }

  type(type: string | string[]) {
    // append all types other than "Verifiable Credential", which we always include
    const credentialTypeArray = Array.isArray(type) ? type : [type]
    const filteredCredentialTypes = credentialTypeArray.filter(
      (t) => t !== VERIFIABLE_CREDENTIAL_TYPE_NAME
    )
    this._builder.type = [
      VERIFIABLE_CREDENTIAL_TYPE_NAME,
      ...filteredCredentialTypes
    ]
    return this
  }

  attestations(
    subjectDid: string | DidKey,
    attestation: Attestation | Attestation[]
  ) {
    const subjectDidString =
      typeof subjectDid === "string" ? subjectDid : subjectDid.subject
    // For attestations, preserve the array or object structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let attsns: any[] | any
    if (Array.isArray(attestation)) {
      attsns = attestation.map((att) => {
        return {
          id: subjectDidString,
          [att["type"].toString()]: att
        }
      })
    } else {
      attsns = {
        id: subjectDid,
        [attestation["type"].toString()]: attestation
      }
    }
    this._builder.credentialSubject = attsns
    return this
  }

  issuer(issuerDid: string) {
    this._builder.issuer = { id: issuerDid }
    return this
  }

  credentialSchema(credentialSchema?: CredentialSchema) {
    this._builder.credentialSchema = credentialSchema
    return this
  }

  // TOFIX: optional param??
  credentialStatus(credentialStatus?: StatusList2021Entry) {
    this._builder.credentialStatus = credentialStatus
    return this
  }

  refreshService(refreshService: RefreshService) {
    this._builder.refreshService = refreshService
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidence(evidence: any[]) {
    this._builder.evidence = evidence
    return this
  }

  issuanceDate(issuanceDate: Date | string) {
    this._builder.issuanceDate = issuanceDate
    return this
  }

  expirationDate(expirationDate: Date | string) {
    this._builder.expirationDate = expirationDate
    return this
  }

  build(): LatestCredentialPayload {
    if (!this._builder.issuanceDate) {
      this._builder.issuanceDate = new Date()
    }
    return this._builder as LatestCredentialPayload
  }
}