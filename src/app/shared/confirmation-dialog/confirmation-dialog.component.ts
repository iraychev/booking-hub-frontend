import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.css',
    imports: [ButtonComponent, NgIf]
})
export class ConfirmationDialogComponent {
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
  }

  onCancel() {
    this.confirmed.emit(false);
  }
}
