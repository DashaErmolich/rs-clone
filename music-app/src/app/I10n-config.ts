/* eslint-disable max-classes-per-file */
import {
  L10nConfig,
  L10nLocale,
  L10nProvider,
  L10nStorage,
  L10nTranslationLoader,
} from 'angular-l10n';
import {
  Injectable,
  Optional,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { isPlatformBrowser } from '@angular/common';

export const l10nConfig: L10nConfig = {
  format: 'language-region',
  providers: [
    { name: 'app', asset: '../assets/i18n/app', options: { version: '15.0.0' } },
  ],
  cache: true,
  keySeparator: '.',
  defaultLocale: {
    language: 'en-US',
    currency: 'USD',
    timeZone: 'America/Los_Angeles',
  },
  schema: [
    {
      locale: {
        language: 'en-US',
        currency: 'USD',
        timeZone: 'America/Los_Angeles',
        units: { length: 'mile' },
      },
      dir: 'ltr',
      text: 'United States',
    },
    {
      locale: {
        language: 'ru-RU',
        currency: 'RUB',
        timeZone: 'Europe/Moscow',
        units: { length: 'kilometer' },
      },
      dir: 'ltr',
      text: 'Russia',
    },
  ],
  defaultRouting: true,
};

@Injectable() export class HttpTranslationLoader implements L10nTranslationLoader {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(@Optional() private http: HttpClient) { }

  public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
    const url = `${provider.asset}-${language}.json`;
    const options = {
      headers: this.headers,
      params: new HttpParams().set('v', provider.options.version),
    };
    return this.http.get(url, options);
  }
}

@Injectable() export class AppStorage implements L10nStorage {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
  ) { }

  public async read(): Promise<L10nLocale | null> {
    return Promise.resolve(this.cookieService.getObject('locale') as L10nLocale);
  }

  public async write(locale: L10nLocale): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.putObject('locale', locale);
    }
  }
}
