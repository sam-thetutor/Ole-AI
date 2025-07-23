#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, Address, Env, String, Map,
    symbol_short, Symbol, log, panic_with_error, Vec
};

// Error codes
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum PayLinkError {
    InsufficientBalance = 1,
    LinkAlreadyExists = 2,
    LinkNotFound = 3,
    LinkAlreadyPaid = 4,
    InvalidAmount = 5,
    Unauthorized = 6,
    InvalidTokenAddress = 7,
}

// Payment status
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PaymentStatus {
    Pending,
    Paid,
}

// Global payment link - for flexible amounts
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GlobalPaymentLink {
    pub creator: Address,
    pub link_id: String,
    pub total_contributions: i128,
    pub total_contributors: u32,
    pub created_at: u64,
}

// Fixed payment link - for specific amounts
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FixedPaymentLink {
    pub creator: Address,
    pub link_id: String,
    pub amount: i128,
    pub status: PaymentStatus,
    pub created_at: u64,
    pub paid_at: u64,
    pub payer: Option<Address>,
}

// Invoice structure
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Invoice {
    pub invoice_id: String,
    pub product_id: String,
    pub from: Address,
    pub amount: i128,
    pub status: PaymentStatus,
    pub created_at: u64,
    pub paid_at: u64,
    pub payer: Option<Address>,
}

