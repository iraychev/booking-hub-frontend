import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services.loading-service.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
