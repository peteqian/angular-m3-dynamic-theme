import { Component, OnInit } from '@angular/core';
import { Material3ThemeService, ThemeMode } from '../material3-theme.service';

@Component({
  selector: 'app-theme-controls',
  templateUrl: './theme-controls.component.html',
  styleUrls: ['./theme-controls.component.scss'],
  standalone: false
})
export class ThemeControlsComponent implements OnInit {
  primaryColor: string = '';
  secondaryColor?: string;
  tertiaryColor?: string;
  neutralColor?: string;
  neutralVariantColor?: string;
  errorColor?: string;

  showAdvanced: boolean = false;
  themeMode: ThemeMode = 'light';
  themeModes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'highContrast', label: 'High Contrast' }
  ];

  constructor(private themeService: Material3ThemeService) {}

  ngOnInit(): void {
    // Get initial values from the service
    this.primaryColor = this.themeService.primaryColor();
    this.secondaryColor = this.themeService.secondaryColor();
    this.tertiaryColor = this.themeService.tertiaryColor();
    this.neutralColor = this.themeService.neutralColor();
    this.neutralVariantColor = this.themeService.neutralVariantColor();
    this.errorColor = this.themeService.errorColor();
    this.themeMode = this.themeService.themeMode();
  }

  updatePrimaryColor(color: string): void {
    this.primaryColor = color;
    this.themeService.updatePrimaryColor(color);
  }

  updateSecondaryColor(color: string): void {
    this.secondaryColor = color;
    this.themeService.updateSecondaryColor(color);
  }

  clearSecondaryColor(): void {
    this.secondaryColor = undefined;
    this.themeService.updateSecondaryColor(undefined);
  }

  updateTertiaryColor(color: string): void {
    this.tertiaryColor = color;
    this.themeService.updateTertiaryColor(color);
  }

  clearTertiaryColor(): void {
    this.tertiaryColor = undefined;
    this.themeService.updateTertiaryColor(undefined);
  }

  updateNeutralColor(color: string): void {
    this.neutralColor = color;
    this.themeService.updateNeutralColor(color);
  }

  clearNeutralColor(): void {
    this.neutralColor = undefined;
    this.themeService.updateNeutralColor(undefined);
  }

  updateNeutralVariantColor(color: string): void {
    this.neutralVariantColor = color;
    this.themeService.updateNeutralVariantColor(color);
  }

  clearNeutralVariantColor(): void {
    this.neutralVariantColor = undefined;
    this.themeService.updateNeutralVariantColor(undefined);
  }

  updateErrorColor(color: string): void {
    this.errorColor = color;
    this.themeService.updateErrorColor(color);
  }

  clearErrorColor(): void {
    this.errorColor = undefined;
    this.themeService.updateErrorColor(undefined);
  }

  updateThemeMode(mode: ThemeMode): void {
    this.themeMode = mode;
    this.themeService.setThemeMode(mode);
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  resetToDefaults(): void {
    this.primaryColor = '#6750A4'; // Default M3 primary
    this.secondaryColor = undefined;
    this.tertiaryColor = undefined;
    this.neutralColor = undefined;
    this.neutralVariantColor = undefined;
    this.errorColor = undefined;

    this.themeService.setThemeColors(
      this.primaryColor,
      this.secondaryColor,
      this.tertiaryColor,
      this.neutralColor,
      this.neutralVariantColor,
      this.errorColor
    );
  }
}
