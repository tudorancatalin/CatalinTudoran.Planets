import { AppNavigationLink } from './app-navigation-link';

export class AppNavigationConfig {

  constructor(private _topBarLinks: AppNavigationLink[],
    private _sideBarLinks: AppNavigationLink[]) {
  }

  get topBarLinks(): AppNavigationLink[] {
    return this._topBarLinks;
  }

  get sideBarLinks(): AppNavigationLink[] {
    return this._sideBarLinks;
  }
}
