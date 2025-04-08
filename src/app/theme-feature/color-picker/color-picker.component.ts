import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  standalone: false
})
export class ColorPickerComponent {
  @Input() label: string = 'Color';
  @Input()
  set color(value: string) {
    this._color = value;
    this.colorControl.setValue(value);
  }
  get color(): string {
    return this._color;
  }

  @Input() showClear: boolean = false;
  @Output() colorChange = new EventEmitter<string | null>();
  @Output() colorCleared = new EventEmitter<void>();

  colorControl = new FormControl<string | undefined>('');
  private _color: string = '';

  constructor() {
    this.colorControl.valueChanges.subscribe((value) => {
      if (value) {
        this._color = value;
        this.colorChange.emit(value);
      }
    });
  }

  clearColor(): void {
    this.colorControl.setValue('');
    this.colorCleared.emit();
  }

  updateHexColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const hex = input.value;

    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      this._color = hex;
      this.colorChange.emit(hex);
    }
  }
}
