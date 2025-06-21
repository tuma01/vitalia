import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideDateFnsDatetimeAdapter } from '@ng-matero/extensions-date-fns-adapter';
import { provideTranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { provideToastr } from 'ngx-toastr';
// import { ApiConfiguration, API_ROOT_URL } from './app/services/api-configuration';

import {
  apiInterceptor,
  // BASE_URL,
  // baseUrlInterceptor,
  // errorInterceptor,
  // loggingInterceptor,
  // noopInterceptor,
  settingsInterceptor,
  SettingsService,
  StartupService,
  tokenInterceptor,
  TranslateLangService,
} from '@core';
import { environment } from '@env/environment';
import { PaginatorI18nService } from '@shared';
// import { InMemDataService } from '@shared/in-mem/in-mem-data.service';
import { routes } from './app.routes';
import { FormlyConfigModule } from './formly-config';
import { ApiConfiguration, API_ROOT_URL } from './services/api-configuration';

// Required for AOT compilation
function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

// Http interceptor providers in outside-in order
const interceptors = [
//   noopInterceptor,
//   baseUrlInterceptor,
  settingsInterceptor,
  tokenInterceptor,
  apiInterceptor,
//   errorInterceptor,
//   loggingInterceptor,
];

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_ROOT_URL, useValue: environment.apiRootUrl },
    provideAppInitializer(() => inject(TranslateLangService).load()),
    provideAppInitializer(() => inject(StartupService).load()),
    provideAnimationsAsync(),

    provideHttpClient(withInterceptors(interceptors)),
    {
      provide: ApiConfiguration,
      useFactory: (apiUrl: string) => new ApiConfiguration(apiUrl), // ✅ Inyecta API_ROOT_URL
      deps: [API_ROOT_URL]
    },
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideToastr(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    importProvidersFrom(
      // TranslateModule.forRoot(),
      NgxPermissionsModule.forRoot(),
      FormlyConfigModule.forRoot(),
      // // 👇 ❌ This is only used for demo purpose, remove it in the realworld application
      // InMemoryWebApiModule.forRoot(InMemDataService, {
      //   dataEncapsulation: false,
      //   passThruUnknownUrl: true,
      // })
    ),
    {
      provide: MatPaginatorIntl,
      useFactory: (paginatorI18nSrv: PaginatorI18nService) => paginatorI18nSrv.getPaginatorIntl(),
      deps: [PaginatorI18nService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => inject(SettingsService).getLocale(),
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined',
      },
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: 'yyyy-MM-dd',
      },
      display: {
        dateInput: 'yyyy-MM-dd',
        monthYearLabel: 'yyyy MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'yyyy MMM',
      },
    }),
    provideDateFnsDatetimeAdapter({
      parse: {
        dateInput: 'yyyy-MM-dd',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'yyyy-MM-dd HH:mm',
        timeInput: 'HH:mm',
      },
      display: {
        dateInput: 'yyyy-MM-dd',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'yyyy-MM-dd HH:mm',
        timeInput: 'HH:mm',
        monthYearLabel: 'yyyy MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
        popupHeaderDateLabel: 'MMM dd, E',
      },
    }),
  ],
};
