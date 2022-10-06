import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User.model';
import { FIModel, LinkToken, SyncResult } from '../models/LinkToken.model';

@Injectable({
  providedIn: 'root',
})
export class PlaidAuthService {
  constructor(private http: HttpClient) {}

  /**
   * Proxy call to server to request new linkToken from Plaid API.
   * @returns LinkToken object containing the "link" key provided by Plaid.
   */
  getLinkToken(): Observable<LinkToken> {
    return this.http.get<LinkToken>(`/api/CreateLinkToken`);
  }

  /**
   * Exchanges the plaid provided public token with a plaid provided private token.
   * @param publicToken
   * @returns
   */
  exchangeTokens(user: User | null, publicToken?: string): Observable<any> {
    return this.http.post(`/api/ExchangeToken`, {
      publicToken: publicToken,
      id: user?.documentId,
      userId: user?.userEmail,
    });
  }

  /**
   * Fetches financial institution data for each account the user has setup
   * @param user 
   * @returns 
   */
  getFiInfo(user: User): Observable<SyncResult> {
    return this.http.post<SyncResult>(`/api/FinanceInfo`, {
      id: user?.documentId,
      userId: user?.userEmail,
    });
  }
}
