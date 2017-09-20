import {forwardRef, NgModule} from "@angular/core";
import {UpgradeAdapter} from "@angular/upgrade";
import {BrowserModule} from "@angular/platform-browser";
import {PhoneListComponent} from "./admin/phone-list.component";
import * as angular from 'angular';
import {AppModule} from "./app.module";
import {TeamListComponentUpgrade} from "./admin/team-list/team-list.component.upgrade";
import {NavbarComponent} from './admin/navbar/navbar.component';
import {LoginPanelComponentUpgrade} from "./admin/login-panel/login-panel.component.upgrade";
import {BackupService} from './services/backup/backup.service';

const upgradeAdapter = new UpgradeAdapter(forwardRef(() => HybridAppModule));

@NgModule({
  declarations: [
    TeamListComponentUpgrade,
    PhoneListComponent,
    NavbarComponent,
    LoginPanelComponentUpgrade
  ],
  imports: [
    BrowserModule,
    AppModule
  ],
  entryComponents: [],
  providers: [BackupService],
})
export class HybridAppModule {
  private mhsAdminModule = angular.module('mhs.admin');

  constructor() {
    this.upgradeOldProviders();
    this.downgradeNewComponents();
    this.downgradeNewProviders();
  }

  ngDoBootstrap() {
    upgradeAdapter.bootstrap(document.documentElement, ['mhs'], {strictDi: false});
  }

  private upgradeOldProviders() {
    upgradeAdapter.upgradeNg1Provider('TeamServiceFactory');
  }

  private downgradeNewComponents() {
    this.mhsAdminModule.directive('phoneList', upgradeAdapter.downgradeNg2Component(PhoneListComponent));
    this.mhsAdminModule.directive('navbar', upgradeAdapter.downgradeNg2Component(NavbarComponent));
  }

  private downgradeNewProviders() {
    this.mhsAdminModule.service('backup', upgradeAdapter.downgradeNg2Provider(BackupService));

  }
}


