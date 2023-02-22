import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IArtistResponse } from 'src/app/models/api-response.models';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit, OnDestroy {
  genreId!: number;

  loading = true;

  artists: Partial<IArtistResponse>[] = [];

  artists$!: Subscription;

  routeParams$!: Subscription;

  title!:string;

  title$!: Subscription;

  isSmall = false;

  isHandset = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private deezerRestApiService: DeezerRestApiService,
    private responsive: ResponsiveService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.routeParams$ = this.route.params.subscribe((params) => {
      this.genreId = Number(params['genre']);
      this.title$ = this.deezerRestApiService.getGenre(this.genreId)
        .subscribe((res) => {
          this.title = res.name;
        });
    });
    this.artists$ = this.deezerRestApiService
      .getArtistByGenre(this.genreId)
      .subscribe((res) => {
        this.artists = res.data;
        this.loading = false;
      });

    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.subscriptions.push(this.isSmall$);

    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });

    this.subscriptions.push(this.isHandset$);
  }

  ngOnDestroy(): void {
    if (this.routeParams$) this.routeParams$.unsubscribe();
    if (this.artists$) this.artists$.unsubscribe();
    if (this.title$) this.artists$.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
