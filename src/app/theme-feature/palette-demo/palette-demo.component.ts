import { Component, OnInit, effect } from '@angular/core';
import { Material3ThemeService } from '../material3-theme.service';

interface ColorToken {
  name: string;
  variable: string;
  description: string;
}

@Component({
  selector: 'app-palette-demo',
  templateUrl: './palette-demo.component.html',
  styleUrls: ['./palette-demo.component.scss'],
  standalone: false
})
export class PaletteDemoComponent implements OnInit {
  // Color tokens for demonstration
  primaryTokens: ColorToken[] = [
    { name: 'Primary', variable: '--mat-sys-primary', description: 'Main brand color' },
    { name: 'On Primary', variable: '--mat-sys-on-primary', description: 'Text/icons on primary' },
    {
      name: 'Primary Container',
      variable: '--mat-sys-primary-container',
      description: 'Container with primary color'
    },
    {
      name: 'On Primary Container',
      variable: '--mat-sys-on-primary-container',
      description: 'Text/icons on primary container'
    }
  ];

  secondaryTokens: ColorToken[] = [
    { name: 'Secondary', variable: '--mat-sys-secondary', description: 'Secondary brand color' },
    {
      name: 'On Secondary',
      variable: '--mat-sys-on-secondary',
      description: 'Text/icons on secondary'
    },
    {
      name: 'Secondary Container',
      variable: '--mat-sys-secondary-container',
      description: 'Container with secondary color'
    },
    {
      name: 'On Secondary Container',
      variable: '--mat-sys-on-secondary-container',
      description: 'Text/icons on secondary container'
    }
  ];

  tertiaryTokens: ColorToken[] = [
    { name: 'Tertiary', variable: '--mat-sys-tertiary', description: 'Tertiary brand color' },
    {
      name: 'On Tertiary',
      variable: '--mat-sys-on-tertiary',
      description: 'Text/icons on tertiary'
    },
    {
      name: 'Tertiary Container',
      variable: '--mat-sys-tertiary-container',
      description: 'Container with tertiary color'
    },
    {
      name: 'On Tertiary Container',
      variable: '--mat-sys-on-tertiary-container',
      description: 'Text/icons on tertiary container'
    }
  ];

  surfaceTokens: ColorToken[] = [
    { name: 'Surface', variable: '--mat-sys-surface', description: 'Main surface color' },
    { name: 'On Surface', variable: '--mat-sys-on-surface', description: 'Text/icons on surface' },
    {
      name: 'Surface Container',
      variable: '--mat-sys-surface-container',
      description: 'Container surface'
    },
    {
      name: 'Surface Container High',
      variable: '--mat-sys-surface-container-high',
      description: 'Higher elevation surface'
    },
    {
      name: 'On Surface Variant',
      variable: '--mat-sys-on-surface-variant',
      description: 'Secondary text on surface'
    },
    { name: 'Outline', variable: '--mat-sys-outline', description: 'Border/divider color' }
  ];

  errorTokens: ColorToken[] = [
    { name: 'Error', variable: '--mat-sys-error', description: 'Error color' },
    { name: 'On Error', variable: '--mat-sys-on-error', description: 'Text/icons on error' },
    {
      name: 'Error Container',
      variable: '--mat-sys-error-container',
      description: 'Container with error color'
    },
    {
      name: 'On Error Container',
      variable: '--mat-sys-on-error-container',
      description: 'Text/icons on error container'
    }
  ];

  // Tonal palette values - populated dynamically
  tonalValues: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

  primaryTones: { tone: number; color: string }[] = [];
  secondaryTones: { tone: number; color: string }[] = [];
  tertiaryTones: { tone: number; color: string }[] = [];

  constructor(private themeService: Material3ThemeService) {}

  ngOnInit(): void {
    this.updatePalettes();

    effect(() => {
      // Reading the signal value will automatically track changes
      const _ = this.themeService.colorPalettes();
      this.updatePalettes();
    });
  }

  private updatePalettes(): void {
    // Get computed style to extract CSS variables
    const style = getComputedStyle(document.documentElement);

    // Extract tonal values for each palette
    this.primaryTones = this.tonalValues.map((tone) => ({
      tone,
      color: style.getPropertyValue(`--mat-primary-${tone}`) || ''
    }));

    this.secondaryTones = this.tonalValues.map((tone) => ({
      tone,
      color: style.getPropertyValue(`--mat-secondary-${tone}`) || ''
    }));

    this.tertiaryTones = this.tonalValues.map((tone) => ({
      tone,
      color: style.getPropertyValue(`--mat-tertiary-${tone}`) || ''
    }));
  }

  getColorValue(variable: string): string {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(variable) || '';
  }

  getContrastColor(hexColor: string): string {
    // If no color or invalid format, return black
    if (!hexColor || !hexColor.startsWith('#')) {
      return '#000000';
    }

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white for dark colors, black for light colors
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}
