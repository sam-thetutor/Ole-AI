This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
bill-app/
  frontend/
    .stellar/
      contract-ids/
        billr_contract.json
    packages/
      billr_contract/
        src/
          index.ts
        .gitignore
        package.json
        README.md
        tsconfig.json
    public/
      vite.svg
    src/
      assets/
        react.svg
      components/
        ConnectWalletButton.tsx
        Header.tsx
      hooks/
        contractUtils.ts
        useContract.ts
      pages/
        create.tsx
        invoices.tsx
        welcome.tsx
      App.css
      App.tsx
      global.d.ts
      main.tsx
      types.ts
    .gitignore
    eslint.config.js
    index.html
    package.json
    README.md
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
contracts/
  bilrr/
    contracts/
      bilrr/
        src/
          lib.rs
        Cargo.toml
        Makefile
    src/
      lib/
        contracts/
          billr/
            src/
              index.ts
            .gitignore
            package.json
            README.md
            tsconfig.json
    .gitignore
    Cargo.toml
    README.md
.gitignore
package.json
```

# Files

## File: bill-app/frontend/.stellar/contract-ids/billr_contract.json
````json
{"ids":{"Test SDF Network ; September 2015":"CCAV5ZYL3LI6MB254CHHVB6B5JBLJ6RUBMYZT5RCBVS46MHS3L4CLIWD"}}
````

## File: bill-app/frontend/packages/billr_contract/src/index.ts
````typescript
import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCAV5ZYL3LI6MB254CHHVB6B5JBLJ6RUBMYZT5RCBVS46MHS3L4CLIWD",
  }
} as const

export type InvoiceStatus = {tag: "Draft", values: void} | {tag: "Sent", values: void} | {tag: "Acknowledged", values: void} | {tag: "Paid", values: void} | {tag: "Cancelled", values: void};


export interface Invoice {
  acknowledgment_note: Option<string>;
  amount: u64;
  created_at: u64;
  creator: string;
  invoice_id: string;
  last_updated: u64;
  metadata: Map<string, string>;
  paid_at: Option<u64>;
  recipient: string;
  status: InvoiceStatus;
}


export interface InvoiceCreatedEvent {
  amount: u64;
  creator: string;
  invoice_id: string;
  recipient: string;
}


export interface InvoiceSentEvent {
  creator: string;
  invoice_id: string;
  recipient: string;
}


export interface InvoicePaidEvent {
  amount: u64;
  creator: string;
  invoice_id: string;
  paid_at: u64;
  recipient: string;
}


export interface InvoiceAcknowledgedEvent {
  invoice_id: string;
  note: Option<string>;
  recipient: string;
}


export interface InvoiceCancelledEvent {
  creator: string;
  invoice_id: string;
}


export interface InvoiceUpdatedEvent {
  creator: string;
  invoice_id: string;
  updated_at: u64;
}

export type DataKey = {tag: "Invoice", values: readonly [string]} | {tag: "CreatorInvoices", values: readonly [string]} | {tag: "RecipientInvoices", values: readonly [string]} | {tag: "UsdcToken", values: void} | {tag: "Admin", values: void};

export const BillrError = {
  1: {message:"InvoiceNotFound"},
  2: {message:"InvoiceAlreadyExists"},
  3: {message:"Unauthorized"},
  4: {message:"InvalidStatus"},
  5: {message:"InvoiceAlreadyPaid"},
  6: {message:"PaymentFailed"},
  7: {message:"InvalidAmount"},
  8: {message:"InvalidToken"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract with USDC token address
   */
  initialize: ({admin, usdc_token}: {admin: string, usdc_token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a new invoice in draft status
   */
  create_invoice: ({creator, invoice_id, recipient, amount, metadata}: {creator: string, invoice_id: string, recipient: string, amount: u64, metadata: Map<string, string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a send_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Send invoice
   */
  send_invoice: ({creator, invoice_id}: {creator: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a acknowledge_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Acknowledge invoice
   */
  acknowledge_invoice: ({recipient, invoice_id, note}: {recipient: string, invoice_id: string, note: Option<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pay_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay invoice with USDC
   */
  pay_invoice: ({recipient, invoice_id}: {recipient: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a cancel_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Cancel invoice
   */
  cancel_invoice: ({creator, invoice_id}: {creator: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a update_metadata transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update metadata
   */
  update_metadata: ({creator, invoice_id, metadata}: {creator: string, invoice_id: string, metadata: Map<string, string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a edit_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Edit invoice
   */
  edit_invoice: ({creator, invoice_id, recipient, amount, metadata}: {creator: string, invoice_id: string, recipient: Option<string>, amount: Option<u64>, metadata: Option<Map<string, string>>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get invoice by ID
   */
  get_invoice: ({invoice_id}: {invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Invoice>>>

  /**
   * Construct and simulate a list_by_creator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * List invoices by creator (IDs only)
   */
  list_by_creator: ({creator}: {creator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a list_by_recipient transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * List invoices by recipient (IDs only)
   */
  list_by_recipient: ({recipient}: {recipient: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a get_invoices_by_creator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get invoices by creator (full details) - FIXED NAME LENGTH
   */
  get_invoices_by_creator: ({creator}: {creator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a get_invoices_by_recipient transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get invoices by recipient (full details)
   */
  get_invoices_by_recipient: ({recipient}: {recipient: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a get_all_invoices_for_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all invoices for address
   */
  get_all_invoices_for_address: ({address}: {address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Map<string, Array<Invoice>>>>

  /**
   * Construct and simulate a get_pending_invoices transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get pending invoices
   */
  get_pending_invoices: ({address}: {address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Map<string, Array<Invoice>>>>

  /**
   * Construct and simulate a get_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get USDC token address
   */
  get_usdc_token: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a update_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update USDC token address (admin only)
   */
  update_usdc_token: ({admin, new_usdc_token}: {admin: string, new_usdc_token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUludm9pY2VTdGF0dXMAAAAAAAAFAAAAAAAAAAAAAAAFRHJhZnQAAAAAAAAAAAAAAAAAAARTZW50AAAAAAAAAAAAAAAMQWNrbm93bGVkZ2VkAAAAAAAAAAAAAAAEUGFpZAAAAAAAAAAAAAAACUNhbmNlbGxlZAAAAA==",
        "AAAAAQAAAAAAAAAAAAAAB0ludm9pY2UAAAAACgAAAAAAAAATYWNrbm93bGVkZ21lbnRfbm90ZQAAAAPoAAAAEAAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAADGxhc3RfdXBkYXRlZAAAAAYAAAAAAAAACG1ldGFkYXRhAAAD7AAAABAAAAAQAAAAAAAAAAdwYWlkX2F0AAAAA+gAAAAGAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAANSW52b2ljZVN0YXR1cwAAAA==",
        "AAAAAQAAAAAAAAAAAAAAE0ludm9pY2VDcmVhdGVkRXZlbnQAAAAABAAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEEludm9pY2VTZW50RXZlbnQAAAADAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEEludm9pY2VQYWlkRXZlbnQAAAAFAAAAAAAAAAZhbW91bnQAAAAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAHcGFpZF9hdAAAAAAGAAAAAAAAAAlyZWNpcGllbnQAAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAGEludm9pY2VBY2tub3dsZWRnZWRFdmVudAAAAAMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAABG5vdGUAAAPoAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFUludm9pY2VDYW5jZWxsZWRFdmVudAAAAAAAAAIAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAAE0ludm9pY2VVcGRhdGVkRXZlbnQAAAAAAwAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAAp1cGRhdGVkX2F0AAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAAB0ludm9pY2UAAAAAAQAAABAAAAABAAAAAAAAAA9DcmVhdG9ySW52b2ljZXMAAAAAAQAAABMAAAABAAAAAAAAABFSZWNpcGllbnRJbnZvaWNlcwAAAAAAAAEAAAATAAAAAAAAAAAAAAAJVXNkY1Rva2VuAAAAAAAAAAAAAAAAAAAFQWRtaW4AAAA=",
        "AAAABAAAAAAAAAAAAAAACkJpbGxyRXJyb3IAAAAAAAgAAAAAAAAAD0ludm9pY2VOb3RGb3VuZAAAAAABAAAAAAAAABRJbnZvaWNlQWxyZWFkeUV4aXN0cwAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAADUludmFsaWRTdGF0dXMAAAAAAAAEAAAAAAAAABJJbnZvaWNlQWxyZWFkeVBhaWQAAAAAAAUAAAAAAAAADVBheW1lbnRGYWlsZWQAAAAAAAAGAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAABwAAAAAAAAAMSW52YWxpZFRva2VuAAAACA==",
        "AAAAAAAAAC9Jbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIFVTREMgdG9rZW4gYWRkcmVzcwAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAp1c2RjX3Rva2VuAAAAAAATAAAAAA==",
        "AAAAAAAAACRDcmVhdGUgYSBuZXcgaW52b2ljZSBpbiBkcmFmdCBzdGF0dXMAAAAOY3JlYXRlX2ludm9pY2UAAAAAAAUAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAAhtZXRhZGF0YQAAA+wAAAAQAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==",
        "AAAAAAAAAAxTZW5kIGludm9pY2UAAAAMc2VuZF9pbnZvaWNlAAAAAgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAABNBY2tub3dsZWRnZSBpbnZvaWNlAAAAABNhY2tub3dsZWRnZV9pbnZvaWNlAAAAAAMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAABG5vdGUAAAPoAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==",
        "AAAAAAAAABVQYXkgaW52b2ljZSB3aXRoIFVTREMAAAAAAAALcGF5X2ludm9pY2UAAAAAAgAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==",
        "AAAAAAAAAA5DYW5jZWwgaW52b2ljZQAAAAAADmNhbmNlbF9pbnZvaWNlAAAAAAACAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAApCaWxsckVycm9yAAA=",
        "AAAAAAAAAA9VcGRhdGUgbWV0YWRhdGEAAAAAD3VwZGF0ZV9tZXRhZGF0YQAAAAADAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACG1ldGFkYXRhAAAD7AAAABAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAAAxFZGl0IGludm9pY2UAAAAMZWRpdF9pbnZvaWNlAAAABQAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAPoAAAAEwAAAAAAAAAGYW1vdW50AAAAAAPoAAAABgAAAAAAAAAIbWV0YWRhdGEAAAPoAAAD7AAAABAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAABFHZXQgaW52b2ljZSBieSBJRAAAAAAAAAtnZXRfaW52b2ljZQAAAAABAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+gAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAACNMaXN0IGludm9pY2VzIGJ5IGNyZWF0b3IgKElEcyBvbmx5KQAAAAAPbGlzdF9ieV9jcmVhdG9yAAAAAAEAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAEAAAPqAAAAEA==",
        "AAAAAAAAACVMaXN0IGludm9pY2VzIGJ5IHJlY2lwaWVudCAoSURzIG9ubHkpAAAAAAAAEWxpc3RfYnlfcmVjaXBpZW50AAAAAAAAAQAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAEAAAPqAAAAEA==",
        "AAAAAAAAADpHZXQgaW52b2ljZXMgYnkgY3JlYXRvciAoZnVsbCBkZXRhaWxzKSAtIEZJWEVEIE5BTUUgTEVOR1RIAAAAAAAXZ2V0X2ludm9pY2VzX2J5X2NyZWF0b3IAAAAAAQAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAQAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAAChHZXQgaW52b2ljZXMgYnkgcmVjaXBpZW50IChmdWxsIGRldGFpbHMpAAAAGWdldF9pbnZvaWNlc19ieV9yZWNpcGllbnQAAAAAAAABAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAQAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAABxHZXQgYWxsIGludm9pY2VzIGZvciBhZGRyZXNzAAAAHGdldF9hbGxfaW52b2ljZXNfZm9yX2FkZHJlc3MAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAD7AAAABAAAAPqAAAH0AAAAAdJbnZvaWNlAA==",
        "AAAAAAAAABRHZXQgcGVuZGluZyBpbnZvaWNlcwAAABRnZXRfcGVuZGluZ19pbnZvaWNlcwAAAAEAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAEAAAPsAAAAEAAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAABZHZXQgVVNEQyB0b2tlbiBhZGRyZXNzAAAAAAAOZ2V0X3VzZGNfdG9rZW4AAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAACZVcGRhdGUgVVNEQyB0b2tlbiBhZGRyZXNzIChhZG1pbiBvbmx5KQAAAAAAEXVwZGF0ZV91c2RjX3Rva2VuAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA5uZXdfdXNkY190b2tlbgAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_invoice: this.txFromJSON<Result<void>>,
        send_invoice: this.txFromJSON<Result<void>>,
        acknowledge_invoice: this.txFromJSON<Result<void>>,
        pay_invoice: this.txFromJSON<Result<void>>,
        cancel_invoice: this.txFromJSON<Result<void>>,
        update_metadata: this.txFromJSON<Result<void>>,
        edit_invoice: this.txFromJSON<Result<void>>,
        get_invoice: this.txFromJSON<Option<Invoice>>,
        list_by_creator: this.txFromJSON<Array<string>>,
        list_by_recipient: this.txFromJSON<Array<string>>,
        get_invoices_by_creator: this.txFromJSON<Array<Invoice>>,
        get_invoices_by_recipient: this.txFromJSON<Array<Invoice>>,
        get_all_invoices_for_address: this.txFromJSON<Map<string, Array<Invoice>>>,
        get_pending_invoices: this.txFromJSON<Map<string, Array<Invoice>>>,
        get_usdc_token: this.txFromJSON<Option<string>>,
        update_usdc_token: this.txFromJSON<Result<void>>
  }
}
````

## File: bill-app/frontend/packages/billr_contract/.gitignore
````
node_modules/
out/
````

## File: bill-app/frontend/packages/billr_contract/package.json
````json
{
  "version": "0.0.0",
  "name": "billr_contract",
  "type": "module",
  "exports": "./dist/index.js",
  "typings": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@stellar/stellar-sdk": "^13.x",
    "buffer": "6.0.3"
  },
  "devDependencies": {
    "typescript": "^5.6.2"
  }
}
````

## File: bill-app/frontend/packages/billr_contract/README.md
````markdown
# billr_contract JS

JS library for interacting with [Soroban](https://soroban.stellar.org/) smart contract `billr_contract` via Soroban RPC.

This library was automatically generated by Soroban CLI using a command similar to:

```bash
soroban contract bindings ts \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  --contract-id CCAV5ZYL3LI6MB254CHHVB6B5JBLJ6RUBMYZT5RCBVS46MHS3L4CLIWD \
  --output-dir ./path/to/billr_contract
```

The network passphrase and contract ID are exported from [index.ts](./src/index.ts) in the `networks` constant. If you are the one who generated this library and you know that this contract is also deployed to other networks, feel free to update `networks` with other valid options. This will help your contract consumers use this library more easily.

# To publish or not to publish

This library is suitable for publishing to NPM. You can publish it to NPM using the `npm publish` command.

But you don't need to publish this library to NPM to use it. You can add it to your project's `package.json` using a file path:

```json
"dependencies": {
  "billr_contract": "./path/to/this/folder"
}
```

However, we've actually encountered [frustration](https://github.com/stellar/soroban-example-dapp/pull/117#discussion_r1232873560) using local libraries with NPM in this way. Though it seems a bit messy, we suggest generating the library directly to your `node_modules` folder automatically after each install by using a `postinstall` script. We've had the least trouble with this approach. NPM will automatically remove what it sees as erroneous directories during the `install` step, and then regenerate them when it gets to your `postinstall` step, which will keep the library up-to-date with your contract.

```json
"scripts": {
  "postinstall": "soroban contract bindings ts --rpc-url https://soroban-testnet.stellar.org --network-passphrase \"Test SDF Network ; September 2015\" --id CCAV5ZYL3LI6MB254CHHVB6B5JBLJ6RUBMYZT5RCBVS46MHS3L4CLIWD --name billr_contract"
}
```

Obviously you need to adjust the above command based on the actual command you used to generate the library.

# Use it

Now that you have your library up-to-date and added to your project, you can import it in a file and see inline documentation for all of its exported methods:

```js
import { Contract, networks } from "billr_contract"

const contract = new Contract({
  ...networks.futurenet, // for example; check which networks this library exports
  rpcUrl: '...', // use your own, or find one for testing at https://soroban.stellar.org/docs/reference/rpc#public-rpc-providers
})

