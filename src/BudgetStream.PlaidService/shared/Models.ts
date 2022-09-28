import { AccountBase } from "plaid";


/**
 * Represents a user document stored in Cosmos
 */
export class User {
    
    // The partition key contains the unique partitioning value; the userId.
    pk: { userId: string; };

    // Represents the cosmos document ID. Must be unique.
    id: string;
    
    // The list of financial institution links to Plaid added by the user.
    fiKeys:Array<FIKey>;

    /**
     * Ctor
     */
    constructor() {
        this.fiKeys = [];
    }

}

/**
 * Contains financial institution link information to retrieve finance data from Plaid.
 */
export class FIKey {
    /**
     * Ctor
     * @param accessToken Secret token that authenticates calls to Plaid specific to this user. Does not expire.
     * @param itemId Item represents an institutional relationship
     */
     constructor(
        public accessToken:string, 
        public itemId:string) { }
}


/**
 * Represents a Mira financial institution
 */
 export interface FinancialInst {
    detailInfo: any;
    accounts:Array<AccountBase>;
}

// export interface FIDetail {
//     name:string;
// }