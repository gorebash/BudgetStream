import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FIModel, LinkToken } from '../models/LinkToken.model';
import { User } from '../models/User.model';
import { AuthService } from '../services/auth.service';
import { PlaidAuthService } from '../services/plaid-auth.service';


declare let Plaid: any;

@Component({
  selector: 'app-plaid-link',
  templateUrl: './plaid-link.component.html',
  styleUrls: ['./plaid-link.component.scss'],
})
export class PlaidLinkComponent implements OnInit {
  user:User = new User();
  fiList:Array<FIModel> = [];
  plaidLoaded: boolean = false;
  userAuthenticated: boolean | null = null;

  constructor(private plaidAuthService: PlaidAuthService, private authService:AuthService) { }

  /**
   * Handle for object returned from the Plaid library.
   * Used to open or exit the Plaid auth window.
   */
  private plaidHandler: any;


  /**
   * Initialize Plaid by requesting a Link token from Plaid API.
   */
  async ngOnInit(): Promise<void> {
    
    // todo: rework nested subscribes.

    this.authService.getUser()
      .subscribe((user => {
        if (user) {
          this.user = user;
          this.userAuthenticated = true;
          this.fetchUserFIs();

          this.plaidAuthService.getLinkToken()
            .subscribe((link: LinkToken) => {
              this.createPlaidHandler(link);
            });
        }

        else {
          this.userAuthenticated = false;
        }
      }));
  }

  /**
   * Open the plaid login window
   */
  open() {
    this.plaidHandler.open();
  }

  /**
   * Exits the plaid login window
   */
  exit() {
    this.plaidHandler.exit();
  }


  private createPlaidHandler(link: LinkToken) {
    this.plaidHandler = Plaid.create({
      token: link.link_token,
      onLoad: () => {
        this.plaidHandlerReady();
      },
      onSuccess: (publicToken: string) => {
        this.requestPrivateToken(publicToken);
      },
    });
  }

  private plaidHandlerReady() {
    this.plaidLoaded = true;
  }

  private requestPrivateToken(publicToken: string) {
    this.plaidAuthService
      .exchangeTokens(this.user, publicToken)
      .subscribe(() => {
        this.fetchUserFIs();
      })
  }
  
  private fetchUserFIs() {
    this.plaidAuthService.getFiInfo(this.user)
      .subscribe(result => {
        this.fiList = result.userFIs;
      });
  }
}