contract.|
```

As long as your editor is configured to show JavaScript/TypeScript documentation, you can pause your typing at that `|` to get a list of all exports and inline-documentation for each. It exports a separate [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function for each method in the smart contract, with documentation for each generated from the comments the contract's author included in the original source code.
````

## File: bill-app/frontend/packages/billr_contract/tsconfig.json
````json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */
    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */
    /* Language and Environment */
    "target": "ESNext", /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */
    /* Modules */
    "module": "NodeNext", /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "nodenext", /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */
    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */
    /* Emit */
    "declaration": true, /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./dist", /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */
    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    // "esModuleInterop": true, /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    // "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
    /* Type Checking */
    // "strict": true, /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    "strictNullChecks": true, /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */
    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "include": [
    "src/*"
  ]
}
````

## File: bill-app/frontend/public/vite.svg
````
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
````

## File: bill-app/frontend/src/assets/react.svg
````
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: bill-app/frontend/src/components/ConnectWalletButton.tsx
````typescript
import React, { useState } from 'react';
import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    FREIGHTER_ID,
  } from '@creit.tech/stellar-wallets-kit';
  
  const kit: StellarWalletsKit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,

    modules: allowAllModules(),
  });



const ConnectWalletButton: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { address } = await kit.getAddress();
      setAddress(address);
    } catch (e) {
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await kit.disconnect();
    setAddress(null);
  };

  if (address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className="text-gray-700 font-mono">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          onClick={handleDisconnect}
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
      onClick={handleConnect}
      disabled={connecting}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton;
````

## File: bill-app/frontend/src/components/Header.tsx
````typescript
//@ts-nocheck
import React from 'react';
import { FileText, Github } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';

const Header = () => (
  <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Billr
            </h1>
            <p className="text-xs text-gray-500">Blockchain Invoicing</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">Built for Stellar Kickstarter</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
            Features
          </button>
          <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
            About
          </button>
          <a href="/app/create" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
            Create
          </a>
          <a href="/app/invoices" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
            Dashboard
          </a>
          <a href="https://github.com/Olisehgenesis/billr-stella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors flex items-center">
            <Github className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
````

## File: bill-app/frontend/src/hooks/contractUtils.ts
````typescript
import * as Client from '../../packages/billr_contract';

const contract = new Client.Client({
   ...Client.networks.testnet,
   rpcUrl: 'https://soroban-testnet.stellar.org:443'
});



export default contract;
````

## File: bill-app/frontend/src/hooks/useContract.ts
````typescript
//@ts-nocheck

import { useState, useCallback } from 'react';
import { Contract, rpc as SorobanRpc, TransactionBuilder, Networks, Address, StrKey, nativeToScVal, scValToNative, Operation, Asset } from '@stellar/stellar-sdk';
import { Api, Server } from '@stellar/stellar-sdk/rpc';

// USDC has 7 decimal places on Stellar
const USDC_DECIMALS = 7;

// Contract configuration - UPDATED with your deployed contract
const CONTRACT_ADDRESS = 'CCAV5ZYL3LI6MB254CHHVB6B5JBLJ6RUBMYZT5RCBVS46MHS3L4CLIWD';
const RPC_URL = 'https://soroban-testnet.stellar.org';

// Types matching your Rust contract
export interface InvoiceMetadata {
  key: string;
  value: string;
}

export interface ContractError {
  code: number;
  message: string;
  details?: any;
}

export interface AssembledTransaction {
  raw: string; // Clean XDR string
  simulation?: any;
}

// Parsed invoice interface
export interface ParsedInvoice {
  invoice_id: string;
  creator: string;
  recipient: string;
  amount: string;
  metadata: Record<string, string>;
  status: string;
  created_at: string;
  paid_at?: string;
  acknowledgment_note?: string;
  last_updated: string;
}

// Utility functions for USDC conversion
export const convertUsdcToStroops = (usdcAmount: string): string => {
  const amount = parseFloat(usdcAmount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid USDC amount');
  }
  
  // Convert to stroops (smallest unit) - multiply by 10^7 for USDC
  const stroops = Math.floor(amount * Math.pow(10, USDC_DECIMALS));
  return stroops.toString(); // Return as string to avoid BigInt serialization issues
};

export const convertStroopsToUsdc = (stroops: string): string => {
  const amount = parseInt(stroops) / Math.pow(10, USDC_DECIMALS);
  return amount.toFixed(2);
};

// Validation helpers
export const validateStellarAddress = (address: string): boolean => {
  try {
    return StrKey.isValidEd25519PublicKey(address);
  } catch {
    return false;
  }
};

export const validateInvoiceId = (invoiceId: string): boolean => {
  return !!invoiceId && invoiceId.trim().length > 0 && invoiceId.length <= 64;
};

// ENHANCED DATA PARSING FUNCTIONS
const parseInvoiceData = (scVal: any): ParsedInvoice | null => {
  try {
    console.log('🔍 Parsing invoice ScVal:', scVal);
    
    // Handle null, undefined, or empty cases
    if (!scVal || scVal === null || scVal === undefined) {
      console.log('📊 Empty or null invoice ScVal');
      return null;
    }
    
    let nativeData;
    
    // Check if it's already a plain JavaScript object
    if (typeof scVal === 'object' && scVal !== null && !scVal._switch && !scVal.toXDR) {
      console.log('📊 Already native JavaScript object');
      nativeData = scVal;
    } else {
      // Try to convert ScVal to native JavaScript object
      try {
        nativeData = scValToNative(scVal);
        console.log('📊 Native invoice data:', nativeData);
      } catch (parseError) {
        console.log('📊 Invoice ScVal parsing failed:', parseError);
        return null;
      }
    }
    
    // Ensure we have a valid object
    if (!nativeData || typeof nativeData !== 'object') {
      console.log('📊 Invalid native data structure');
      return null;
    }
    
    // Handle the parsed structure
    const invoice: ParsedInvoice = {
      invoice_id: nativeData.invoice_id || '',
      creator: nativeData.creator || '',
      recipient: nativeData.recipient || '',
      amount: nativeData.amount?.toString() || '0',
      metadata: nativeData.metadata || {},
      status: nativeData.status || 'Unknown',
      created_at: nativeData.created_at?.toString() || '0',
      paid_at: nativeData.paid_at?.toString(),
      acknowledgment_note: nativeData.acknowledgment_note,
      last_updated: nativeData.last_updated?.toString() || '0'
    };
    
    console.log('✅ Parsed invoice:', invoice);
    return invoice;
  } catch (error) {
    console.error('❌ Failed to parse invoice:', error);
    return null;
  }
};

const parseInvoiceList = (scVal: any): ParsedInvoice[] => {
  try {
    console.log('🔍 Parsing invoice list ScVal:', scVal);
    
    // Handle null, undefined, or empty cases
    if (!scVal || scVal === null || scVal === undefined) {
      console.log('📊 Empty or null ScVal, returning empty array');
      return [];
    }
    
    // Check if it's already an empty array
    if (Array.isArray(scVal) && scVal.length === 0) {
      console.log('📊 Empty array ScVal, returning empty array');
      return [];
    }
    
    // Check if it's already a JavaScript array with objects
    if (Array.isArray(scVal) && scVal.length > 0 && typeof scVal[0] === 'object' && scVal[0] !== null && !scVal[0]._switch) {
      console.log('📊 Already native JavaScript array, parsing directly');
      return scVal
        .map(parseInvoiceData)
        .filter((invoice): invoice is ParsedInvoice => invoice !== null);
    }
    
    // Try to convert ScVal to native JavaScript
    let nativeData;
    try {
      nativeData = scValToNative(scVal);
      console.log('📊 Native invoice list data:', nativeData);
    } catch (parseError) {
      console.log('📊 ScVal parsing failed, treating as empty:', parseError);
      return [];
    }
    
    if (Array.isArray(nativeData)) {
      return nativeData
        .map(parseInvoiceData)
        .filter((invoice): invoice is ParsedInvoice => invoice !== null);
    }
    
    return [];
  } catch (error) {
    console.error('❌ Failed to parse invoice list:', error);
    return [];
  }
};

const parseInvoiceMap = (scVal: any): { created: ParsedInvoice[]; received: ParsedInvoice[] } => {
  try {
    console.log('🔍 Parsing invoice map ScVal:', scVal);
    
    // Handle null, undefined, or empty cases
    if (!scVal || scVal === null || scVal === undefined) {
      console.log('📊 Empty or null map ScVal, returning empty result');
      return { created: [], received: [] };
    }
    
    // Try to convert ScVal to native JavaScript
    let nativeData;
    try {
      nativeData = scValToNative(scVal);
      console.log('📊 Native invoice map data:', nativeData);
    } catch (parseError) {
      console.log('📊 ScVal map parsing failed, treating as empty:', parseError);
      return { created: [], received: [] };
    }
    
    // Handle Map structure from contract
    if (nativeData && typeof nativeData === 'object') {
      const result = {
        created: [],
        received: []
      };
      
      // If it's a Map, convert to object first
      if (nativeData instanceof Map) {
        const mapObj = Object.fromEntries(nativeData);
        result.created = parseInvoiceList(mapObj.created || []);
        result.received = parseInvoiceList(mapObj.received || []);
      } else {
        // If it's already an object
        result.created = parseInvoiceList(nativeData.created || []);
        result.received = parseInvoiceList(nativeData.received || []);
      }
      
      return result;
    }
    
    return { created: [], received: [] };
  } catch (error) {
    console.error('❌ Failed to parse invoice map:', error);
    return { created: [], received: [] };
  }
};

// Debug function to check if invoice exists after creation
export const debugInvoiceExists = async (invoiceId: string, account: string): Promise<boolean> => {
  try {
    console.log('🔍 DEBUG: Checking if invoice exists:', invoiceId);
    
    const server = new SorobanRpc.Server(RPC_URL);
    const contract = new Contract(CONTRACT_ADDRESS);
    const sourceAccount = await server.getAccount(account);
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100000',
      networkPassphrase: Networks.TESTNET,
    })
    .addOperation(
      contract.call('get_invoice', 
        nativeToScVal(invoiceId, { type: 'string' })
      )
    )
    .setTimeout(180)
    .build();
    
    const simulation = await server.simulateTransaction(transaction);
    
    if (SorobanRpc.Api.isSimulationError(simulation)) {
      console.log('❌ DEBUG: Invoice does not exist:', simulation.error);
      return false;
    }
    
    console.log('✅ DEBUG: Invoice exists!', simulation.result?.retval);
    return true;
    
  } catch (error) {
    console.log('❌ DEBUG: Error checking invoice:', error);
    return false;
  }
};
const handleContractError = (err: any, operation: string): ContractError => {
  console.error(`Contract error in ${operation}:`, err);
  
  let contractError: ContractError = {
    code: 0,
    message: `Failed to ${operation}`,
    details: err
  };

  if (err && typeof err === 'object') {
    if (err.message) {
      contractError.message = err.message;
    }
    
    if (err.code !== undefined) {
      contractError.code = err.code;
    }

    // Handle simulation errors
    if (err.simulation && err.simulation.error) {
      contractError.message = `Simulation error: ${err.simulation.error}`;
    }

    // Handle RPC errors
    if (err.response?.data?.message) {
      contractError.message = err.response.data.message;
    }

    // Map Soroban contract errors to user-friendly messages
    if (err.message?.includes('InvoiceAlreadyExists')) {
      contractError.message = 'An invoice with this ID already exists. Please use a different Invoice ID.';
    } else if (err.message?.includes('InvalidAmount')) {
      contractError.message = 'Invalid amount. Amount must be greater than 0.';
    } else if (err.message?.includes('Unauthorized')) {
      contractError.message = 'Authorization failed. Please make sure your wallet is connected properly.';
    } else if (err.message?.includes('InvoiceNotFound')) {
      contractError.message = 'Invoice not found.';
    } else if (err.message?.includes('InvalidStatus')) {
      contractError.message = 'Invalid invoice status for this operation.';
    }
  }

  return contractError;
};

// Main hook for creating invoices
export const useCreateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: {
    creator: string;
    invoiceId: string;  // Will be converted to invoice_id for contract
    recipient: string;
    amount: string;     // Will be converted to u64
    metadata: Record<string, string>;
  }): Promise<AssembledTransaction> => {
    console.log('🚀 Creating invoice with params:', params);
    
    setLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!validateStellarAddress(params.creator)) {
        throw new Error('Invalid creator address');
      }
      if (!validateStellarAddress(params.recipient)) {
        throw new Error('Invalid recipient address');
      }
      if (!validateInvoiceId(params.invoiceId)) {
        throw new Error('Invalid invoice ID');
      }

      // Convert amount to stroops (u64)
      const amountStroops = convertUsdcToStroops(params.amount);
      console.log('💰 Amount conversion:', {
        original: params.amount,
        stroops: amountStroops
      });

      // Initialize RPC and contract
      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);

      // Get source account
      const sourceAccount = await server.getAccount(params.creator);
      console.log('👤 Source account loaded:', params.creator);

      // Build transaction with CORRECT parameter names matching Rust contract
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '1000000', // Higher fee for Soroban operations
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'create_invoice',
          // Use nativeToScVal for proper conversion
          nativeToScVal(params.creator, { type: 'address' }),      // creator: Address
          nativeToScVal(params.invoiceId, { type: 'string' }),     // invoice_id: String
          nativeToScVal(params.recipient, { type: 'address' }),    // recipient: Address  
          nativeToScVal(parseInt(amountStroops), { type: 'u64' }), // amount: u64
          nativeToScVal(params.metadata, { type: 'map' })          // metadata: Map<String, String>
        )
      )
      .setTimeout(180)
      .build();

      console.log('📋 Transaction built, simulating...');

      // Simulate transaction
      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        console.error('❌ Simulation failed:', simulation);
        throw new Error(`Contract simulation failed: ${simulation.error}`);
      }

      if (SorobanRpc.Api.isSimulationRestore(simulation)) {
        console.log('🔄 Contract needs state restoration');
        throw new Error('Contract state restoration required');
      }

      console.log('✅ Simulation successful');

      // Prepare transaction for signing - this is the key fix
      const preparedTransaction = SorobanRpc.assembleTransaction(
        transaction, 
        simulation
      ).build(); // Call .build() to get the actual Transaction object

      // Return clean XDR string to avoid serialization issues
      const result: AssembledTransaction = {
        raw: preparedTransaction.toXDR(), // Now this will work correctly
        simulation: simulation
      };

      console.log('🎯 Transaction prepared successfully, XDR length:', result.raw.length);
      
      return result;

    } catch (err: any) {
      const contractError = handleContractError(err, 'create invoice');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for sending invoices (changing status from Draft to Sent)
export const useSendInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: {
    creator: string;
    invoiceId: string;
  }): Promise<AssembledTransaction> => {
    console.log('📤 Sending invoice with params:', params);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(params.creator)) {
        throw new Error('Invalid creator address');
      }
      if (!validateInvoiceId(params.invoiceId)) {
        throw new Error('Invalid invoice ID');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      const sourceAccount = await server.getAccount(params.creator);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '1000000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'send_invoice',
          nativeToScVal(params.creator, { type: 'address' }),
          nativeToScVal(params.invoiceId, { type: 'string' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      const preparedTransaction = SorobanRpc.assembleTransaction(transaction, simulation).build();

      return {
        raw: preparedTransaction.toXDR(),
        simulation: simulation
      };

    } catch (err: any) {
      const contractError = handleContractError(err, 'send invoice');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for acknowledging invoices
export const useAcknowledgeInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: {
    recipient: string;
    invoiceId: string;
    note?: string;
  }): Promise<AssembledTransaction> => {
    console.log('✅ Acknowledging invoice with params:', params);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(params.recipient)) {
        throw new Error('Invalid recipient address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      const sourceAccount = await server.getAccount(params.recipient);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '1000000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'acknowledge_invoice',
          nativeToScVal(params.recipient, { type: 'address' }),
          nativeToScVal(params.invoiceId, { type: 'string' }),
          params.note 
            ? nativeToScVal(params.note, { type: 'string' })
            : nativeToScVal(null, { type: 'option' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      const preparedTransaction = SorobanRpc.assembleTransaction(transaction, simulation).build();

      return {
        raw: preparedTransaction.toXDR(),
        simulation: simulation
      };

    } catch (err: any) {
      const contractError = handleContractError(err, 'acknowledge invoice');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for paying invoices
export const usePayInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: {
    recipient: string;
    invoiceId: string;
  }): Promise<AssembledTransaction> => {
    console.log('💳 Paying invoice with params:', params);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(params.recipient)) {
        throw new Error('Invalid recipient address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      const sourceAccount = await server.getAccount(params.recipient);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '1000000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'pay_invoice',
          nativeToScVal(params.recipient, { type: 'address' }),
          nativeToScVal(params.invoiceId, { type: 'string' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      const preparedTransaction = SorobanRpc.assembleTransaction(transaction, simulation).build();

      return {
        raw: preparedTransaction.toXDR(),
        simulation: simulation
      };

    } catch (err: any) {
      const contractError = handleContractError(err, 'pay invoice');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for getting an invoice
export const useGetInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (invoiceId: string, account?: string): Promise<ParsedInvoice | null> => {
    console.log('🔍 Getting invoice:', invoiceId);
    setLoading(true);
    setError(null);
    try {
      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      // Use the provided account or fallback to the dummy account
      const accountToUse = account || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
      const sourceAccount = await server.getAccount(accountToUse);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call('get_invoice', 
            nativeToScVal(invoiceId, { type: 'string' })
          )
        )
        .setTimeout(180)
        .build();
      const simulation = await server.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Failed to get invoice: ${simulation.error}`);
      }
      // Extract and parse result from simulation
      const result = simulation.result?.retval;
      return parseInvoiceData(result);
    } catch (err: any) {
      const contractError = handleContractError(err, 'get invoice');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for getting all invoices by creator
export const useGetInvoicesByCreator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (creator: string, account?: string): Promise<ParsedInvoice[]> => {
    console.log('📋 Getting invoices by creator:', creator);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(creator)) {
        throw new Error('Invalid creator address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      
      const accountToUse = account || creator;
      const sourceAccount = await server.getAccount(accountToUse);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'get_invoices_by_creator',
          nativeToScVal(creator, { type: 'address' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Failed to get invoices: ${simulation.error}`);
      }

      const result = simulation.result?.retval;
      return parseInvoiceList(result);

    } catch (err: any) {
      const contractError = handleContractError(err, 'get invoices by creator');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for getting all invoices by recipient
export const useGetInvoicesByRecipient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (recipient: string, account?: string): Promise<ParsedInvoice[]> => {
    console.log('📬 Getting invoices by recipient:', recipient);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      
      const accountToUse = account || recipient;
      const sourceAccount = await server.getAccount(accountToUse);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'get_invoices_by_recipient',
          nativeToScVal(recipient, { type: 'address' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Failed to get invoices: ${simulation.error}`);
      }

      const result = simulation.result?.retval;
      return parseInvoiceList(result);

    } catch (err: any) {
      const contractError = handleContractError(err, 'get invoices by recipient');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for getting all invoices for an address (both created and received)
export const useGetAllInvoicesForAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (address: string, account?: string): Promise<{ created: ParsedInvoice[]; received: ParsedInvoice[] }> => {
    console.log('📑 Getting all invoices for address:', address);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(address)) {
        throw new Error('Invalid address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      
      const accountToUse = account || address;
      const sourceAccount = await server.getAccount(accountToUse);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'get_all_invoices_for_address',
          nativeToScVal(address, { type: 'address' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Failed to get all invoices: ${simulation.error}`);
      }

      const result = simulation.result?.retval;
      return parseInvoiceMap(result);

    } catch (err: any) {
      const contractError = handleContractError(err, 'get all invoices for address');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Hook for getting pending invoices (invoices needing action)
export const useGetPendingInvoices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (address: string, account?: string): Promise<{ awaiting_payment: ParsedInvoice[]; pending_action: ParsedInvoice[] }> => {
    console.log('⏳ Getting pending invoices for address:', address);
    
    setLoading(true);
    setError(null);
    
    try {
      if (!validateStellarAddress(address)) {
        throw new Error('Invalid address');
      }

      const server = new SorobanRpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS);
      
      const accountToUse = account || address;
      const sourceAccount = await server.getAccount(accountToUse);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        contract.call(
          'get_pending_invoices',
          nativeToScVal(address, { type: 'address' })
        )
      )
      .setTimeout(180)
      .build();

      const simulation = await server.simulateTransaction(transaction);
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Failed to get pending invoices: ${simulation.error}`);
      }

      const result = simulation.result?.retval;
      
      // Parse the pending invoices map
      const nativeData = scValToNative(result);
      console.log('📊 Native pending data:', nativeData);
      
      const parsedResult = {
        awaiting_payment: [],
        pending_action: []
      };
      
      if (nativeData && typeof nativeData === 'object') {
        if (nativeData instanceof Map) {
          const mapObj = Object.fromEntries(nativeData);
          parsedResult.awaiting_payment = parseInvoiceList(mapObj.awaiting_payment || []);
          parsedResult.pending_action = parseInvoiceList(mapObj.pending_action || []);
        } else {
          parsedResult.awaiting_payment = parseInvoiceList(nativeData.awaiting_payment || []);
          parsedResult.pending_action = parseInvoiceList(nativeData.pending_action || []);
        }
      }
      
      return parsedResult;

    } catch (err: any) {
      const contractError = handleContractError(err, 'get pending invoices');
      setError(contractError);
      throw contractError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// USDC Soroban token contract address
const USDC_TOKEN_CONTRACT = 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA';

// Get USDC balance for an address using Soroban token contract
export const getUsdcBalance = async (address: string): Promise<string> => {
    const server = new Server(RPC_URL);
    const contract = new Contract(USDC_TOKEN_CONTRACT);
  
    console.log(`Getting USDC balance for address: ${address}`);
    console.log(`Using contract: ${USDC_TOKEN_CONTRACT}`);
  
    try {
      const sourceAccount = await server.getAccount(address);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call('balance', nativeToScVal(address, { type: 'address' }))
        )
        .setTimeout(180)
        .build();
  
      const simulation = await server.simulateTransaction(transaction);
      if (Api.isSimulationError(simulation)) {
        console.error(`Simulation failed: ${simulation.error}`);
        throw new Error(`Failed to simulate USDC balance: ${simulation.error}`);
      }
  
      const result = simulation.result?.retval;
      if (!result) {
        console.warn('No return value from balance simulation');
        return '0';
      }
  
      const native = scValToNative(result);
      console.log(`USDC Balance (raw):`, native);
      return native.toString();
    } catch (err: any) {
      console.error(`Error in getUsdcBalance:`, err.message);
      throw err;
    }
  };

// Check if recipient can pay invoice (has enough USDC)
export const useCheckPaymentCapability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: { recipient: string; invoiceAmount: string }) => {
    setLoading(true);
    setError(null);
    try {
      const balance = await getUsdcBalance(params.recipient);
      const required = convertUsdcToStroops(params.invoiceAmount);
      const canPay = BigInt(balance) >= BigInt(required);
      return { canPay, balance, required };
    } catch (err: any) {
      setError({ code: 0, message: err.message || 'Failed to check payment capability', details: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Pay invoice: transfer USDC and mark invoice as paid
export const usePayInvoiceWithUsdcTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: { recipient: string; invoiceId: string; invoice?: ParsedInvoice }) => {
    setLoading(true);
    setError(null);
    try {
      // Get invoice data if not provided
      let invoice = params.invoice;
      if (!invoice) {
        // Use the get invoice hook logic
        const server = new SorobanRpc.Server(RPC_URL);
        const contract = new Contract(CONTRACT_ADDRESS);
        const sourceAccount = await server.getAccount(params.recipient);
        const transaction = new TransactionBuilder(sourceAccount, {
          fee: '100000',
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(
            contract.call('get_invoice', nativeToScVal(params.invoiceId, { type: 'string' }))
          )
          .setTimeout(180)
          .build();
        const simulation = await server.simulateTransaction(transaction);
        if (SorobanRpc.Api.isSimulationError(simulation)) {
          throw new Error(`Failed to get invoice: ${simulation.error}`);
        }
        const result = simulation.result?.retval;
        const parsed = parseInvoiceData(result);
        if (!parsed) throw new Error('Invoice not found');
        invoice = parsed;
      }
      // Check balance
      const balance = await getUsdcBalance(params.recipient);
      const required = invoice.amount;
      if (BigInt(balance) < BigInt(required)) {
        throw new Error(`Insufficient USDC. Need ${convertStroopsToUsdc(required)}, have ${convertStroopsToUsdc(balance)}`);
      }
      // Build transaction: transfer USDC from recipient to creator
      const server = new SorobanRpc.Server(RPC_URL);
      const usdcContract = new Contract(USDC_TOKEN_CONTRACT);
      const invoiceContract = new Contract(CONTRACT_ADDRESS);
      const sourceAccount = await server.getAccount(params.recipient);
      const txBuilder = new TransactionBuilder(sourceAccount, {
        fee: '1000000',
        networkPassphrase: Networks.TESTNET,
      });
      // Transfer USDC from recipient to creator
      txBuilder.addOperation(
        usdcContract.call(
          'transfer',
          nativeToScVal(params.recipient, { type: 'address' }),
          nativeToScVal(invoice.creator, { type: 'address' }),
          nativeToScVal(BigInt(invoice.amount), { type: 'i128' })
        )
      );
      // Mark invoice as paid
      txBuilder.addOperation(
        invoiceContract.call(
          'pay_invoice',
          nativeToScVal(params.recipient, { type: 'address' }),
          nativeToScVal(params.invoiceId, { type: 'string' })
        )
      );
      const transaction = txBuilder.setTimeout(180).build();
      const simulation = await server.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }
      const preparedTransaction = SorobanRpc.assembleTransaction(transaction, simulation).build();
      return { raw: preparedTransaction.toXDR(), simulation };
    } catch (err: any) {
      setError({ code: 0, message: err.message || 'Failed to pay invoice', details: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// Approve Billr contract to spend USDC on behalf of the user
export const useApproveUsdcSpending = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContractError | null>(null);

  const mutate = useCallback(async (params: { owner: string; amount: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!validateStellarAddress(params.owner)) {
        throw new Error('Invalid owner address');
      }
      const amountStroops = params.amount;
      const server = new SorobanRpc.Server(RPC_URL);
      const usdcContract = new Contract(USDC_TOKEN_CONTRACT);
      const sourceAccount = await server.getAccount(params.owner);
      // Fetch the current ledger and set expiration_ledger
      const ledgerInfo = await server.getLatestLedger();
      const expirationLedger = ledgerInfo.sequence + 100; // valid for next 100 ledgers
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          usdcContract.call(
            'approve',
            nativeToScVal(params.owner, { type: 'address' }),
            nativeToScVal(CONTRACT_ADDRESS, { type: 'address' }),
            nativeToScVal(BigInt(amountStroops), { type: 'i128' }),
            nativeToScVal(expirationLedger, { type: 'u32' })
          )
        )
        .setTimeout(180)
        .build();
      const simulation = await server.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }
      const preparedTransaction = SorobanRpc.assembleTransaction(transaction, simulation).build();
      return {
        raw: preparedTransaction.toXDR(),
        simulation: simulation
      };
    } catch (err: any) {
      setError({ code: 0, message: err.message || 'Failed to approve USDC spending', details: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};
````

## File: bill-app/frontend/src/pages/create.tsx
````typescript
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Plus, Minus, Save, Send, User, DollarSign, Hash, MessageSquare, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  useCreateInvoice, 
  useSendInvoice, 
  validateStellarAddress, 
  validateInvoiceId, 
  convertStroopsToUsdc,
  type InvoiceMetadata,
  debugInvoiceExists // <-- Add this import
} from '../hooks/useContract';
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  LOBSTR_ID,
  FreighterModule,
  LobstrModule
} from '@creit.tech/stellar-wallets-kit';

// Improved wallet kit configuration
const createWalletKit = () => {
  return new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: LOBSTR_ID, // Start with Freighter as it's more reliable
    modules: [
      new FreighterModule(),
      new LobstrModule()
    ],
  });
};

const kit = createWalletKit();

// Enhanced wallet hook with better error handling
function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check for stored connection
    const checkConnection = async () => {
      try {
        const storedAddress = localStorage.getItem('stellar-wallet-address');
        if (storedAddress && validateStellarAddress(storedAddress)) {
          setAddress(storedAddress);
          setConnected(true);
        }
      } catch (error) {
        console.log('No previous wallet connection found');
      }
    };
    
    checkConnection();
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setAddress(address);
            setConnected(true);
            
            // Store connection
            localStorage.setItem('stellar-wallet-address', address);
            localStorage.setItem('stellar-wallet-id', option.id);
          } catch (error) {
            console.error('Failed to get address:', error);
            throw error;
          }
        }
      });
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      
      if (error.message?.includes('User rejected')) {
        alert('Wallet connection was rejected by user');
      } else if (error.message?.includes('No wallet')) {
        alert('Please install a Stellar wallet extension (Freighter or Lobstr)');
      } else {
        alert('Failed to connect wallet: ' + (error.message || error));
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await kit.disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setAddress(null);
      setConnected(false);
      localStorage.removeItem('stellar-wallet-address');
      localStorage.removeItem('stellar-wallet-id');
    }
  };

  return { address, connected, connecting, connect, disconnect };
}

// Enhanced transaction signing with better error handling
const signTransactionSafely = async (transactionXdr: string, walletAddress: string) => {
  try {
    console.log('🔐 Signing transaction...');
    
    const networkPassphrase = 'Test SDF Network ; September 2015';
    
    const result = await kit.signTransaction(transactionXdr, {
      address: walletAddress,
      networkPassphrase: networkPassphrase
    });
    
    console.log('✅ Transaction signed successfully');
    return result;
    
  } catch (error: any) {
    console.error('❌ Signing error:', error);
    
    if (error.message?.includes('could not be cloned')) {
      // Try alternative signing method
      try {
        console.log('🔄 Trying alternative signing method...');
        const result = await kit.signTransaction(transactionXdr);
        console.log('✅ Alternative signing successful');
        return result;
      } catch (alternativeError) {
        console.error('❌ Alternative signing also failed:', alternativeError);
        throw new Error('Transaction signing failed: Wallet communication error. Please try refreshing the page and reconnecting your wallet.');
      }
    }
    
    throw error;
  }
};

// Enhanced transaction submission with retry logic
const submitTransaction = async (signedXdr: string) => {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`📤 Submitting transaction (attempt ${retryCount + 1}/${maxRetries})`);
      
      const response = await fetch('https://soroban-testnet.stellar.org/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Name': 'billr-invoice-app',
          'X-Client-Version': '2.0.0'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'sendTransaction',
          params: {
            transaction: signedXdr
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Stellar RPC Error: ${result.error.message}`);
      }

      console.log('✅ Transaction submitted successfully:', result);
      return result;
      
    } catch (error: any) {
      retryCount++;
      console.error(`❌ Submission attempt ${retryCount} failed:`, error);
      
      if (retryCount >= maxRetries) {
        throw new Error(`Transaction submission failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
};

export default function CreateInvoicePage() {
  const [formData, setFormData] = useState({
    invoiceId: '',
    recipientAddress: '',
    amount: '',
    description: '',
    metadata: [{ key: '', value: '' }] as InvoiceMetadata[],
    includeItems: false,
    items: [{ name: '', quantity: 1, unitPrice: '', vatRate: 0 }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { mutate: createInvoice, loading: creating, error: createError } = useCreateInvoice();
  const { mutate: sendInvoice, loading: sending, error: sendError } = useSendInvoice();
  const wallet = useWallet();

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const addMetadataField = () => {
    setFormData({
      ...formData,
      metadata: [...formData.metadata, { key: '', value: '' }]
    });
  };

  const removeMetadataField = (index: number) => {
    const newMetadata = formData.metadata.filter((_, i) => i !== index);
    setFormData({ ...formData, metadata: newMetadata });
  };

  const updateMetadataField = (index: number, field: keyof InvoiceMetadata, value: string) => {
    const newMetadata = formData.metadata.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({ ...formData, metadata: newMetadata });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, unitPrice: '', vatRate: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = formData.items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({ ...formData, items: newItems });
  };

  const calculateItemTotal = (item: { quantity: number; unitPrice: string; vatRate: number }) => {
    const subtotal = (parseFloat(String(item.quantity)) || 0) * (parseFloat(item.unitPrice) || 0);
    const vat = subtotal * (parseFloat(String(item.vatRate)) || 0) / 100;
    return subtotal + vat;
  };

  // Update amount when items change
  useEffect(() => {
    if (formData.includeItems) {
      const grandTotal = formData.items.reduce((total, item) => {
        if (item.name && item.unitPrice) {
          return total + calculateItemTotal(item);
        }
        return total;
      }, 0);
      setFormData(prev => ({ ...prev, amount: grandTotal.toFixed(7) })); // 7 decimals for USDC precision
    }
  }, [formData.items, formData.includeItems]);

  const calculateGrandTotal = () => {
    if (!formData.includeItems) {
      return parseFloat(formData.amount) || 0;
    }
    return formData.items.reduce((total, item) => {
      if (item.name && item.unitPrice) {
        return total + calculateItemTotal(item);
      }
      return total;
    }, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Invoice ID validation
    if (!formData.invoiceId.trim()) {
      newErrors.invoiceId = 'Invoice ID is required';
    } else if (!validateInvoiceId(formData.invoiceId)) {
      newErrors.invoiceId = 'Invoice ID must be between 1-64 characters';
    }

    // Recipient address validation
    if (!formData.recipientAddress.trim()) {
      newErrors.recipientAddress = 'Recipient address is required';
    } else if (!validateStellarAddress(formData.recipientAddress)) {
      newErrors.recipientAddress = 'Please enter a valid Stellar address (starts with G)';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount too large (max 1,000,000 USDC)';
      }
    }

    // Creator address validation (wallet must be connected)
    if (!wallet.address) {
      newErrors.wallet = 'Please connect your wallet';
    } else if (!validateStellarAddress(wallet.address)) {
      newErrors.wallet = 'Connected wallet address is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    console.log(`🚀 Starting ${action} operation`);
    
    // Clear previous messages
    setSuccessMessage(null);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare metadata (same as before)
      let finalMetadata = [...formData.metadata.filter(m => m.key && m.value)];
      
      if (formData.includeItems) {
        formData.items.forEach((item, index) => {
          if (item.name) {
            finalMetadata.push(
              { key: `item_${index + 1}_name`, value: item.name },
              { key: `item_${index + 1}_quantity`, value: item.quantity.toString() },
              { key: `item_${index + 1}_unit_price`, value: item.unitPrice },
              { key: `item_${index + 1}_vat_rate`, value: item.vatRate.toString() },
              { key: `item_${index + 1}_total`, value: calculateItemTotal(item).toFixed(7) }
            );
          }
        });
        finalMetadata.push({ key: 'has_items', value: 'true' });
        finalMetadata.push({ key: 'items_count', value: formData.items.filter(i => i.name).length.toString() });
      }
      
      if (formData.description) {
        finalMetadata.push({ key: 'description', value: formData.description });
      }

      const metadataObj = finalMetadata.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {} as Record<string, string>);

      console.log('📋 Creating invoice transaction...');

      // Create invoice transaction
      const createResult = await createInvoice({
        creator: wallet.address!,
        invoiceId: formData.invoiceId,
        recipient: formData.recipientAddress,
        amount: formData.amount,
        metadata: metadataObj
      });

      console.log('✅ Invoice transaction created');

      // Sign the transaction
      const { signedTxXdr } = await signTransactionSafely(createResult.raw, wallet.address!);
      
      // Submit the transaction
      const submitResult = await submitTransaction(signedTxXdr);
      
      let transactionHash = submitResult.result?.hash || 'N/A';
      
      console.log('✅ Create transaction submitted:', transactionHash);
      
      // If action is 'send', also send the invoice
      if (action === 'send') {
        console.log('⏳ Waiting 3 seconds before sending invoice...');
        
        // Wait a bit for the transaction to be confirmed
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // DEBUG: Check if invoice exists
        const invoiceExists = await debugInvoiceExists(formData.invoiceId, wallet.address!);
        if (!invoiceExists) {
          throw new Error('Invoice was not saved properly. Please try again or use "Save as Draft" first.');
        }
        
        console.log('📤 Sending invoice...');
        
        const sendResult = await sendInvoice({
          creator: wallet.address!,
          invoiceId: formData.invoiceId
        });
        
        const { signedTxXdr: signedSendXdr } = await signTransactionSafely(sendResult.raw, wallet.address!);
        const sendSubmitResult = await submitTransaction(signedSendXdr);
        
        transactionHash = sendSubmitResult.result?.hash || transactionHash;
      }

      // Success (rest remains the same)
      setIsLoading(false);
      setSuccessMessage(
        `Invoice ${action === 'save' ? 'saved' : 'created and sent'} successfully! Transaction: ${transactionHash}`
      );
      
      // Reset form
      setFormData({
        invoiceId: '',
        recipientAddress: '',
        amount: '',
        description: '',
        metadata: [{ key: '', value: '' }],
        includeItems: false,
        items: [{ name: '', quantity: 1, unitPrice: '', vatRate: 0 }]
      });
      
      setErrors({});

    } catch (error: any) {
      console.error('❌ Invoice operation failed:', error);
      setIsLoading(false);
      
      // Enhanced error handling (same as before)
      let errorMessage = 'Failed to create invoice';
      
      if (error.message?.includes('InvoiceAlreadyExists')) {
        errorMessage = 'An invoice with this ID already exists. Please use a different Invoice ID.';
      } else if (error.message?.includes('InvalidAmount')) {
        errorMessage = 'Invalid amount. Amount must be greater than 0.';
      } else if (error.message?.includes('Unauthorized')) {
        errorMessage = 'Authorization failed. Please make sure your wallet is connected properly.';
      } else if (error.message?.includes('User declined') || error.message?.includes('rejected')) {
        errorMessage = 'Transaction was cancelled by user';
      } else if (error.message?.includes('Wallet communication error')) {
        errorMessage = error.message;
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds in wallet for transaction fees';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again';
      } else if (error.message?.includes('Invalid creator address')) {
        errorMessage = 'Wallet address is invalid. Please reconnect your wallet.';
      } else if (error.message?.includes('Invalid recipient address')) {
        errorMessage = 'Recipient address is invalid. Please check the address format.';
      } else if (error.message?.includes('Invoice was not saved properly')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      {/* Success Banner */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-green-100 border border-green-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    Billr
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {wallet.address ? (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅ Connected:</span>
                  <span className="font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                  <button
                    onClick={wallet.disconnect}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                  onClick={wallet.connect}
                  disabled={wallet.connecting}
                >
                  {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Invoice</h2>
          <p className="text-gray-600">Fill out the details below to create your blockchain invoice</p>
        </div>

        {/* Validation Warnings */}
        {!wallet.address && (
          <div className="mb-8 p-6 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-center font-semibold flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Please connect your wallet to create an invoice.
          </div>
        )}

        {errors.wallet && (
          <div className="mb-8 p-6 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center font-semibold flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {errors.wallet}
          </div>
        )}

        {(createError || sendError) && (
          <div className="mb-8 p-6 bg-red-100 border border-red-300 rounded-xl text-red-800 text-center font-semibold">
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {createError?.message || sendError?.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Invoice ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-2" />
                    Invoice ID *
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
                      errors.invoiceId 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="INV-001"
                    maxLength={64}
                  />
                  {errors.invoiceId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.invoiceId}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Unique identifier for this invoice (max 64 characters)
                  </p>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Recipient Address *
                  </label>
                  <input
                    type="text"
                    value={formData.recipientAddress}
                    onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 font-mono text-sm ${
                      errors.recipientAddress 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                  {errors.recipientAddress && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.recipientAddress}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Stellar public key starting with 'G' (56 characters)
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Amount (USDC) *
                    {formData.includeItems && (
                      <span className="text-xs text-blue-600 ml-2">(Auto-calculated from items)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.0000001" // Support 7 decimal places for USDC
                      min="0"
                      max="1000000"
                      value={formData.amount}
                      onChange={(e) => !formData.includeItems && setFormData({ ...formData, amount: e.target.value })}
                      readOnly={formData.includeItems}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-0 ${
                        formData.includeItems 
                          ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
                          : errors.amount 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-gray-500 font-medium">USDC</span>
                    </div>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.amount}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum amount: 1,000,000 USDC (supports up to 7 decimal places)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors focus:outline-none focus:ring-0 resize-none"
                    placeholder="Brief description of the invoice..."
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional description (max 500 characters)
                  </p>
                </div>

                {/* Items Toggle - Same as before but with better validation */}
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-blue-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">
                        Include Itemized List
                      </label>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeItems}
                        onChange={(e) => setFormData({ ...formData, includeItems: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-orange-500"></div>
                    </label>
                  </div>

                  {formData.includeItems && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Add individual items with pricing</span>
                        <button
                          type="button"
                          onClick={addItem}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Item
                        </button>
                      </div>

                      {/* Items table - same structure as before */}
                      <div className="space-y-4">
                        {formData.items.map((item, index) => {
                          const subtotal = (parseFloat(String(item.quantity)) || 0) * (parseFloat(item.unitPrice) || 0);
                          const vatAmount = subtotal * (parseFloat(String(item.vatRate)) || 0) / 100;
                          const itemTotal = subtotal + vatAmount;
                          
                          return (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4">
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Item Name</label>
                                 <input
                                   type="text"
                                   placeholder="Enter item name"
                                   value={item.name}
                                   onChange={(e) => updateItem(index, 'name', e.target.value)}
                                   className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                                 />
                               </div>
                               <div className="col-span-2">
                                 <label className="text-xs font-medium text-gray-700 mb-1 block">Qty</label>
                                 <input
                                   type="number"
                                   min="1"
                                   value={item.quantity}
                                   onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                                   className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                                 />
                               </div>
                               <div className="col-span-2">
                                 <label className="text-xs font-medium text-gray-700 mb-1 block">Unit Price</label>
                                 <input
                                   type="number"
                                   step="0.0000001"
                                   placeholder="0.00"
                                   value={item.unitPrice}
                                   onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                   className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                                 />
                               </div>
                               <div className="col-span-2">
                                 <label className="text-xs font-medium text-gray-700 mb-1 block">VAT %</label>
                                 <input
                                   type="number"
                                   step="0.1"
                                   min="0"
                                   max="100"
                                   value={item.vatRate}
                                   onChange={(e) => updateItem(index, 'vatRate', parseFloat(e.target.value) || 0)}
                                   className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
                                 />
                               </div>
                               <div className="col-span-1">
                                 <label className="text-xs font-medium text-gray-700 mb-1 block">Total</label>
                                 <div className="text-sm font-semibold text-blue-600">
                                   ${itemTotal.toFixed(7)}
                                 </div>
                               </div>
                               <div className="col-span-1">
                                 {formData.items.length > 1 && (
                                   <button
                                     type="button"
                                     onClick={() => removeItem(index)}
                                     className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                     title="Remove item"
                                   >
                                     <Minus className="w-4 h-4" />
                                   </button>
                                 )}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>

                     <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-orange-100 rounded-xl">
                       <div className="flex justify-between items-center">
                         <span className="font-semibold text-gray-700">Grand Total:</span>
                         <span className="text-xl font-bold text-gray-800">${calculateGrandTotal().toFixed(7)} USDC</span>
                       </div>
                     </div>
                   </div>
                 )}
               </div>

               {/* Metadata Fields */}
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <label className="block text-sm font-semibold text-gray-700">
                     Additional Metadata
                   </label>
                   <button
                     type="button"
                     onClick={addMetadataField}
                     className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                   >
                     <Plus className="w-4 h-4 mr-1" />
                     Add Field
                   </button>
                 </div>

                 <div className="space-y-3">
                   {formData.metadata.map((item, index) => (
                     <div key={index} className="flex gap-3">
                       <input
                         type="text"
                         placeholder="Key"
                         value={item.key}
                         onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                         className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-colors focus:outline-none focus:ring-0"
                         maxLength={100}
                       />
                       <input
                         type="text"
                         placeholder="Value"
                         value={item.value}
                         onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                         className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-colors focus:outline-none focus:ring-0"
                         maxLength={500}
                       />
                       {formData.metadata.length > 1 && (
                         <button
                           type="button"
                           onClick={() => removeMetadataField(index)}
                           className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Minus className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))}
                 </div>
                 <p className="mt-2 text-xs text-gray-500">
                   Add custom key-value pairs for additional invoice information
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Preview Card */}
         <div className="lg:col-span-1">
           <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-8">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Preview</h3>
             
             <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6 mb-6">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg mr-2"></div>
                   <span className="font-semibold text-gray-800">
                     {formData.invoiceId || 'Invoice ID'}
                   </span>
                 </div>
                 <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                   Draft
                 </span>
               </div>
               
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-600">To:</span>
                   <span className="font-medium text-gray-800 break-all text-right max-w-32">
                     {formData.recipientAddress ? 
                       `${formData.recipientAddress.slice(0, 6)}...${formData.recipientAddress.slice(-4)}` : 
                       'Recipient Address'
                     }
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Amount:</span>
                   <span className="font-semibold text-gray-800">
                     {formData.amount ? `${parseFloat(formData.amount).toFixed(7)}` : '0.0000000'} USDC
                   </span>
                 </div>
                 {formData.description && (
                   <div className="pt-2 border-t border-gray-200">
                     <p className="text-gray-600 text-xs">{formData.description.slice(0, 100)}{formData.description.length > 100 ? '...' : ''}</p>
                   </div>
                 )}
                 
                 {formData.includeItems && formData.items.some(item => item.name) && (
                   <div className="pt-2 border-t border-gray-200">
                     <p className="text-gray-600 text-xs font-medium mb-2">Items:</p>
                     {formData.items.filter(item => item.name).map((item, index) => (
                       <div key={index} className="text-xs text-gray-600 mb-1 flex justify-between">
                         <span>{item.name} ({item.quantity}x)</span>
                         <span>${calculateItemTotal(item).toFixed(7)}</span>
                       </div>
                     ))}
                   </div>
                 )}

                 {formData.metadata.filter(m => m.key && m.value).length > 0 && (
                   <div className="pt-2 border-t border-gray-200">
                     <p className="text-gray-600 text-xs font-medium mb-2">Metadata:</p>
                     {formData.metadata.filter(m => m.key && m.value).slice(0, 3).map((item, index) => (
                       <div key={index} className="text-xs text-gray-600 mb-1">
                         <span className="font-medium">{item.key}:</span> {item.value.slice(0, 20)}{item.value.length > 20 ? '...' : ''}
                       </div>
                     ))}
                     {formData.metadata.filter(m => m.key && m.value).length > 3 && (
                       <div className="text-xs text-gray-500">
                         +{formData.metadata.filter(m => m.key && m.value).length - 3} more
                       </div>
                     )}
                   </div>
                 )}
               </div>
             </div>

             {/* Action Buttons */}
             <div className="space-y-3">
               <button
                 onClick={() => handleSubmit('save')}
                 disabled={isLoading || creating || sending || !wallet.address}
                 className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
               >
                 {(isLoading || creating) ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                     Creating...
                   </>
                 ) : (
                   <>
                     <Save className="w-5 h-5 mr-2" />
                     Save as Draft
                   </>
                 )}
               </button>

               <button
                 onClick={() => handleSubmit('send')}
                 disabled={isLoading || creating || sending || !wallet.address}
                 className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 disabled:text-gray-400 px-4 py-3 rounded-xl font-semibold border-2 border-gray-200 disabled:border-gray-200 transition-all hover:border-blue-300 hover:shadow-lg disabled:hover:border-gray-200 disabled:hover:shadow-none flex items-center justify-center disabled:cursor-not-allowed"
               >
                 {(isLoading || sending) ? (
                   <>
                     <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                     Sending...
                   </>
                 ) : (
                   <>
                     <Send className="w-5 h-5 mr-2" />
                     Create & Send
                   </>
                 )}
               </button>
               
               {/* Contract Address Info */}
               <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                 <div className="text-xs text-gray-600">
                   <div className="font-semibold mb-1">Contract:</div>
                   <div className="font-mono text-xs break-all">CAI4JQ...KJIKEA</div>
                   <div className="mt-1 text-gray-500">Stellar Testnet</div>
                 </div>
               </div>
             </div>

             {/* Status Info */}
             <div className="mt-6 p-4 bg-blue-50 rounded-xl">
               <h4 className="text-sm font-semibold text-blue-800 mb-2">Invoice Status Flow</h4>
               <div className="space-y-1 text-xs text-blue-700">
                 <div className="flex items-center">
                   <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                   <span>Draft → Edit freely</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                   <span>Sent → Awaiting acknowledgment</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                   <span>Acknowledged → Ready for payment</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                   <span>Paid → Completed</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
````

## File: bill-app/frontend/src/pages/invoices.tsx
````typescript
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  Send, 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  User, 
  Package, 
  MessageSquare,
  Hash,
  X,
  Copy,
  ExternalLink,
  AlertCircle,
  Clock,
  Ban,
  RefreshCw,
  Plus,
  Filter,
  Inbox,
  Archive,
  Trash2,
  Receipt,
  HandHeart
} from 'lucide-react';
import { 
  useGetInvoice,
  useGetAllInvoicesForAddress,
  useGetInvoicesByCreator,
  useGetInvoicesByRecipient,
  validateStellarAddress,
  convertStroopsToUsdc,
  useAcknowledgeInvoice,
  usePayInvoiceWithUsdcTransfer,
  useApproveUsdcSpending
} from '../hooks/useContract';
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  LOBSTR_ID,
  FreighterModule,
  LobstrModule
} from '@creit.tech/stellar-wallets-kit';

// Enhanced wallet setup
const createWalletKit = () => {
  return new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: LOBSTR_ID,
    modules: [
      new FreighterModule(),
      new LobstrModule()
    ],
  });
};

const kit = createWalletKit();

// Enhanced transaction signing
const signTransactionSafely = async (transactionXdr: string, walletAddress: string) => {
  try {
    console.log('🔐 Signing transaction...');
    const networkPassphrase = 'Test SDF Network ; September 2015';
    const result = await kit.signTransaction(transactionXdr, {
      address: walletAddress,
      networkPassphrase: networkPassphrase
    });
    console.log('✅ Transaction signed successfully');
    return result;
  } catch (error: any) {
    console.error('❌ Signing error:', error);
    if (error.message?.includes('could not be cloned')) {
      try {
        console.log('🔄 Trying alternative signing method...');
        const result = await kit.signTransaction(transactionXdr);
        console.log('✅ Alternative signing successful');
        return result;
      } catch (alternativeError) {
        console.error('❌ Alternative signing also failed:', alternativeError);
        throw new Error('Transaction signing failed: Wallet communication error. Please try refreshing the page and reconnecting your wallet.');
      }
    }
    throw error;
  }
};

// Enhanced transaction submission
const submitTransaction = async (signedXdr: string) => {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`📤 Submitting transaction (attempt ${retryCount + 1}/${maxRetries})`);
      
      const response = await fetch('https://soroban-testnet.stellar.org/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Name': 'billr-invoice-app',
          'X-Client-Version': '2.0.0'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'sendTransaction',
          params: {
            transaction: signedXdr
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Stellar RPC Error: ${result.error.message}`);
      }

      console.log('✅ Transaction submitted successfully:', result);
      return result;
      
    } catch (error: any) {
      retryCount++;
      console.error(`❌ Submission attempt ${retryCount} failed:`, error);
      
      if (retryCount >= maxRetries) {
        throw new Error(`Transaction submission failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
};

// Enhanced wallet hook
function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const storedAddress = localStorage.getItem('stellar-wallet-address');
        if (storedAddress && validateStellarAddress(storedAddress)) {
          setAddress(storedAddress);
          setConnected(true);
        }
      } catch (error) {
        console.log('No previous wallet connection found');
      }
    };
    
    checkConnection();
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setAddress(address);
            setConnected(true);
            localStorage.setItem('stellar-wallet-address', address);
            localStorage.setItem('stellar-wallet-id', option.id);
          } catch (error) {
            console.error('Failed to get address:', error);
            throw error;
          }
        }
      });
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet: ' + (error.message || error));
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await kit.disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setAddress(null);
      setConnected(false);
      localStorage.removeItem('stellar-wallet-address');
      localStorage.removeItem('stellar-wallet-id');
    }
  };

  return { address, connected, connecting, connect, disconnect };
}

// Enhanced Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Draft':
        return { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock, border: 'border-orange-200' };
      case 'Sent':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Send, border: 'border-blue-200' };
      case 'Acknowledged':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: CheckCircle, border: 'border-yellow-200' };
      case 'Paid':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: DollarSign, border: 'border-green-200' };
      case 'Cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: Ban, border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, border: 'border-gray-200' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-4 h-4 mr-2" />
      {status}
    </span>
  );
};

// Copy to clipboard utility
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Enhanced Invoice Modal
const InvoiceModal = ({ 
  invoiceId, 
  isOpen, 
  onClose, 
  walletAddress,
  onRefresh 
}: { 
  invoiceId: string | null; 
  isOpen: boolean; 
  onClose: () => void;
  walletAddress: string | null;
  onRefresh: () => void;
}) => {
  const { mutate: getInvoice, loading, error } = useGetInvoice();
  const { mutate: acknowledgeInvoice, loading: acknowledging } = useAcknowledgeInvoice();
  const { mutate: payInvoiceWithUsdcTransfer, loading: paying } = usePayInvoiceWithUsdcTransfer();
  const { mutate: approveUsdc, loading: approving, error: approveError } = useApproveUsdcSpending();
  const [trustlineStep, setTrustlineStep] = useState<null | { tx: any }> (null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [approvalStep, setApprovalStep] = useState<'idle' | 'approving' | 'approved'>('idle');
  const [approveMessage, setApproveMessage] = useState<string | null>(null);

  // Helper to convert invoice amount to stroops
  const getInvoiceAmountStroops = () => {
    if (!invoiceData) return '0';
    return invoiceData.amount;
  };

  const handleApprove = async () => {
    setActionError(null);
    setApproveMessage(null);
    if (!walletAddress || !invoiceData) return;
    try {
      setApprovalStep('approving');
      setApproveMessage('Preparing approval transaction...');
      const approveTx = await approveUsdc({
        owner: walletAddress,
        amount: getInvoiceAmountStroops(),
      });
      //log the steps
      console.log('🔍 Approval step:', approvalStep);
      const { signedTxXdr } = await signTransactionSafely(approveTx.raw, walletAddress);
      await submitTransaction(signedTxXdr);
      setApproveMessage('Approval successful! You can now pay the invoice.');
      setApprovalStep('approved');
    } catch (err: any) {
      setActionError(err.message);
      setApprovalStep('idle');
    }
  };

  const refreshInvoice = async () => {
    if (invoiceId && walletAddress) {
      try {
        const data = await getInvoice(invoiceId, walletAddress);
        setInvoiceData(data);
      } catch (err) {
        // error handled by hook
      }
    }
  };

  useEffect(() => {
    if (isOpen && invoiceId && walletAddress) {
      refreshInvoice();
      setActionError(null);
      setSuccessMessage(null);
    }
    // eslint-disable-next-line
  }, [isOpen, invoiceId, walletAddress]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Enhanced action handlers with transaction signing
  const handleSend = async () => {
    setActionError(null);
    if (!walletAddress || !invoiceData) return;
    try {
      const result = await acknowledgeInvoice({
        recipient: walletAddress,
        invoiceId: invoiceData.invoice_id
      });
      
      const { signedTxXdr } = await signTransactionSafely(result.raw, walletAddress);
      await submitTransaction(signedTxXdr);
      
      setSuccessMessage('Invoice sent successfully!');
      await refreshInvoice();
      onRefresh();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAcknowledge = async () => {
    setActionError(null);
    if (!walletAddress || !invoiceData) return;
    try {
      const result = await acknowledgeInvoice({
        recipient: walletAddress,
        invoiceId: invoiceData.invoice_id
      });

      const { signedTxXdr } = await signTransactionSafely(result.raw, walletAddress);
      await submitTransaction(signedTxXdr);
      
      setSuccessMessage('Invoice acknowledged successfully!');
      await refreshInvoice();
      onRefresh();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handlePay = async () => {
    setActionError(null);
    if (!walletAddress || !invoiceData) return;
    // await handleApprove();
    try {
      setSuccessMessage('Preparing payment transaction...');
      const payTx = await payInvoiceWithUsdcTransfer({
        recipient: walletAddress,
        invoiceId: invoiceData.invoice_id,
        invoice: invoiceData
      });
      const { signedTxXdr } = await signTransactionSafely(payTx.raw, walletAddress);
      await submitTransaction(signedTxXdr);
      setSuccessMessage('Payment completed successfully!');
      await refreshInvoice();
      onRefresh();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAcknowledgeAndPay = async () => {
    setActionError(null);
    if (!walletAddress || !invoiceData) return;
    if (approvalStep !== 'approved') {
      setActionError('Please approve USDC spending before paying.');
      return;
    }
    try {
      // First acknowledge
      const ackResult = await acknowledgeInvoice({
        recipient: walletAddress,
        invoiceId: invoiceData.invoice_id
      });

      const { signedTxXdr: ackSignedXdr } = await signTransactionSafely(ackResult.raw, walletAddress);
      await submitTransaction(ackSignedXdr);

      // Then pay
      const payResult = await payInvoiceWithUsdcTransfer({
        recipient: walletAddress,
        invoiceId: invoiceData.invoice_id,
        invoice: invoiceData
      });

      const { signedTxXdr: paySignedXdr } = await signTransactionSafely(payResult.raw, walletAddress);
      await submitTransaction(paySignedXdr);
      
      setSuccessMessage('Invoice acknowledged and paid successfully!');
      await refreshInvoice();
      onRefresh();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Role/status logic
  const isCreator = invoiceData && walletAddress === invoiceData.creator;
  const isRecipient = invoiceData && walletAddress === invoiceData.recipient;
  let status = invoiceData?.status;
  if (Array.isArray(status)) status = status[0];

  // Button visibility logic
  const showSend = isCreator && status === 'Draft';
  const showDelete = isCreator && status === 'Draft'; // Only draft invoices can be "deleted" (cancelled)
  const showAcknowledge = isRecipient && status === 'Sent';
  const showAcknowledgeAndPay = isRecipient && status === 'Sent';
  const showPay = isRecipient && status === 'Acknowledged';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Success Message */}
        {successMessage && (
          <div className="absolute top-4 right-4 z-50 max-w-sm">
            <div className="bg-green-100 border border-green-300 rounded-xl p-4 shadow-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <Receipt className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Invoice Details</h2>
              <p className="text-white/80 text-sm">Blockchain Invoice Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mr-4" />
              <span className="text-xl font-medium text-gray-700">Loading invoice...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-3">Failed to Load Invoice</h3>
              <p className="text-red-700 mb-6 text-lg">{error.message}</p>
              <button
                onClick={refreshInvoice}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {invoiceData && (
            <div className="space-y-8">
              {/* Enhanced Invoice Header */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 rounded-3xl p-8 border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-800 mb-3 flex items-center">
                      <Hash className="h-10 w-10 mr-3 text-blue-600" />
                      {invoiceId}
                    </h3>
                    <StatusBadge status={invoiceData.status || 'Unknown'} />
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      ${convertStroopsToUsdc(invoiceData.amount || '0')} 
                    </div>
                    <div className="text-2xl font-semibold text-blue-600">USDC</div>
                    <div className="text-lg text-gray-600 mt-1">Amount Due</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <User className="h-6 w-6 mr-3" />
                    From (Creator)
                  </h4>
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-blue-900 break-all">
                      {invoiceData.creator ? 
                        `${invoiceData.creator.slice(0, 16)}...${invoiceData.creator.slice(-16)}` : 
                        'Unknown'
                      }
                    </code>
                    <button
                      onClick={() => invoiceData.creator && handleCopy(invoiceData.creator, 'creator')}
                      className="ml-3 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      {copied === 'creator' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <h4 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                    <User className="h-6 w-6 mr-3" />
                    To (Recipient)
                  </h4>
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono text-orange-900 break-all">
                      {invoiceData.recipient ? 
                        `${invoiceData.recipient.slice(0, 16)}...${invoiceData.recipient.slice(-16)}` : 
                        'Unknown'
                      }
                    </code>
                    <button
                      onClick={() => invoiceData.recipient && handleCopy(invoiceData.recipient, 'recipient')}
                      className="ml-3 p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-200 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      {copied === 'recipient' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Timeline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <Calendar className="h-6 w-6 mr-3" />
                  Timeline
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600 font-medium">Created:</span>
                    <span className="text-gray-800">
                      {invoiceData.created_at ? 
                        new Date(parseInt(invoiceData.created_at)).toLocaleString() : 
                        'Unknown'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600 font-medium">Last Updated:</span>
                    <span className="text-gray-800">
                      {invoiceData.last_updated ? 
                        new Date(parseInt(invoiceData.last_updated)).toLocaleString() : 
                        'Unknown'
                      }
                    </span>
                  </div>
                  {invoiceData.paid_at && (
                    <div className="flex justify-between items-center text-lg border-t pt-4">
                      <span className="text-green-600 font-semibold">Paid:</span>
                      <span className="text-green-600 font-semibold">
                        {new Date(parseInt(invoiceData.paid_at)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              {/* DEBUG OUTPUT: Remove after fixing! */}
              <pre className="bg-gray-100 p-4 rounded-xl text-xs mb-4 overflow-x-auto">
                {JSON.stringify({
                  walletAddress,
                  creator: invoiceData.creator,
                  recipient: invoiceData.recipient,
                  status: invoiceData.status,
                  isCreator,
                  isRecipient,
                  showSend,
                  showDelete,
                  showAcknowledge,
                  showAcknowledgeAndPay,
                  showPay
                }, null, 2)}
              </pre>
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">Available Actions</h4>
                <div className="flex flex-wrap gap-4">
                  {showSend && (
                    <button
                      onClick={handleSend}
                      disabled={acknowledging}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none text-lg"
                    >
                      {acknowledging ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Invoice
                        </>
                      )}
                    </button>
                  )}

                  {showDelete && (
                    <button
                      onClick={() => alert('Delete functionality not implemented yet')}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 text-lg"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Draft
                    </button>
                  )}

                  {showAcknowledge && (
                    <button
                      onClick={handleAcknowledge}
                      disabled={acknowledging}
                      className="flex items-center bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none text-lg"
                    >
                      {acknowledging ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Acknowledging...
                        </>
                      ) : (
                        <>
                          <HandHeart className="w-5 h-5 mr-2" />
                          Acknowledge
                        </>
                      )}
                    </button>
                  )}

                  {showAcknowledgeAndPay && (
                    <button
                      onClick={handleAcknowledgeAndPay}
                      disabled={acknowledging || paying}
                      className="flex items-center bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none text-lg"
                    >
                      {acknowledging || paying ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5 mr-2" />
                          Acknowledge & Pay
                        </>
                      )}
                    </button>
                  )}

                  {showPay && (
                    <button
                      onClick={handlePay}
                      disabled={paying || approving}
                      className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none text-lg"
                    >
                      {(paying || approving) ? (approving ? 'Approving...' : 'Paying...') : 'Pay Invoice'}
                    </button>
                  )}
                </div>

                {actionError && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">{actionError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Modal Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
          >
            Close
          </button>
          {invoiceData && (
            <a 
              href={`https://stellar.expert/explorer/testnet/account/${invoiceData.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center font-semibold text-lg transform hover:scale-105"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              View on Stellar Expert
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Invoice Card Component
const InvoiceCard = ({ 
  invoice, 
  onClick, 
  isCreated 
}: { 
  invoice: any; 
  onClick: () => void;
  isCreated: boolean;
}) => {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer hover:border-blue-300 hover:bg-white/90 transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
            <Hash className="h-7 w-7 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-1">{invoice.invoice_id}</h4>
            <p className="text-base text-gray-600">
              {isCreated ? 'Sent to' : 'Received from'}: {
                (isCreated ? invoice.recipient : invoice.creator).slice(0, 10)
              }...
            </p>
          </div>
        </div>
        <div className="text-right">
         <StatusBadge status={invoice.status} />
         <div className="text-2xl font-bold text-gray-800 mt-3">
           ${convertStroopsToUsdc(invoice.amount || '0')} USDC
         </div>
       </div>
     </div>
     
     {invoice.metadata?.description && (
       <p className="text-base text-gray-600 mb-4 line-clamp-2 bg-gray-50 p-3 rounded-lg">
         {invoice.metadata.description}
       </p>
     )}
     
     <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
       <span className="font-medium">
         Created: {new Date(parseInt(invoice.created_at)).toLocaleDateString()}
       </span>
       <div className="flex items-center text-blue-600">
         <Eye className="h-4 w-4 mr-1" />
         <span className="font-medium">View Details</span>
       </div>
     </div>
   </div>
 );
};

// Main View Invoices Component
export default function ViewInvoicesPage() {
 const wallet = useWallet();
 const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentTab, setCurrentTab] = useState<'all' | 'created' | 'received'>('all');
 const [invoicesData, setInvoicesData] = useState<any>(null);
 const [loading, setLoading] = useState(false);
 
 // Hooks for fetching invoice data
 const { mutate: getAllInvoices, loading: loadingAll, error: errorAll } = useGetAllInvoicesForAddress();
 const { mutate: getCreatedInvoices, loading: loadingCreated, error: errorCreated } = useGetInvoicesByCreator();
 const { mutate: getReceivedInvoices, loading: loadingReceived, error: errorReceived } = useGetInvoicesByRecipient();

 // Fetch invoices when wallet connects
 useEffect(() => {
   if (wallet.address && currentTab === 'all') {
     fetchAllInvoices();
   } else if (wallet.address && currentTab === 'created') {
     fetchCreatedInvoices();
   } else if (wallet.address && currentTab === 'received') {
     fetchReceivedInvoices();
   }
 }, [wallet.address, currentTab]);

 const fetchAllInvoices = async () => {
   if (!wallet.address) return;
   setLoading(true);
   try {
     const data = await getAllInvoices(wallet.address, wallet.address);
     console.log('📋 All invoices data:', data);
     setInvoicesData(data);
   } catch (error) {
     console.error('❌ Failed to fetch all invoices:', error);
   } finally {
     setLoading(false);
   }
 };

 const fetchCreatedInvoices = async () => {
   if (!wallet.address) return;
   setLoading(true);
   try {
     const data = await getCreatedInvoices(wallet.address, wallet.address);
     console.log('📤 Created invoices data:', data);
     setInvoicesData({ created: data, received: [] });
   } catch (error) {
     console.error('❌ Failed to fetch created invoices:', error);
   } finally {
     setLoading(false);
   }
 };

 const fetchReceivedInvoices = async () => {
   if (!wallet.address) return;
   setLoading(true);
   try {
     const data = await getReceivedInvoices(wallet.address, wallet.address);
     console.log('📬 Received invoices data:', data);
     setInvoicesData({ created: [], received: data });
   } catch (error) {
     console.error('❌ Failed to fetch received invoices:', error);
   } finally {
     setLoading(false);
   }
 };

 const handleViewInvoice = (invoiceId: string) => {
   setSelectedInvoiceId(invoiceId);
   setIsModalOpen(true);
 };

 const refreshData = () => {
   if (currentTab === 'all') fetchAllInvoices();
   else if (currentTab === 'created') fetchCreatedInvoices();
   else fetchReceivedInvoices();
 };

 const getDisplayInvoices = () => {
   if (!invoicesData) return { created: [], received: [] };
   
   if (currentTab === 'created') {
     return { created: invoicesData.created || invoicesData || [], received: [] };
   } else if (currentTab === 'received') {
     return { created: [], received: invoicesData.received || invoicesData || [] };
   } else {
     return {
       created: invoicesData.created || [],
       received: invoicesData.received || []
     };
   }
 };

 const displayData = getDisplayInvoices();
 const allInvoices = [...displayData.created, ...displayData.received];

 return (
   <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
     {/* Enhanced Navigation */}
     <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center py-6">
           <div className="flex items-center">
             <button className="mr-6 p-3 rounded-xl hover:bg-gray-100 transition-colors">
               <ArrowLeft className="h-6 w-6 text-gray-600" />
             </button>
             <div className="flex items-center">
               <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                 <FileText className="h-8 w-8 text-white" />
               </div>
               <div className="ml-4">
                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                   Billr
                 </h1>
                 <p className="text-sm text-gray-600">Blockchain Invoice Management</p>
               </div>
             </div>
           </div>
           <div className="text-base text-gray-500">
             {wallet.address ? (
               <div className="flex items-center space-x-4">
                 <div className="flex items-center bg-green-100 px-4 py-2 rounded-xl">
                   <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                   <span className="text-green-800 font-semibold">Connected</span>
                 </div>
                 <span className="font-mono text-lg">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</span>
                 <button
                   onClick={wallet.disconnect}
                   className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                 >
                   Disconnect
                 </button>
               </div>
             ) : (
               <button
                 className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
                 onClick={wallet.connect}
                 disabled={wallet.connecting}
               >
                 {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
               </button>
             )}
           </div>
         </div>
       </div>
     </nav>

     {/* Main Content */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
       {/* Enhanced Page Header */}
       <div className="mb-10 text-center">
         <h2 className="text-4xl font-bold text-gray-800 mb-4">My Invoice Dashboard</h2>
         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
           View, manage, and track your blockchain invoices with complete transparency
         </p>
       </div>

       {/* Enhanced Stats Cards - Moved Above */}
       {!loading && invoicesData && allInvoices.length > 0 && (
         <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center border border-blue-300">
             <div className="text-3xl font-bold text-blue-800 mb-2">{displayData.created.length}</div>
             <div className="text-lg font-semibold text-blue-700">Created</div>
           </div>
           <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 text-center border border-green-300">
             <div className="text-3xl font-bold text-green-800 mb-2">{displayData.received.length}</div>
             <div className="text-lg font-semibold text-green-700">Received</div>
           </div>
           <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 text-center border border-yellow-300">
             <div className="text-3xl font-bold text-yellow-800 mb-2">
               {allInvoices.filter(inv => inv.status === 'Paid').length}
             </div>
             <div className="text-lg font-semibold text-yellow-700">Paid</div>
           </div>
           <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 text-center border border-orange-300">
             <div className="text-3xl font-bold text-orange-800 mb-2">
               {allInvoices.filter(inv => ['Sent', 'Acknowledged'].includes(inv.status)).length}
             </div>
             <div className="text-lg font-semibold text-orange-700">Pending</div>
           </div>
         </div>
       )}

       {/* Wallet Connection Warning */}
       {!wallet.address && (
         <div className="mb-10 p-8 bg-yellow-100 border border-yellow-300 rounded-2xl text-yellow-800 text-center">
           <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
           <h3 className="text-2xl font-semibold mb-2">Wallet Connection Required</h3>
           <p className="text-lg">Please connect your wallet to view and manage invoices.</p>
         </div>
       )}

       {wallet.address && (
         <>
           {/* Enhanced Filter Tabs */}
           <div className="mb-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
             <div className="flex">
               <button
                 onClick={() => setCurrentTab('all')}
                 className={`flex-1 px-8 py-6 text-center font-semibold transition-all flex items-center justify-center text-lg ${
                   currentTab === 'all'
                     ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <Archive className="h-6 w-6 mr-3" />
                 All Invoices ({allInvoices.length})
               </button>
               <button
                 onClick={() => setCurrentTab('created')}
                 className={`flex-1 px-8 py-6 text-center font-semibold transition-all flex items-center justify-center text-lg ${
                   currentTab === 'created'
                     ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <Send className="h-6 w-6 mr-3" />
                 Created ({displayData.created.length})
               </button>
               <button
                 onClick={() => setCurrentTab('received')}
                 className={`flex-1 px-8 py-6 text-center font-semibold transition-all flex items-center justify-center text-lg ${
                   currentTab === 'received'
                     ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <Inbox className="h-6 w-6 mr-3" />
                 Received ({displayData.received.length})
               </button>
             </div>
           </div>

           {/* Loading State */}
           {loading && (
             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 border border-gray-200 text-center">
               <RefreshCw className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
               <h3 className="text-2xl font-semibold text-gray-700 mb-4">Loading Invoices...</h3>
               <p className="text-lg text-gray-500">Fetching your invoices from the blockchain</p>
             </div>
           )}

           {/* Error State */}
           {(errorAll || errorCreated || errorReceived) && !loading && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
               <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
               <h3 className="text-2xl font-semibold text-red-800 mb-4">Failed to Load Invoices</h3>
               <p className="text-lg text-red-700 mb-6">
                 {errorAll?.message || errorCreated?.message || errorReceived?.message}
               </p>
               <button
                 onClick={refreshData}
                 className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold text-lg"
               >
                 Try Again
               </button>
             </div>
           )}

           {/* Enhanced Invoices Grid */}
           {!loading && !errorAll && !errorCreated && !errorReceived && (
             <>
               {allInvoices.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
                   {currentTab === 'all' && (
                     <>
                       {displayData.created.map((invoice: any) => (
                         <InvoiceCard
                           key={`created-${invoice.invoice_id}`}
                           invoice={invoice}
                           onClick={() => handleViewInvoice(invoice.invoice_id)}
                           isCreated={true}
                         />
                       ))}
                       {displayData.received.map((invoice: any) => (
                         <InvoiceCard
                           key={`received-${invoice.invoice_id}`}
                           invoice={invoice}
                           onClick={() => handleViewInvoice(invoice.invoice_id)}
                           isCreated={false}
                         />
                       ))}
                     </>
                   )}
                   
                   {currentTab === 'created' && displayData.created.map((invoice: any) => (
                     <InvoiceCard
                       key={invoice.invoice_id}
                       invoice={invoice}
                       onClick={() => handleViewInvoice(invoice.invoice_id)}
                       isCreated={true}
                     />
                   ))}
                   
                   {currentTab === 'received' && displayData.received.map((invoice: any) => (
                     <InvoiceCard
                       key={invoice.invoice_id}
                       invoice={invoice}
                       onClick={() => handleViewInvoice(invoice.invoice_id)}
                       isCreated={false}
                     />
                   ))}
                 </div>
               ) : (
                 <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 border border-gray-200 text-center">
                   <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                   <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                     No {currentTab === 'all' ? '' : currentTab} Invoices Found
                   </h3>
                   <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                     {currentTab === 'created' 
                       ? 'You haven\'t created any invoices yet. Start by creating your first blockchain invoice.'
                       : currentTab === 'received'
                       ? 'You haven\'t received any invoices yet. Invoices sent to your wallet will appear here.'
                       : 'You don\'t have any invoices yet. Create your first invoice to get started.'
                     }
                   </p>
                   <button
                     onClick={() => window.location.href = '/create'}
                     className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
                   >
                     Create Your First Invoice
                   </button>
                 </div>
               )}
             </>
           )}

           {/* Enhanced Refresh Button */}
           <div className="text-center">
             <button
               onClick={refreshData}
               disabled={loading}
               className="bg-white/80 hover:bg-white disabled:bg-gray-100 text-gray-700 disabled:text-gray-400 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 transition-all hover:border-blue-300 hover:shadow-xl disabled:hover:border-gray-200 disabled:hover:shadow-none flex items-center mx-auto disabled:cursor-not-allowed text-lg backdrop-blur-sm"
             >
               <RefreshCw className={`h-6 w-6 mr-3 ${loading ? 'animate-spin' : ''}`} />
               {loading ? 'Refreshing...' : 'Refresh Invoices'}
             </button>
           </div>
         </>
       )}
     </div>

     {/* Enhanced Invoice Modal */}
     <InvoiceModal 
       invoiceId={selectedInvoiceId}
       isOpen={isModalOpen}
       onClose={() => {
         setIsModalOpen(false);
         setSelectedInvoiceId(null);
       }}
       walletAddress={wallet.address}
       onRefresh={refreshData}
     />
   </div>
 );
}
````

## File: bill-app/frontend/src/pages/welcome.tsx
````typescript
import { ArrowRight, FileText, CreditCard, CheckCircle, Users, Shield, Zap, Star, TrendingUp, Github } from 'lucide-react';
import Header from '../components/Header';

export default function WelcomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Powered by Soroban
            </div>
            <h2 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Invoice
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                {" "}Smarter
              </span>
              <br />
              Get Paid
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
                {" "}Faster
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create professional invoices on the blockchain, track payments in real-time, 
              and receive instant USDC payments. The future of invoicing is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center transition-all transform hover:scale-105 shadow-xl">
                Launch App
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 transition-all hover:border-blue-300 hover:shadow-lg">
                View Demo
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg"></div>
                    <span className="ml-2 font-semibold text-gray-800">Invoice #001</span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Paid
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-800">$1,250 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">✓ Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="text-blue-600 font-medium">Instant</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-orange-100 rounded-full p-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Contribution Notice */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mb-8">
          <p className="text-lg text-blue-800 font-semibold mb-2">
            Built for Stellar ✦
          </p>
          <p className="text-gray-700 flex flex-col items-center justify-center gap-2">
            <span className="flex items-center justify-center gap-2">
              <Github className="w-5 h-5 text-gray-800" />
              Contribute to Billr on GitHub by forking the project:
              <a
                href="https://github.com/Olisehgenesis/billr-stella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline ml-1"
              >
                github.com/Olisehgenesis/billr-stella
              </a>
            </span>
            <span>Thank you!</span>
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Instant</div>
              <p className="text-gray-600">USDC Payments</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">100%</div>
              <p className="text-gray-600">Blockchain Security</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Available Always</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Everything You Need</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for modern businesses who want fast, secure, and transparent invoicing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Smart Invoices</h4>
            <p className="text-gray-600 leading-relaxed">
              Create professional invoices with custom metadata, automatic status tracking, and blockchain verification.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Instant USDC</h4>
            <p className="text-gray-600 leading-relaxed">
              Get paid immediately in USDC. No waiting periods, no intermediaries, just direct wallet-to-wallet transfers.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Status Tracking</h4>
            <p className="text-gray-600 leading-relaxed">
              Real-time updates from draft to paid. Recipients can acknowledge invoices with personalized notes.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Multi-User</h4>
            <p className="text-gray-600 leading-relaxed">
              Separate dashboards for creators and recipients. Manage all invoices from one central location.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Blockchain Secure</h4>
            <p className="text-gray-600 leading-relaxed">
              Built on Soroban smart contracts. Immutable records, transparent transactions, enterprise-grade security.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Live Updates</h4>
            <p className="text-gray-600 leading-relaxed">
              Edit drafts, update metadata, cancel when needed. Full control with real-time blockchain updates.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-12">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Simple 4-Step Process</h3>
            <p className="text-xl text-gray-600">From creation to payment in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Create</h4>
              <p className="text-gray-600">Set up your invoice with recipient and amount details</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Send</h4>
              <p className="text-gray-600">Share directly on the blockchain to your recipient</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Acknowledge</h4>
              <p className="text-gray-600">Recipient confirms and acknowledges the invoice</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-bold text-2xl">4</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Get Paid</h4>
              <p className="text-gray-600">Receive instant USDC payment to your wallet</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-gray-100">
            <h3 className="text-5xl font-bold text-gray-800 mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the future of invoicing. Create your first blockchain invoice in under 2 minutes 
              and experience the power of instant USDC payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl">
                Launch Billr Now
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-12 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Billr
                </span>
                <p className="text-xs text-gray-500">Blockchain Invoicing Platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 mb-1">
                © 2025 Billr. Built on Soroban.
              </p>
              <p className="text-sm text-gray-500">
                Secure • Fast • Transparent
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
````

## File: bill-app/frontend/src/App.css
````css
@import "tailwindcss";
body {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
}

#root {
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

/* Floating background element animations for WelcomePage */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-1deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 10s ease-in-out infinite;
}
````

## File: bill-app/frontend/src/App.tsx
````typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/welcome';
import CreateInvoicePage from './pages/create';
import ViewInvoicesPage from './pages/invoices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/app/create" element={<CreateInvoicePage />} />
        <Route path="/app/invoices" element={<ViewInvoicesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
````

## File: bill-app/frontend/src/global.d.ts
````typescript
declare module '*.css';
````

## File: bill-app/frontend/src/main.tsx
````typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
````

## File: bill-app/frontend/src/types.ts
````typescript
// Type for invoice metadata key-value pair
export interface InvoiceMetadata {
  key: string;
  value: string;
}

// Type for invoice items
export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  vatRate: number;
}

// Type for the whole invoice
export interface Invoice {
  invoiceId: string;
  recipientAddress: string;
  amount: string;
  description: string;
  metadata: InvoiceMetadata[];
  includeItems: boolean;
  items: InvoiceItem[];
}
````

## File: bill-app/frontend/.gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

.vercel
````

## File: bill-app/frontend/eslint.config.js
````javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
````

## File: bill-app/frontend/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: bill-app/frontend/package.json
````json
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@creit.tech/stellar-wallets-kit": "^1.7.6",
    "@stellar/stellar-sdk": "^13.3.0",
    "@stellar/typescript-wallet-sdk": "^1.9.0",
    "@tailwindcss/vite": "^4.1.11",
    "framer-motion": "^12.23.6",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.7.0",
    "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.30.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react-swc": "^3.10.2",
    "eslint": "^9.30.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.35.1",
    "vite": "^7.0.4"
  }
}
````

## File: bill-app/frontend/README.md
````markdown
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
````

## File: bill-app/frontend/tsconfig.app.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
````

## File: bill-app/frontend/tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: bill-app/frontend/tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: bill-app/frontend/vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
})
````

## File: contracts/bilrr/contracts/bilrr/src/lib.rs
````rust
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, token, Address, Env, Map, String, Vec,
};

// Invoice status enumeration
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum InvoiceStatus {
    Draft,
    Sent,
    Acknowledged,
    Paid,
    Cancelled,
}

// Main invoice structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Invoice {
    pub invoice_id: String,
    pub creator: Address,
    pub recipient: Address,
    pub amount: u64,
    pub metadata: Map<String, String>,
    pub status: InvoiceStatus,
    pub created_at: u64,
    pub paid_at: Option<u64>,
    pub acknowledgment_note: Option<String>,
    pub last_updated: u64,
}

// Contract events
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceCreatedEvent {
    pub invoice_id: String,
    pub creator: Address,
    pub recipient: Address,
    pub amount: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceSentEvent {
    pub invoice_id: String,
    pub creator: Address,
    pub recipient: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoicePaidEvent {
    pub invoice_id: String,
    pub creator: Address,
    pub recipient: Address,
    pub amount: u64,
    pub paid_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceAcknowledgedEvent {
    pub invoice_id: String,
    pub recipient: Address,
    pub note: Option<String>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceCancelledEvent {
    pub invoice_id: String,
    pub creator: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceUpdatedEvent {
    pub invoice_id: String,
    pub creator: Address,
    pub updated_at: u64,
}

// Storage keys for efficient data organization
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Invoice(String),
    CreatorInvoices(Address),
    RecipientInvoices(Address),
    UsdcToken,
    Admin,
}

// Error types
#[contracterror]
#[derive(Clone, Debug, Copy, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum BillrError {
    InvoiceNotFound = 1,
    InvoiceAlreadyExists = 2,
    Unauthorized = 3,
    InvalidStatus = 4,
    InvoiceAlreadyPaid = 5,
    PaymentFailed = 6,
    InvalidAmount = 7,
    InvalidToken = 8,
}

#[contract]
pub struct BillrContract;

#[contractimpl]
impl BillrContract {
    /// Initialize the contract with USDC token address
    pub fn initialize(env: Env, admin: Address, usdc_token: Address) {
        admin.require_auth();
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
    }

    /// Create a new invoice in draft status
    pub fn create_invoice(
        env: Env,
        creator: Address,
        invoice_id: String,
        recipient: Address,
        amount: u64,
        metadata: Map<String, String>,
    ) -> Result<(), BillrError> {
        creator.require_auth();

        if amount == 0 {
            return Err(BillrError::InvalidAmount);
        }

        if env.storage().persistent().has(&DataKey::Invoice(invoice_id.clone())) {
            return Err(BillrError::InvoiceAlreadyExists);
        }

        let current_time = env.ledger().timestamp();

        let invoice = Invoice {
            invoice_id: invoice_id.clone(),
            creator: creator.clone(),
            recipient: recipient.clone(),
            amount,
            metadata,
            status: InvoiceStatus::Draft,
            created_at: current_time,
            paid_at: None,
            acknowledgment_note: None,
            last_updated: current_time,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        let mut creator_invoices: Vec<String> = env
            .storage()
            .persistent()
            .get(&DataKey::CreatorInvoices(creator.clone()))
            .unwrap_or(Vec::new(&env));
        creator_invoices.push_back(invoice_id.clone());
        env.storage()
            .persistent()
            .set(&DataKey::CreatorInvoices(creator.clone()), &creator_invoices);

        let mut recipient_invoices: Vec<String> = env
            .storage()
            .persistent()
            .get(&DataKey::RecipientInvoices(recipient.clone()))
            .unwrap_or(Vec::new(&env));
        recipient_invoices.push_back(invoice_id.clone());
        env.storage()
            .persistent()
            .set(&DataKey::RecipientInvoices(recipient.clone()), &recipient_invoices);

        env.events().publish(
            ("invoice_created",),
            InvoiceCreatedEvent {
                invoice_id,
                creator,
                recipient,
                amount,
            },
        );

        Ok(())
    }

    /// Send invoice
    pub fn send_invoice(env: Env, creator: Address, invoice_id: String) -> Result<(), BillrError> {
        creator.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.creator != creator {
            return Err(BillrError::Unauthorized);
        }

        if invoice.status != InvoiceStatus::Draft {
            return Err(BillrError::InvalidStatus);
        }

        invoice.status = InvoiceStatus::Sent;
        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_sent",),
            InvoiceSentEvent {
                invoice_id,
                creator,
                recipient: invoice.recipient,
            },
        );

        Ok(())
    }

    /// Acknowledge invoice
    pub fn acknowledge_invoice(
        env: Env, 
        recipient: Address, 
        invoice_id: String,
        note: Option<String>
    ) -> Result<(), BillrError> {
        recipient.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.recipient != recipient {
            return Err(BillrError::Unauthorized);
        }

        if invoice.status != InvoiceStatus::Sent {
            return Err(BillrError::InvalidStatus);
        }

        let current_time = env.ledger().timestamp();
        invoice.status = InvoiceStatus::Acknowledged;
        invoice.acknowledgment_note = note.clone();
        invoice.last_updated = current_time;
        
        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_acknowledged",),
            InvoiceAcknowledgedEvent {
                invoice_id,
                recipient,
                note,
            },
        );

        Ok(())
    }

    /// Pay invoice with USDC
    pub fn pay_invoice(env: Env, recipient: Address, invoice_id: String) -> Result<(), BillrError> {
        recipient.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.recipient != recipient {
            return Err(BillrError::Unauthorized);
        }

        match invoice.status {
            InvoiceStatus::Sent | InvoiceStatus::Acknowledged => {},
            InvoiceStatus::Paid => return Err(BillrError::InvoiceAlreadyPaid),
            _ => return Err(BillrError::InvalidStatus),
        }

        let usdc_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::UsdcToken)
            .ok_or(BillrError::InvalidToken)?;

        let token_client = token::Client::new(&env, &usdc_token);
        token_client.transfer(&recipient, &invoice.creator, &(invoice.amount as i128));

        let current_time = env.ledger().timestamp();
        invoice.status = InvoiceStatus::Paid;
        invoice.paid_at = Some(current_time);

        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_paid",),
            InvoicePaidEvent {
                invoice_id,
                creator: invoice.creator,
                recipient,
                amount: invoice.amount,
                paid_at: current_time,
            },
        );

        Ok(())
    }

    /// Cancel invoice
    pub fn cancel_invoice(env: Env, creator: Address, invoice_id: String) -> Result<(), BillrError> {
        creator.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.creator != creator {
            return Err(BillrError::Unauthorized);
        }

        if invoice.status == InvoiceStatus::Paid {
            return Err(BillrError::InvalidStatus);
        }

        invoice.status = InvoiceStatus::Cancelled;
        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_cancelled",),
            InvoiceCancelledEvent {
                invoice_id,
                creator,
            },
        );

        Ok(())
    }

    /// Update metadata
    pub fn update_metadata(
        env: Env,
        creator: Address,
        invoice_id: String,
        metadata: Map<String, String>,
    ) -> Result<(), BillrError> {
        creator.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.creator != creator {
            return Err(BillrError::Unauthorized);
        }

        match invoice.status {
            InvoiceStatus::Paid | InvoiceStatus::Cancelled => return Err(BillrError::InvalidStatus),
            _ => {},
        }

        let current_time = env.ledger().timestamp();
        invoice.metadata = metadata;
        invoice.last_updated = current_time;
        
        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_updated",),
            InvoiceUpdatedEvent {
                invoice_id,
                creator,
                updated_at: current_time,
            },
        );

        Ok(())
    }

    /// Edit invoice
    pub fn edit_invoice(
        env: Env,
        creator: Address,
        invoice_id: String,
        recipient: Option<Address>,
        amount: Option<u64>,
        metadata: Option<Map<String, String>>,
    ) -> Result<(), BillrError> {
        creator.require_auth();

        let mut invoice = Self::get_invoice_internal(&env, &invoice_id)?;

        if invoice.creator != creator {
            return Err(BillrError::Unauthorized);
        }

        if invoice.status != InvoiceStatus::Draft {
            return Err(BillrError::InvalidStatus);
        }

        let current_time = env.ledger().timestamp();
        
        if let Some(new_recipient) = recipient {
            if invoice.recipient != new_recipient {
                let old_recipient_invoices: Vec<String> = env // Removed mut
                    .storage()
                    .persistent()
                    .get(&DataKey::RecipientInvoices(invoice.recipient.clone()))
                    .unwrap_or(Vec::new(&env));
                
                let mut new_old_list = Vec::new(&env);
                for id in old_recipient_invoices.iter() {
                    if id != invoice_id {
                        new_old_list.push_back(id);
                    }
                }
                env.storage()
                    .persistent()
                    .set(&DataKey::RecipientInvoices(invoice.recipient.clone()), &new_old_list);

                let mut new_recipient_invoices: Vec<String> = env
                    .storage()
                    .persistent()
                    .get(&DataKey::RecipientInvoices(new_recipient.clone()))
                    .unwrap_or(Vec::new(&env));
                new_recipient_invoices.push_back(invoice_id.clone());
                env.storage()
                    .persistent()
                    .set(&DataKey::RecipientInvoices(new_recipient.clone()), &new_recipient_invoices);

                invoice.recipient = new_recipient;
            }
        }

        if let Some(new_amount) = amount {
            if new_amount == 0 {
                return Err(BillrError::InvalidAmount);
            }
            invoice.amount = new_amount;
        }

        if let Some(new_metadata) = metadata {
            invoice.metadata = new_metadata;
        }

        invoice.last_updated = current_time;
        
        env.storage()
            .persistent()
            .set(&DataKey::Invoice(invoice_id.clone()), &invoice);

        env.events().publish(
            ("invoice_updated",),
            InvoiceUpdatedEvent {
                invoice_id,
                creator,
                updated_at: current_time,
            },
        );

        Ok(())
    }

    /// Get invoice by ID
    pub fn get_invoice(env: Env, invoice_id: String) -> Option<Invoice> {
        env.storage()
            .persistent()
            .get(&DataKey::Invoice(invoice_id))
    }

    /// List invoices by creator (IDs only)
    pub fn list_by_creator(env: Env, creator: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::CreatorInvoices(creator))
            .unwrap_or(Vec::new(&env))
    }

    /// List invoices by recipient (IDs only)
    pub fn list_by_recipient(env: Env, recipient: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::RecipientInvoices(recipient))
            .unwrap_or(Vec::new(&env))
    }

    /// Get invoices by creator (full details) - FIXED NAME LENGTH
    pub fn get_invoices_by_creator(env: Env, creator: Address) -> Vec<Invoice> {
        let invoice_ids = Self::list_by_creator(env.clone(), creator);
        let mut invoices = Vec::new(&env);
        
        for invoice_id in invoice_ids.iter() {
            if let Some(invoice) = Self::get_invoice(env.clone(), invoice_id) {
                invoices.push_back(invoice);
            }
        }
        
        invoices
    }

    /// Get invoices by recipient (full details)
    pub fn get_invoices_by_recipient(env: Env, recipient: Address) -> Vec<Invoice> {
        let invoice_ids = Self::list_by_recipient(env.clone(), recipient);
        let mut invoices = Vec::new(&env);
        
        for invoice_id in invoice_ids.iter() {
            if let Some(invoice) = Self::get_invoice(env.clone(), invoice_id) {
                invoices.push_back(invoice);
            }
        }
        
        invoices
    }

    /// Get all invoices for address
    pub fn get_all_invoices_for_address(env: Env, address: Address) -> Map<String, Vec<Invoice>> {
        let mut result = Map::new(&env);
        
        let created_invoices = Self::get_invoices_by_creator(env.clone(), address.clone());
        result.set(String::from_str(&env, "created"), created_invoices);
        
        let received_invoices = Self::get_invoices_by_recipient(env.clone(), address);
        result.set(String::from_str(&env, "received"), received_invoices);
        
        result
    }

    /// Get pending invoices
    pub fn get_pending_invoices(env: Env, address: Address) -> Map<String, Vec<Invoice>> {
        let mut result = Map::new(&env);
        
        let created_invoices = Self::get_invoices_by_creator(env.clone(), address.clone());
        let mut pending_sent = Vec::new(&env);
        
        for invoice in created_invoices.iter() {
            match invoice.status {
                InvoiceStatus::Sent | InvoiceStatus::Acknowledged => {
                    pending_sent.push_back(invoice);
                }
                _ => {}
            }
        }
        result.set(String::from_str(&env, "awaiting_payment"), pending_sent);
        
        let received_invoices = Self::get_invoices_by_recipient(env.clone(), address);
        let mut pending_received = Vec::new(&env);
        
        for invoice in received_invoices.iter() {
            match invoice.status {
                InvoiceStatus::Sent | InvoiceStatus::Acknowledged => {
                    pending_received.push_back(invoice);
                }
                _ => {}
            }
        }
        result.set(String::from_str(&env, "pending_action"), pending_received);
        
        result
    }

    /// Get USDC token address
    pub fn get_usdc_token(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::UsdcToken)
    }

    /// Update USDC token address (admin only)
    pub fn update_usdc_token(env: Env, admin: Address, new_usdc_token: Address) -> Result<(), BillrError> {
        admin.require_auth();

        let stored_admin: Option<Address> = env.storage().instance().get(&DataKey::Admin);
        if stored_admin != Some(admin) {
            return Err(BillrError::Unauthorized);
        }

        env.storage()
            .instance()
            .set(&DataKey::UsdcToken, &new_usdc_token);

        Ok(())
    }

    /// Internal helper
    fn get_invoice_internal(env: &Env, invoice_id: &String) -> Result<Invoice, BillrError> {
        env.storage()
            .persistent()
            .get(&DataKey::Invoice(invoice_id.clone()))
            .ok_or(BillrError::InvoiceNotFound)
    }
}
````

## File: contracts/bilrr/contracts/bilrr/Cargo.toml
````toml
[package]
name = "billr-contract"
version = "0.1.0"
description = "Decentralized invoicing smart contract for Stellar Soroban"
authors = ["Your Name <your.email@example.com>"]
edition = "2021"
license = "MIT OR Apache-2.0"
keywords = ["soroban", "stellar", "invoicing", "smart-contract", "usdc"]
categories = ["cryptography::cryptocurrencies"]
publish = false

[lib]
crate-type = ["lib", "cdylib"]
doctest = false

[dependencies]
soroban-sdk = { workspace = true }

[dev-dependencies]
soroban-sdk = { workspace = true, features = ["testutils"] }

[features]
default = []
testutils = ["soroban-sdk/testutils"]
````

## File: contracts/bilrr/contracts/bilrr/Makefile
````
default: build

all: test

test: build
	cargo test

build:
	stellar contract build
	@ls -l target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

clean:
	cargo clean
````

## File: contracts/bilrr/src/lib/contracts/billr/src/index.ts
````typescript
import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAI4JQEMEZAUABKWFAWNEZWJFAGAHOC4EDAEMYDB6KQ5O4BEZZKJIKEA",
  }
} as const

export type InvoiceStatus = {tag: "Draft", values: void} | {tag: "Sent", values: void} | {tag: "Acknowledged", values: void} | {tag: "Paid", values: void} | {tag: "Cancelled", values: void};


export interface Invoice {
  acknowledgment_note: Option<string>;
  amount: u64;
  created_at: u64;
  creator: string;
  invoice_id: string;
  last_updated: u64;
  metadata: Map<string, string>;
  paid_at: Option<u64>;
  recipient: string;
  status: InvoiceStatus;
}


export interface InvoiceCreatedEvent {
  amount: u64;
  creator: string;
  invoice_id: string;
  recipient: string;
}


export interface InvoiceSentEvent {
  creator: string;
  invoice_id: string;
  recipient: string;
}


export interface InvoicePaidEvent {
  amount: u64;
  creator: string;
  invoice_id: string;
  paid_at: u64;
  recipient: string;
}


export interface InvoiceAcknowledgedEvent {
  invoice_id: string;
  note: Option<string>;
  recipient: string;
}


export interface InvoiceCancelledEvent {
  creator: string;
  invoice_id: string;
}


export interface InvoiceUpdatedEvent {
  creator: string;
  invoice_id: string;
  updated_at: u64;
}

export type DataKey = {tag: "Invoice", values: readonly [string]} | {tag: "CreatorInvoices", values: readonly [string]} | {tag: "RecipientInvoices", values: readonly [string]} | {tag: "UsdcToken", values: void} | {tag: "Admin", values: void};

export const BillrError = {
  1: {message:"InvoiceNotFound"},
  2: {message:"InvoiceAlreadyExists"},
  3: {message:"Unauthorized"},
  4: {message:"InvalidStatus"},
  5: {message:"InvoiceAlreadyPaid"},
  6: {message:"PaymentFailed"},
  7: {message:"InvalidAmount"},
  8: {message:"InvalidToken"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract with USDC token address
   */
  initialize: ({admin, usdc_token}: {admin: string, usdc_token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a new invoice in draft status
   */
  create_invoice: ({creator, invoice_id, recipient, amount, metadata}: {creator: string, invoice_id: string, recipient: string, amount: u64, metadata: Map<string, string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a send_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Send invoice (change status from Draft to Sent)
   */
  send_invoice: ({creator, invoice_id}: {creator: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a acknowledge_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Acknowledge invoice with optional custom note
   */
  acknowledge_invoice: ({recipient, invoice_id, note}: {recipient: string, invoice_id: string, note: Option<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a pay_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay invoice with USDC
   */
  pay_invoice: ({recipient, invoice_id}: {recipient: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a cancel_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Cancel invoice (only creator can cancel unpaid invoices)
   */
  cancel_invoice: ({creator, invoice_id}: {creator: string, invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a update_metadata transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update invoice metadata (only creator, only for unpaid invoices)
   */
  update_metadata: ({creator, invoice_id, metadata}: {creator: string, invoice_id: string, metadata: Map<string, string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a edit_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Edit invoice details (only creator, only for draft invoices)
   */
  edit_invoice: ({creator, invoice_id, recipient, amount, metadata}: {creator: string, invoice_id: string, recipient: Option<string>, amount: Option<u64>, metadata: Option<Map<string, string>>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get invoice by ID
   */
  get_invoice: ({invoice_id}: {invoice_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Invoice>>>

  /**
   * Construct and simulate a list_by_creator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * List all invoices created by an address
   */
  list_by_creator: ({creator}: {creator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a list_by_recipient transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * List all invoices for a recipient address
   */
  list_by_recipient: ({recipient}: {recipient: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a get_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get USDC token address
   */
  get_usdc_token: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a update_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update USDC token address (admin only)
   */
  update_usdc_token: ({admin, new_usdc_token}: {admin: string, new_usdc_token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAADUludm9pY2VTdGF0dXMAAAAAAAAFAAAAAAAAAAAAAAAFRHJhZnQAAAAAAAAAAAAAAAAAAARTZW50AAAAAAAAAAAAAAAMQWNrbm93bGVkZ2VkAAAAAAAAAAAAAAAEUGFpZAAAAAAAAAAAAAAACUNhbmNlbGxlZAAAAA==",
        "AAAAAQAAAAAAAAAAAAAAB0ludm9pY2UAAAAACgAAAAAAAAATYWNrbm93bGVkZ21lbnRfbm90ZQAAAAPoAAAAEAAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAADGxhc3RfdXBkYXRlZAAAAAYAAAAAAAAACG1ldGFkYXRhAAAD7AAAABAAAAAQAAAAAAAAAAdwYWlkX2F0AAAAA+gAAAAGAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAANSW52b2ljZVN0YXR1cwAAAA==",
        "AAAAAQAAAAAAAAAAAAAAE0ludm9pY2VDcmVhdGVkRXZlbnQAAAAABAAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEEludm9pY2VTZW50RXZlbnQAAAADAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACXJlY2lwaWVudAAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEEludm9pY2VQYWlkRXZlbnQAAAAFAAAAAAAAAAZhbW91bnQAAAAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAHcGFpZF9hdAAAAAAGAAAAAAAAAAlyZWNpcGllbnQAAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAGEludm9pY2VBY2tub3dsZWRnZWRFdmVudAAAAAMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAABG5vdGUAAAPoAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAFUludm9pY2VDYW5jZWxsZWRFdmVudAAAAAAAAAIAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAAE0ludm9pY2VVcGRhdGVkRXZlbnQAAAAAAwAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAAp1cGRhdGVkX2F0AAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAAB0ludm9pY2UAAAAAAQAAABAAAAABAAAAAAAAAA9DcmVhdG9ySW52b2ljZXMAAAAAAQAAABMAAAABAAAAAAAAABFSZWNpcGllbnRJbnZvaWNlcwAAAAAAAAEAAAATAAAAAAAAAAAAAAAJVXNkY1Rva2VuAAAAAAAAAAAAAAAAAAAFQWRtaW4AAAA=",
        "AAAABAAAAAAAAAAAAAAACkJpbGxyRXJyb3IAAAAAAAgAAAAAAAAAD0ludm9pY2VOb3RGb3VuZAAAAAABAAAAAAAAABRJbnZvaWNlQWxyZWFkeUV4aXN0cwAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAADUludmFsaWRTdGF0dXMAAAAAAAAEAAAAAAAAABJJbnZvaWNlQWxyZWFkeVBhaWQAAAAAAAUAAAAAAAAADVBheW1lbnRGYWlsZWQAAAAAAAAGAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAABwAAAAAAAAAMSW52YWxpZFRva2VuAAAACA==",
        "AAAAAAAAAC9Jbml0aWFsaXplIHRoZSBjb250cmFjdCB3aXRoIFVTREMgdG9rZW4gYWRkcmVzcwAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAp1c2RjX3Rva2VuAAAAAAATAAAAAA==",
        "AAAAAAAAACRDcmVhdGUgYSBuZXcgaW52b2ljZSBpbiBkcmFmdCBzdGF0dXMAAAAOY3JlYXRlX2ludm9pY2UAAAAAAAUAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAAGAAAAAAAAAAhtZXRhZGF0YQAAA+wAAAAQAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==",
        "AAAAAAAAAC9TZW5kIGludm9pY2UgKGNoYW5nZSBzdGF0dXMgZnJvbSBEcmFmdCB0byBTZW50KQAAAAAMc2VuZF9pbnZvaWNlAAAAAgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAAC1BY2tub3dsZWRnZSBpbnZvaWNlIHdpdGggb3B0aW9uYWwgY3VzdG9tIG5vdGUAAAAAAAATYWNrbm93bGVkZ2VfaW52b2ljZQAAAAADAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAARub3RlAAAD6AAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAApCaWxsckVycm9yAAA=",
        "AAAAAAAAABVQYXkgaW52b2ljZSB3aXRoIFVTREMAAAAAAAALcGF5X2ludm9pY2UAAAAAAgAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==",
        "AAAAAAAAADhDYW5jZWwgaW52b2ljZSAob25seSBjcmVhdG9yIGNhbiBjYW5jZWwgdW5wYWlkIGludm9pY2VzKQAAAA5jYW5jZWxfaW52b2ljZQAAAAAAAgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAAEBVcGRhdGUgaW52b2ljZSBtZXRhZGF0YSAob25seSBjcmVhdG9yLCBvbmx5IGZvciB1bnBhaWQgaW52b2ljZXMpAAAAD3VwZGF0ZV9tZXRhZGF0YQAAAAADAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAACmludm9pY2VfaWQAAAAAABAAAAAAAAAACG1ldGFkYXRhAAAD7AAAABAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAADxFZGl0IGludm9pY2UgZGV0YWlscyAob25seSBjcmVhdG9yLCBvbmx5IGZvciBkcmFmdCBpbnZvaWNlcykAAAAMZWRpdF9pbnZvaWNlAAAABQAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAAlyZWNpcGllbnQAAAAAAAPoAAAAEwAAAAAAAAAGYW1vdW50AAAAAAPoAAAABgAAAAAAAAAIbWV0YWRhdGEAAAPoAAAD7AAAABAAAAAQAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAKQmlsbHJFcnJvcgAA",
        "AAAAAAAAABFHZXQgaW52b2ljZSBieSBJRAAAAAAAAAtnZXRfaW52b2ljZQAAAAABAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+gAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAACdMaXN0IGFsbCBpbnZvaWNlcyBjcmVhdGVkIGJ5IGFuIGFkZHJlc3MAAAAAD2xpc3RfYnlfY3JlYXRvcgAAAAABAAAAAAAAAAdjcmVhdG9yAAAAABMAAAABAAAD6gAAABA=",
        "AAAAAAAAAClMaXN0IGFsbCBpbnZvaWNlcyBmb3IgYSByZWNpcGllbnQgYWRkcmVzcwAAAAAAABFsaXN0X2J5X3JlY2lwaWVudAAAAAAAAAEAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAABAAAD6gAAABA=",
        "AAAAAAAAABZHZXQgVVNEQyB0b2tlbiBhZGRyZXNzAAAAAAAOZ2V0X3VzZGNfdG9rZW4AAAAAAAAAAAABAAAD6AAAABM=",
        "AAAAAAAAACZVcGRhdGUgVVNEQyB0b2tlbiBhZGRyZXNzIChhZG1pbiBvbmx5KQAAAAAAEXVwZGF0ZV91c2RjX3Rva2VuAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAA5uZXdfdXNkY190b2tlbgAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACkJpbGxyRXJyb3IAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_invoice: this.txFromJSON<Result<void>>,
        send_invoice: this.txFromJSON<Result<void>>,
        acknowledge_invoice: this.txFromJSON<Result<void>>,
        pay_invoice: this.txFromJSON<Result<void>>,
        cancel_invoice: this.txFromJSON<Result<void>>,
        update_metadata: this.txFromJSON<Result<void>>,
        edit_invoice: this.txFromJSON<Result<void>>,
        get_invoice: this.txFromJSON<Option<Invoice>>,
        list_by_creator: this.txFromJSON<Array<string>>,
        list_by_recipient: this.txFromJSON<Array<string>>,
        get_usdc_token: this.txFromJSON<Option<string>>,
        update_usdc_token: this.txFromJSON<Result<void>>
  }
}
````

## File: contracts/bilrr/src/lib/contracts/billr/.gitignore
````
node_modules/
out/
````

## File: contracts/bilrr/src/lib/contracts/billr/package.json
````json
{
  "version": "0.0.0",
  "name": "billr",
  "type": "module",
  "exports": "./dist/index.js",
  "typings": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@stellar/stellar-sdk": "^13.x",
    "buffer": "6.0.3"
  },
  "devDependencies": {
    "typescript": "^5.6.2"
  }
}
````

## File: contracts/bilrr/src/lib/contracts/billr/README.md
````markdown
# billr JS

JS library for interacting with [Soroban](https://soroban.stellar.org/) smart contract `billr` via Soroban RPC.

This library was automatically generated by Soroban CLI using a command similar to:

```bash
soroban contract bindings ts \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  --contract-id CAI4JQEMEZAUABKWFAWNEZWJFAGAHOC4EDAEMYDB6KQ5O4BEZZKJIKEA \
  --output-dir ./path/to/billr
```

The network passphrase and contract ID are exported from [index.ts](./src/index.ts) in the `networks` constant. If you are the one who generated this library and you know that this contract is also deployed to other networks, feel free to update `networks` with other valid options. This will help your contract consumers use this library more easily.

# To publish or not to publish

This library is suitable for publishing to NPM. You can publish it to NPM using the `npm publish` command.

But you don't need to publish this library to NPM to use it. You can add it to your project's `package.json` using a file path:

```json
"dependencies": {
  "billr": "./path/to/this/folder"
}
```

However, we've actually encountered [frustration](https://github.com/stellar/soroban-example-dapp/pull/117#discussion_r1232873560) using local libraries with NPM in this way. Though it seems a bit messy, we suggest generating the library directly to your `node_modules` folder automatically after each install by using a `postinstall` script. We've had the least trouble with this approach. NPM will automatically remove what it sees as erroneous directories during the `install` step, and then regenerate them when it gets to your `postinstall` step, which will keep the library up-to-date with your contract.

```json
"scripts": {
  "postinstall": "soroban contract bindings ts --rpc-url https://soroban-testnet.stellar.org --network-passphrase \"Test SDF Network ; September 2015\" --id CAI4JQEMEZAUABKWFAWNEZWJFAGAHOC4EDAEMYDB6KQ5O4BEZZKJIKEA --name billr"
}
```

Obviously you need to adjust the above command based on the actual command you used to generate the library.

# Use it

Now that you have your library up-to-date and added to your project, you can import it in a file and see inline documentation for all of its exported methods:

```js
import { Contract, networks } from "billr"

const contract = new Contract({
  ...networks.futurenet, // for example; check which networks this library exports
  rpcUrl: '...', // use your own, or find one for testing at https://soroban.stellar.org/docs/reference/rpc#public-rpc-providers
})

contract.|
```

As long as your editor is configured to show JavaScript/TypeScript documentation, you can pause your typing at that `|` to get a list of all exports and inline-documentation for each. It exports a separate [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) function for each method in the smart contract, with documentation for each generated from the comments the contract's author included in the original source code.
````

## File: contracts/bilrr/src/lib/contracts/billr/tsconfig.json
````json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */
    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */
    /* Language and Environment */
    "target": "ESNext", /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */
    /* Modules */
    "module": "NodeNext", /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "nodenext", /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */
    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */
    /* Emit */
    "declaration": true, /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./dist", /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */
    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    // "esModuleInterop": true, /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    // "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
    /* Type Checking */
    // "strict": true, /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    "strictNullChecks": true, /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */
    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "include": [
    "src/*"
  ]
}
````

## File: contracts/bilrr/.gitignore
````
# Rust's output directory
target

# Local settings
.soroban
.stellar
````

## File: contracts/bilrr/Cargo.toml
````toml
[workspace]
resolver = "2"
members = [
  "contracts/*",
]

[workspace.dependencies]
soroban-sdk = "22.0.0"

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

# For more information about this profile see https://soroban.stellar.org/docs/basic-tutorials/logging#cargotoml-profile
[profile.release-with-logs]
inherits = "release"
debug-assertions = true
````

## File: contracts/bilrr/README.md
````markdown
# Soroban Project

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── hello_world
│       ├── src
│       │   ├── lib.rs
│       │   └── test.rs
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

- New Soroban contracts can be put in `contracts`, each in their own directory. There is already a `hello_world` contract in there to get you started.
- If you initialized this project with any other example contracts via `--with-example`, those contracts will be in the `contracts` directory as well.
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.
- Frontend libraries can be added to the top-level directory as well. If you initialized this project with a frontend template via `--frontend-template` you will have those files already included.
````

## File: .gitignore
````
node_modules
.env
.vercel
````

## File: package.json
````json
{
	"dependencies": {
		"buffer": "^6.0.3",
		"framer-motion": "^12.23.6",
		"lucide-react": "^0.525.0",
		"process": "^0.11.10",
		"util": "^0.12.5"
	},
	"devDependencies": {
		"@esbuild-plugins/node-globals-polyfill": "^0.2.3",
		"@esbuild-plugins/node-modules-polyfill": "^0.2.2"
	}
}
````
