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
    contractId: "CAVPRBSNLSMZ3DW7MZUFK7RCZKHO3LQS2LTJ3WBVILIQGEO4S4K3GGCZ",
  }
} as const

export const PayLinkError = {
  1: {message:"InsufficientBalance"},
  2: {message:"LinkAlreadyExists"},
  3: {message:"LinkNotFound"},
  4: {message:"LinkAlreadyPaid"},
  5: {message:"InvalidAmount"},
  6: {message:"Unauthorized"},
  7: {message:"InvalidTokenAddress"}
}

export type PaymentStatus = {tag: "Pending", values: void} | {tag: "Paid", values: void};


export interface GlobalPaymentLink {
  created_at: u64;
  creator: string;
  link_id: string;
  total_contributions: i128;
  total_contributors: u32;
}


export interface FixedPaymentLink {
  amount: i128;
  created_at: u64;
  creator: string;
  link_id: string;
  paid_at: u64;
  payer: Option<string>;
  status: PaymentStatus;
}


export interface Invoice {
  amount: i128;
  created_at: u64;
  from: string;
  invoice_id: string;
  paid_at: u64;
  payer: Option<string>;
  product_id: string;
  status: PaymentStatus;
}


export interface Contribution {
  amount: i128;
  contributor: string;
  timestamp: u64;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   */
  initialize: ({admin, link_generation_fee, fixed_link_fee_percent, invoice_fee_percent}: {admin: string, link_generation_fee: i128, fixed_link_fee_percent: u32, invoice_fee_percent: u32}, options?: {
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
   * Construct and simulate a create_global_payment_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a global payment link (flexible amounts)
   */
  create_global_payment_link: ({creator, link_id}: {creator: string, link_id: string}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a contribute_to_global_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Contribute to a global payment link
   */
  contribute_to_global_link: ({contributor, link_id, amount}: {contributor: string, link_id: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a create_fixed_payment_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create a fixed payment link (specific amount)
   */
  create_fixed_payment_link: ({creator, link_id, amount}: {creator: string, link_id: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a pay_fixed_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay a fixed payment link
   */
  pay_fixed_link: ({payer, link_id, amount}: {payer: string, link_id: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a create_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create an invoice
   */
  create_invoice: ({creator, invoice_id, product_id, amount}: {creator: string, invoice_id: string, product_id: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a pay_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay an invoice
   */
  pay_invoice: ({payer, invoice_id, amount}: {payer: string, invoice_id: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_global_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get global payment link details
   */
  get_global_link: ({link_id}: {link_id: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<GlobalPaymentLink>>>

  /**
   * Construct and simulate a get_fixed_link transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get fixed payment link details
   */
  get_fixed_link: ({link_id}: {link_id: string}, options?: {
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
  }) => Promise<AssembledTransaction<Option<FixedPaymentLink>>>

  /**
   * Construct and simulate a get_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get invoice details
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
   * Construct and simulate a get_link_contributions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get contributions for a global link
   */
  get_link_contributions: ({link_id}: {link_id: string}, options?: {
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
  }) => Promise<AssembledTransaction<Array<Contribution>>>

  /**
   * Construct and simulate a get_all_global_links transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all global links
   */
  get_all_global_links: (options?: {
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
  }) => Promise<AssembledTransaction<Array<GlobalPaymentLink>>>

  /**
   * Construct and simulate a get_all_fixed_links transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all fixed links
   */
  get_all_fixed_links: (options?: {
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
  }) => Promise<AssembledTransaction<Array<FixedPaymentLink>>>

  /**
   * Construct and simulate a get_all_invoices transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all invoices
   */
  get_all_invoices: (options?: {
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
   * Construct and simulate a update_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update fee configuration (admin only)
   */
  update_fees: ({admin, link_generation_fee, fixed_link_fee_percent, invoice_fee_percent}: {admin: string, link_generation_fee: i128, fixed_link_fee_percent: u32, invoice_fee_percent: u32}, options?: {
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
   * Construct and simulate a get_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get fee configuration
   */
  get_fees: (options?: {
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
  }) => Promise<AssembledTransaction<readonly [i128, u32, u32]>>

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
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAADFBheUxpbmtFcnJvcgAAAAcAAAAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAAQAAAAAAAAARTGlua0FscmVhZHlFeGlzdHMAAAAAAAACAAAAAAAAAAxMaW5rTm90Rm91bmQAAAADAAAAAAAAAA9MaW5rQWxyZWFkeVBhaWQAAAAABAAAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAUAAAAAAAAADFVuYXV0aG9yaXplZAAAAAYAAAAAAAAAE0ludmFsaWRUb2tlbkFkZHJlc3MAAAAABw==",
        "AAAAAgAAAAAAAAAAAAAADVBheW1lbnRTdGF0dXMAAAAAAAACAAAAAAAAAAAAAAAHUGVuZGluZwAAAAAAAAAAAAAAAARQYWlk",
        "AAAAAQAAAAAAAAAAAAAAEUdsb2JhbFBheW1lbnRMaW5rAAAAAAAABQAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAdsaW5rX2lkAAAAABAAAAAAAAAAE3RvdGFsX2NvbnRyaWJ1dGlvbnMAAAAACwAAAAAAAAASdG90YWxfY29udHJpYnV0b3JzAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAAEEZpeGVkUGF5bWVudExpbmsAAAAHAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACmNyZWF0ZWRfYXQAAAAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAHbGlua19pZAAAAAAQAAAAAAAAAAdwYWlkX2F0AAAAAAYAAAAAAAAABXBheWVyAAAAAAAD6AAAABMAAAAAAAAABnN0YXR1cwAAAAAH0AAAAA1QYXltZW50U3RhdHVzAAAA",
        "AAAAAQAAAAAAAAAAAAAAB0ludm9pY2UAAAAACAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApjcmVhdGVkX2F0AAAAAAAGAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAHcGFpZF9hdAAAAAAGAAAAAAAAAAVwYXllcgAAAAAAA+gAAAATAAAAAAAAAApwcm9kdWN0X2lkAAAAAAAQAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAANUGF5bWVudFN0YXR1cwAAAA==",
        "AAAAAQAAAAAAAAAAAAAADENvbnRyaWJ1dGlvbgAAAAMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAALY29udHJpYnV0b3IAAAAAEwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAAAAABdJbml0aWFsaXplIHRoZSBjb250cmFjdAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAABNsaW5rX2dlbmVyYXRpb25fZmVlAAAAAAsAAAAAAAAAFmZpeGVkX2xpbmtfZmVlX3BlcmNlbnQAAAAAAAQAAAAAAAAAE2ludm9pY2VfZmVlX3BlcmNlbnQAAAAABAAAAAA=",
        "AAAAAAAAAC9DcmVhdGUgYSBnbG9iYWwgcGF5bWVudCBsaW5rIChmbGV4aWJsZSBhbW91bnRzKQAAAAAaY3JlYXRlX2dsb2JhbF9wYXltZW50X2xpbmsAAAAAAAIAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAHbGlua19pZAAAAAAQAAAAAQAAAAE=",
        "AAAAAAAAACNDb250cmlidXRlIHRvIGEgZ2xvYmFsIHBheW1lbnQgbGluawAAAAAZY29udHJpYnV0ZV90b19nbG9iYWxfbGluawAAAAAAAAMAAAAAAAAAC2NvbnRyaWJ1dG9yAAAAABMAAAAAAAAAB2xpbmtfaWQAAAAAEAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAAAE=",
        "AAAAAAAAAC1DcmVhdGUgYSBmaXhlZCBwYXltZW50IGxpbmsgKHNwZWNpZmljIGFtb3VudCkAAAAAAAAZY3JlYXRlX2ZpeGVkX3BheW1lbnRfbGluawAAAAAAAAMAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAHbGlua19pZAAAAAAQAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAAAQ==",
        "AAAAAAAAABhQYXkgYSBmaXhlZCBwYXltZW50IGxpbmsAAAAOcGF5X2ZpeGVkX2xpbmsAAAAAAAMAAAAAAAAABXBheWVyAAAAAAAAEwAAAAAAAAAHbGlua19pZAAAAAAQAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAAAQ==",
        "AAAAAAAAABFDcmVhdGUgYW4gaW52b2ljZQAAAAAAAA5jcmVhdGVfaW52b2ljZQAAAAAABAAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAAAAAApwcm9kdWN0X2lkAAAAAAAQAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAAAQ==",
        "AAAAAAAAAA5QYXkgYW4gaW52b2ljZQAAAAAAC3BheV9pbnZvaWNlAAAAAAMAAAAAAAAABXBheWVyAAAAAAAAEwAAAAAAAAAKaW52b2ljZV9pZAAAAAAAEAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAAAE=",
        "AAAAAAAAAB9HZXQgZ2xvYmFsIHBheW1lbnQgbGluayBkZXRhaWxzAAAAAA9nZXRfZ2xvYmFsX2xpbmsAAAAAAQAAAAAAAAAHbGlua19pZAAAAAAQAAAAAQAAA+gAAAfQAAAAEUdsb2JhbFBheW1lbnRMaW5rAAAA",
        "AAAAAAAAAB5HZXQgZml4ZWQgcGF5bWVudCBsaW5rIGRldGFpbHMAAAAAAA5nZXRfZml4ZWRfbGluawAAAAAAAQAAAAAAAAAHbGlua19pZAAAAAAQAAAAAQAAA+gAAAfQAAAAEEZpeGVkUGF5bWVudExpbms=",
        "AAAAAAAAABNHZXQgaW52b2ljZSBkZXRhaWxzAAAAAAtnZXRfaW52b2ljZQAAAAABAAAAAAAAAAppbnZvaWNlX2lkAAAAAAAQAAAAAQAAA+gAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAACNHZXQgY29udHJpYnV0aW9ucyBmb3IgYSBnbG9iYWwgbGluawAAAAAWZ2V0X2xpbmtfY29udHJpYnV0aW9ucwAAAAAAAQAAAAAAAAAHbGlua19pZAAAAAAQAAAAAQAAA+oAAAfQAAAADENvbnRyaWJ1dGlvbg==",
        "AAAAAAAAABRHZXQgYWxsIGdsb2JhbCBsaW5rcwAAABRnZXRfYWxsX2dsb2JhbF9saW5rcwAAAAAAAAABAAAD6gAAB9AAAAARR2xvYmFsUGF5bWVudExpbmsAAAA=",
        "AAAAAAAAABNHZXQgYWxsIGZpeGVkIGxpbmtzAAAAABNnZXRfYWxsX2ZpeGVkX2xpbmtzAAAAAAAAAAABAAAD6gAAB9AAAAAQRml4ZWRQYXltZW50TGluaw==",
        "AAAAAAAAABBHZXQgYWxsIGludm9pY2VzAAAAEGdldF9hbGxfaW52b2ljZXMAAAAAAAAAAQAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAACVVcGRhdGUgZmVlIGNvbmZpZ3VyYXRpb24gKGFkbWluIG9ubHkpAAAAAAAAC3VwZGF0ZV9mZWVzAAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAATbGlua19nZW5lcmF0aW9uX2ZlZQAAAAALAAAAAAAAABZmaXhlZF9saW5rX2ZlZV9wZXJjZW50AAAAAAAEAAAAAAAAABNpbnZvaWNlX2ZlZV9wZXJjZW50AAAAAAQAAAAA",
        "AAAAAAAAABVHZXQgZmVlIGNvbmZpZ3VyYXRpb24AAAAAAAAIZ2V0X2ZlZXMAAAAAAAAAAQAAA+0AAAADAAAACwAAAAQAAAAE" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_global_payment_link: this.txFromJSON<boolean>,
        contribute_to_global_link: this.txFromJSON<boolean>,
        create_fixed_payment_link: this.txFromJSON<boolean>,
        pay_fixed_link: this.txFromJSON<boolean>,
        create_invoice: this.txFromJSON<boolean>,
        pay_invoice: this.txFromJSON<boolean>,
        get_global_link: this.txFromJSON<Option<GlobalPaymentLink>>,
        get_fixed_link: this.txFromJSON<Option<FixedPaymentLink>>,
        get_invoice: this.txFromJSON<Option<Invoice>>,
        get_link_contributions: this.txFromJSON<Array<Contribution>>,
        get_all_global_links: this.txFromJSON<Array<GlobalPaymentLink>>,
        get_all_fixed_links: this.txFromJSON<Array<FixedPaymentLink>>,
        get_all_invoices: this.txFromJSON<Array<Invoice>>,
        update_fees: this.txFromJSON<null>,
        get_fees: this.txFromJSON<readonly [i128, u32, u32]>
  }
}