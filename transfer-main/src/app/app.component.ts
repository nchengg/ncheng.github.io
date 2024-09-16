import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ethers } from 'ethers';
import { faucetContract } from '../ethereum/contract';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'faucet-app';

  public faucetContract!: ethers.Contract;
  public provider!: ethers.providers.Web3Provider;
  public accounts: any[] = [];
  public signer!: ethers.providers.JsonRpcSigner;
  public toAddress: string = '';

  constructor() {}

  public async ngOnInit(): Promise<void> {
    if (!this.checkExtension()) {
      return;
    }
    this.provider = new ethers.providers.Web3Provider(window['ethereum' as any] as any);
    this.faucetContract = faucetContract(this.provider);
    
    // connect to metamask account
    this.accounts = await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
  }

  public checkExtension(): Boolean {
    if (typeof window == "undefined" || typeof window["ethereum" as any] == "undefined") {
      console.log("Please install MetaMask");
      return false;
    }
    return true;
  }

  public onClick() {
    if (!this.checkExtension()) {
      return;
    }
    this.faucetContract = this.faucetContract.connect(this.signer);
    this.faucetContract['transfer'](this.toAddress, 1);
  }
}