// Contribution record for global links
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Contribution {
    pub contributor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

// Storage keys
const ADMIN: Symbol = symbol_short!("ADMIN");
const GLOBAL_LINKS: Symbol = symbol_short!("GLOBAL");
const FIXED_LINKS: Symbol = symbol_short!("FIXED");
const INVOICES: Symbol = symbol_short!("INVOICE");
const CONTRIBUTIONS: Symbol = symbol_short!("CONTRIB");
const LINK_GENERATION_FEE: Symbol = symbol_short!("LINK_FEE");
const FIXED_LINK_FEE_PERCENT: Symbol = symbol_short!("FIXED_FEE");
const INVOICE_FEE_PERCENT: Symbol = symbol_short!("INV_FEE");

#[contract]
pub struct PayLink;

#[contractimpl]
impl PayLink {
    
    /// Initialize the contract
    pub fn initialize(
        env: Env,
        admin: Address,
        link_generation_fee: i128,
        fixed_link_fee_percent: u32,
        invoice_fee_percent: u32,
    ) {
        if env.storage().instance().has(&ADMIN) {
            panic_with_error!(&env, PayLinkError::Unauthorized);
        }
        
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&LINK_GENERATION_FEE, &link_generation_fee);
        env.storage().instance().set(&FIXED_LINK_FEE_PERCENT, &fixed_link_fee_percent);
        env.storage().instance().set(&INVOICE_FEE_PERCENT, &invoice_fee_percent);
        
        log!(&env, "PayLink contract initialized");
    }
    
    /// Create a global payment link (flexible amounts)
    pub fn create_global_payment_link(
        env: Env,
        creator: Address,
        link_id: String,
    ) -> bool {
        creator.require_auth();
        
        let mut global_links: Map<String, GlobalPaymentLink> = env.storage()
            .instance()
            .get(&GLOBAL_LINKS)
            .unwrap_or(Map::new(&env));
        
        if global_links.contains_key(link_id.clone()) {
            panic_with_error!(&env, PayLinkError::LinkAlreadyExists);
        }
        
        let global_link = GlobalPaymentLink {
            creator: creator.clone(),
            link_id: link_id.clone(),
            total_contributions: 0,
            total_contributors: 0,
            created_at: env.ledger().timestamp(),
        };
        
        global_links.set(link_id.clone(), global_link);
        env.storage().instance().set(&GLOBAL_LINKS, &global_links);
        
        log!(&env, "Global payment link created: {}", link_id);
        true
    }
    
    /// Contribute to a global payment link
    pub fn contribute_to_global_link(
        env: Env,
        contributor: Address,
        link_id: String,
        amount: i128,
    ) -> bool {
        contributor.require_auth();
        
        if amount <= 0 {
            panic_with_error!(&env, PayLinkError::InvalidAmount);
        }
        
        let mut global_links: Map<String, GlobalPaymentLink> = env.storage()
            .instance()
            .get(&GLOBAL_LINKS)
            .unwrap_or(Map::new(&env));
        
        let mut global_link = global_links.get(link_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, PayLinkError::LinkNotFound));
        
        // Update global link stats
        global_link.total_contributions += amount;
        global_link.total_contributors += 1;
        global_links.set(link_id.clone(), global_link);
        env.storage().instance().set(&GLOBAL_LINKS, &global_links);
        
        // Store contribution record
        let mut contributions: Map<String, Vec<Contribution>> = env.storage()
            .instance()
            .get(&CONTRIBUTIONS)
            .unwrap_or(Map::new(&env));
        
        let mut link_contributions = contributions.get(link_id.clone())
            .unwrap_or(Vec::new(&env));
        
        let contribution = Contribution {
            contributor: contributor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };
        
        link_contributions.push_back(contribution);
        contributions.set(link_id.clone(), link_contributions);
        env.storage().instance().set(&CONTRIBUTIONS, &contributions);
        
        log!(&env, "Contribution added to {}: {} by {}", link_id, amount, contributor);
        true
    }
    
    /// Create a fixed payment link (specific amount)
    pub fn create_fixed_payment_link(
        env: Env,
        creator: Address,
        link_id: String,
        amount: i128,
    ) -> bool {
        creator.require_auth();
        
        if amount <= 0 {
            panic_with_error!(&env, PayLinkError::InvalidAmount);
        }
        
        let mut fixed_links: Map<String, FixedPaymentLink> = env.storage()
            .instance()
            .get(&FIXED_LINKS)
            .unwrap_or(Map::new(&env));
        
        if fixed_links.contains_key(link_id.clone()) {
            panic_with_error!(&env, PayLinkError::LinkAlreadyExists);
        }
        
        let fixed_link = FixedPaymentLink {
            creator: creator.clone(),
            link_id: link_id.clone(),
            amount,
            status: PaymentStatus::Pending,
            created_at: env.ledger().timestamp(),
            paid_at: 0,
            payer: None,
        };
        
        fixed_links.set(link_id.clone(), fixed_link);
        env.storage().instance().set(&FIXED_LINKS, &fixed_links);
        
        log!(&env, "Fixed payment link created: {} for amount: {}", link_id, amount);
        true
    }
    
    /// Pay a fixed payment link
    pub fn pay_fixed_link(
        env: Env,
        payer: Address,
        link_id: String,
        amount: i128,
    ) -> bool {
        payer.require_auth();
        
        let mut fixed_links: Map<String, FixedPaymentLink> = env.storage()
            .instance()
            .get(&FIXED_LINKS)
            .unwrap_or(Map::new(&env));
        
        let mut fixed_link = fixed_links.get(link_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, PayLinkError::LinkNotFound));
        
        if fixed_link.status == PaymentStatus::Paid {
            panic_with_error!(&env, PayLinkError::LinkAlreadyPaid);
        }
        
        if amount != fixed_link.amount {
            panic_with_error!(&env, PayLinkError::InvalidAmount);
        }
        
        // Update link status
        fixed_link.status = PaymentStatus::Paid;
        fixed_link.paid_at = env.ledger().timestamp();
        fixed_link.payer = Some(payer.clone());
        
        fixed_links.set(link_id.clone(), fixed_link);
        env.storage().instance().set(&FIXED_LINKS, &fixed_links);
        
        log!(&env, "Fixed payment link paid: {} by {}", link_id, payer);
        true
    }
    
    /// Create an invoice
    pub fn create_invoice(
        env: Env,
        creator: Address,
        invoice_id: String,
        product_id: String,
        amount: i128,
    ) -> bool {
        creator.require_auth();
        
        if amount <= 0 {
            panic_with_error!(&env, PayLinkError::InvalidAmount);
        }
        
        let mut invoices: Map<String, Invoice> = env.storage()
            .instance()
            .get(&INVOICES)
            .unwrap_or(Map::new(&env));
        
        if invoices.contains_key(invoice_id.clone()) {
            panic_with_error!(&env, PayLinkError::LinkAlreadyExists);
        }
        
        let invoice = Invoice {
            invoice_id: invoice_id.clone(),
            product_id,
            from: creator.clone(),
            amount,
            status: PaymentStatus::Pending,
            created_at: env.ledger().timestamp(),
            paid_at: 0,
            payer: None,
        };
        
        invoices.set(invoice_id.clone(), invoice);
        env.storage().instance().set(&INVOICES, &invoices);
        
        log!(&env, "Invoice created: {} for amount: {}", invoice_id, amount);
        true
    }
    
    /// Pay an invoice
    pub fn pay_invoice(
        env: Env,
        payer: Address,
        invoice_id: String,
        amount: i128,
    ) -> bool {
        payer.require_auth();
        
        let mut invoices: Map<String, Invoice> = env.storage()
            .instance()
            .get(&INVOICES)
            .unwrap_or(Map::new(&env));
        
        let mut invoice = invoices.get(invoice_id.clone())
            .unwrap_or_else(|| panic_with_error!(&env, PayLinkError::LinkNotFound));
        
        if invoice.status == PaymentStatus::Paid {
            panic_with_error!(&env, PayLinkError::LinkAlreadyPaid);
        }
        
        if amount != invoice.amount {
            panic_with_error!(&env, PayLinkError::InvalidAmount);
        }
        
        // Update invoice status
        invoice.status = PaymentStatus::Paid;
        invoice.paid_at = env.ledger().timestamp();
        invoice.payer = Some(payer.clone());
        
        invoices.set(invoice_id.clone(), invoice);
        env.storage().instance().set(&INVOICES, &invoices);
        
        log!(&env, "Invoice paid: {} by {}", invoice_id, payer);
        true
    }
    
    /// Get global payment link details
    pub fn get_global_link(env: Env, link_id: String) -> Option<GlobalPaymentLink> {
        let global_links: Map<String, GlobalPaymentLink> = env.storage()
            .instance()
            .get(&GLOBAL_LINKS)
            .unwrap_or(Map::new(&env));
        
        global_links.get(link_id)
    }
    
    /// Get fixed payment link details
    pub fn get_fixed_link(env: Env, link_id: String) -> Option<FixedPaymentLink> {
        let fixed_links: Map<String, FixedPaymentLink> = env.storage()
            .instance()
            .get(&FIXED_LINKS)
            .unwrap_or(Map::new(&env));
        
        fixed_links.get(link_id)
    }
    
    /// Get invoice details
    pub fn get_invoice(env: Env, invoice_id: String) -> Option<Invoice> {
        let invoices: Map<String, Invoice> = env.storage()
            .instance()
            .get(&INVOICES)
            .unwrap_or(Map::new(&env));
        
        invoices.get(invoice_id)
    }
    
    /// Get contributions for a global link
    pub fn get_link_contributions(env: Env, link_id: String) -> Vec<Contribution> {
        let contributions: Map<String, Vec<Contribution>> = env.storage()
            .instance()
            .get(&CONTRIBUTIONS)
            .unwrap_or(Map::new(&env));
        
        contributions.get(link_id).unwrap_or(Vec::new(&env))
    }
    
    /// Get all global links
    pub fn get_all_global_links(env: Env) -> Vec<GlobalPaymentLink> {
        let global_links: Map<String, GlobalPaymentLink> = env.storage()
            .instance()
            .get(&GLOBAL_LINKS)
            .unwrap_or(Map::new(&env));
        
        let mut links = Vec::new(&env);
        for (_, link) in global_links.iter() {
            links.push_back(link);
        }
        
        links
    }
    
    /// Get all fixed links
    pub fn get_all_fixed_links(env: Env) -> Vec<FixedPaymentLink> {
        let fixed_links: Map<String, FixedPaymentLink> = env.storage()
            .instance()
            .get(&FIXED_LINKS)
            .unwrap_or(Map::new(&env));
        
        let mut links = Vec::new(&env);
        for (_, link) in fixed_links.iter() {
            links.push_back(link);
        }
        
        links
    }
    
    /// Get all invoices
    pub fn get_all_invoices(env: Env) -> Vec<Invoice> {
        let invoices: Map<String, Invoice> = env.storage()
            .instance()
            .get(&INVOICES)
            .unwrap_or(Map::new(&env));
        
        let mut invoice_list = Vec::new(&env);
        for (_, invoice) in invoices.iter() {
            invoice_list.push_back(invoice);
        }
        
        invoice_list
    }
    
    /// Update fee configuration (admin only)
    pub fn update_fees(
        env: Env,
        admin: Address,
        link_generation_fee: i128,
        fixed_link_fee_percent: u32,
        invoice_fee_percent: u32,
    ) {
        admin.require_auth();
        Self::require_admin(&env, &admin);
        
        env.storage().instance().set(&LINK_GENERATION_FEE, &link_generation_fee);
        env.storage().instance().set(&FIXED_LINK_FEE_PERCENT, &fixed_link_fee_percent);
        env.storage().instance().set(&INVOICE_FEE_PERCENT, &invoice_fee_percent);
        
        log!(&env, "Fee configuration updated");
    }
    
    /// Get fee configuration
    pub fn get_fees(env: Env) -> (i128, u32, u32) {
        let link_fee: i128 = env.storage().instance().get(&LINK_GENERATION_FEE).unwrap_or(0);
        let fixed_fee_percent: u32 = env.storage().instance().get(&FIXED_LINK_FEE_PERCENT).unwrap_or(5);
        let invoice_fee_percent: u32 = env.storage().instance().get(&INVOICE_FEE_PERCENT).unwrap_or(5);
        
        (link_fee, fixed_fee_percent, invoice_fee_percent)
    }
    
    // Helper functions
    
    fn require_admin(env: &Env, caller: &Address) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        if *caller != admin {
            panic_with_error!(env, PayLinkError::Unauthorized);
        }
    }
}

mod test;