import { Injectable, Injector, createComponent, EnvironmentInjector, ApplicationRef } from '@angular/core';
import { ErrorOverlayComponent } from '../shared/error-overlay/error-overlay.component';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorComponentRef: any = null;

  constructor(
    private injector: Injector,
    private environmentInjector: EnvironmentInjector,
    private appRef: ApplicationRef
  ) {}

  handleError(message: string, error: any): void {
    console.error('An error occurred:', error);

    let errorMessage = message;
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage += `: ${error}`;
    }

    this.showErrorOverlay(errorMessage);
  }

  private showErrorOverlay(message: string): void {
    if (this.errorComponentRef) {
      this.removeErrorOverlay();
    }

    this.errorComponentRef = createComponent(ErrorOverlayComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });

    this.errorComponentRef.instance.show = true;
    this.errorComponentRef.instance.message = message;
    this.errorComponentRef.instance.closed.subscribe(() => this.removeErrorOverlay());

    const domElem = this.errorComponentRef.location.nativeElement;
    document.body.appendChild(domElem);

    this.appRef.attachView(this.errorComponentRef.hostView);
  }

  private removeErrorOverlay(): void {
    if (this.errorComponentRef) {
      this.appRef.detachView(this.errorComponentRef.hostView);
      this.errorComponentRef.destroy();
      this.errorComponentRef = null;
    }
  }
}