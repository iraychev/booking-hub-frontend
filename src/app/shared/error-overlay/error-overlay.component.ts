import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-error-overlay',
  standalone: true,
  imports: [NgIf, ButtonComponent],
  templateUrl: './error-overlay.component.html',
  styleUrl: './error-overlay.component.css'
})
export class ErrorOverlayComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}