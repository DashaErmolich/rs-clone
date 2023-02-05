import { L10nConfig, L10nProvider, L10nTranslationLoader } from 'angular-l10n';
import { Injectable, Optional } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
