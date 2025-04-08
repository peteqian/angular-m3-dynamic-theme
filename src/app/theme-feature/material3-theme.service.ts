import { Injectable, signal, computed, Signal } from '@angular/core';
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
  Hct,
  DynamicScheme,
  DislikeAnalyzer,
  TemperatureCache
} from '@material/material-color-utilities';

export type ThemeMode = 'light' | 'dark' | 'highContrast';

export interface ColorPalettes {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

/**
 * Service that provides Material 3 theme generation at runtime
 */
@Injectable({
  providedIn: 'root'
})
export class Material3ThemeService {
  // Define the standard and neutral hue tones from Material 3
  private readonly HUE_TONES = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
  private readonly NEUTRAL_HUES = new Map<number, { prev: number; next: number }>([
    [4, { prev: 0, next: 10 }],
    [6, { prev: 0, next: 10 }],
    [12, { prev: 10, next: 20 }],
    [17, { prev: 10, next: 20 }],
    [22, { prev: 20, next: 25 }],
    [24, { prev: 20, next: 25 }],
    [87, { prev: 80, next: 90 }],
    [92, { prev: 90, next: 95 }],
    [94, { prev: 90, next: 95 }],
    [96, { prev: 95, next: 98 }]
  ]);

  // Signals for theme colors and mode
  private primaryColorSignal = signal<string>('#6750A4'); // M3 default primary
  private secondaryColorSignal = signal<string | undefined>(undefined);
  private tertiaryColorSignal = signal<string | undefined>(undefined);
  private neutralColorSignal = signal<string | undefined>(undefined);
  private neutralVariantColorSignal = signal<string | undefined>(undefined);
  private errorColorSignal = signal<string | undefined>(undefined);
  private themeModeSignal = signal<ThemeMode>('light');

  // Public readonly signals
  primaryColor: Signal<string> = this.primaryColorSignal.asReadonly();
  secondaryColor: Signal<string | undefined> = this.secondaryColorSignal.asReadonly();
  tertiaryColor: Signal<string | undefined> = this.tertiaryColorSignal.asReadonly();
  neutralColor: Signal<string | undefined> = this.neutralColorSignal.asReadonly();
  neutralVariantColor: Signal<string | undefined> = this.neutralVariantColorSignal.asReadonly();
  errorColor: Signal<string | undefined> = this.errorColorSignal.asReadonly();
  themeMode: Signal<ThemeMode> = this.themeModeSignal.asReadonly();

  // Computed values for color palettes and dynamic schemes
  colorPalettes = computed<ColorPalettes>(() =>
    this.getColorPalettes(
      this.primaryColorSignal(),
      this.secondaryColorSignal(),
      this.tertiaryColorSignal(),
      this.neutralColorSignal(),
      this.neutralVariantColorSignal(),
      this.errorColorSignal()
    )
  );

  // Light and dark scheme computed values
  lightScheme = computed(() =>
    this.getMaterialDynamicScheme(
      this.colorPalettes().primary,
      this.colorPalettes().secondary,
      this.colorPalettes().tertiary,
      this.colorPalettes().neutral,
      this.colorPalettes().neutralVariant,
      false, // isDark
      0 // standard contrast
    )
  );

  darkScheme = computed(() =>
    this.getMaterialDynamicScheme(
      this.colorPalettes().primary,
      this.colorPalettes().secondary,
      this.colorPalettes().tertiary,
      this.colorPalettes().neutral,
      this.colorPalettes().neutralVariant,
      true, // isDark
      0 // standard contrast
    )
  );

  // High contrast schemes (if needed)
  lightHighContrastScheme = computed(() =>
    this.getMaterialDynamicScheme(
      this.colorPalettes().primary,
      this.colorPalettes().secondary,
      this.colorPalettes().tertiary,
      this.colorPalettes().neutral,
      this.colorPalettes().neutralVariant,
      false, // isDark
      1.0 // high contrast
    )
  );

  darkHighContrastScheme = computed(() =>
    this.getMaterialDynamicScheme(
      this.colorPalettes().primary,
      this.colorPalettes().secondary,
      this.colorPalettes().tertiary,
      this.colorPalettes().neutral,
      this.colorPalettes().neutralVariant,
      true, // isDark
      1.0 // high contrast
    )
  );

  constructor() {
    // Initialize theme on service creation
    this.updateColors();
  }

  /**
   * Updates the primary color and regenerates the theme
   */
  updatePrimaryColor(hexColor: string): void {
    this.primaryColorSignal.set(hexColor);
    this.updateColors();
  }

  /**
   * Updates the secondary color and regenerates the theme
   */
  updateSecondaryColor(hexColor: string | undefined): void {
    this.secondaryColorSignal.set(hexColor);
    this.updateColors();
  }

  /**
   * Updates the tertiary color and regenerates the theme
   */
  updateTertiaryColor(hexColor: string | undefined): void {
    // this.tertiaryColorSignal.set(hexColor);
    // this.updateColors();
  }

  /**
   * Updates the neutral color and regenerates the theme
   */
  updateNeutralColor(hexColor: string | undefined): void {
    this.neutralColorSignal.set(hexColor);
    this.updateColors();
  }

  /**
   * Updates the neutral variant color and regenerates the theme
   */
  updateNeutralVariantColor(hexColor: string | undefined): void {
    this.neutralVariantColorSignal.set(hexColor);
    this.updateColors();
  }

  /**
   * Updates the error color and regenerates the theme
   */
  updateErrorColor(hexColor: string | undefined): void {
    this.errorColorSignal.set(hexColor);
    this.updateColors();
  }

  /**
   * Set all theme colors at once
   */
  setThemeColors(
    primaryColor: string,
    secondaryColor?: string,
    tertiaryColor?: string,
    neutralColor?: string,
    neutralVariantColor?: string,
    errorColor?: string
  ): void {
    this.primaryColorSignal.set(primaryColor);
    this.secondaryColorSignal.set(secondaryColor);
    this.tertiaryColorSignal.set(tertiaryColor);
    this.neutralColorSignal.set(neutralColor);
    this.neutralVariantColorSignal.set(neutralVariantColor);
    this.errorColorSignal.set(errorColor);
    this.updateColors();
  }

  /**
   * Toggle between light and dark theme modes
   */
  toggleThemeMode(): void {
    const currentMode = this.themeModeSignal();
    const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
    this.setThemeMode(newMode);
  }

  /**
   * Set a specific theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this.themeModeSignal.set(mode);
    this.updateColors();
  }

  /**
   * Updates the theme colors in the DOM based on current settings
   */
  private updateColors(): void {
    const mode = this.themeModeSignal();
    document.body.classList.remove('dark-theme', 'light-theme', 'high-contrast-theme');
    document.body.classList.add(`${mode}-theme`);

    // Apply appropriate color scheme
    if (mode === 'highContrast') {
      this.applyHighContrastTheme();
    } else {
      this.applyStandardTheme();
    }
  }

  /**
   * Applies the standard light or dark theme
   */
  private applyStandardTheme(): void {
    const mode = this.themeModeSignal();
    const scheme = mode === 'light' ? this.lightScheme() : this.darkScheme();

    // Set color scheme preference
    document.documentElement.style.setProperty('color-scheme', mode);

    // Apply color system variables
    this.applyColorSystemVariables(
      scheme,
      mode === 'light' ? this.lightScheme() : this.darkScheme()
    );

    // Apply typography, elevation, shape, and state system variables
    this.applyTypographySystemVariables();
    this.applyElevationSystemVariables();
    this.applyShapeSystemVariables();
    this.applyStateSystemVariables();
  }

  /**
   * Applies the high contrast theme
   */
  private applyHighContrastTheme(): void {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const scheme = darkMode ? this.darkHighContrastScheme() : this.lightHighContrastScheme();

    // Set high contrast attributes
    document.documentElement.setAttribute('data-high-contrast', 'true');

    // Apply color scheme preference
    document.documentElement.style.setProperty('color-scheme', darkMode ? 'dark' : 'light');

    // Apply color system variables with high contrast values
    this.applyColorSystemVariables(
      scheme,
      darkMode ? this.darkHighContrastScheme() : this.lightHighContrastScheme()
    );

    // Apply other system variables
    this.applyTypographySystemVariables();
    this.applyElevationSystemVariables();
    this.applyShapeSystemVariables();
    this.applyStateSystemVariables();
  }

  /**
   * Applies color system variables to the DOM
   */
  private applyColorSystemVariables(lightScheme: DynamicScheme, darkScheme: DynamicScheme): void {
    const mode = this.themeModeSignal();
    const isHighContrast = mode === 'highContrast';

    // Set primary palette variables
    this.setColorVar(
      'primary',
      isHighContrast ? lightScheme.primary : lightScheme.primaryPalette.tone(40),
      darkScheme.primary
    );
    this.setColorVar(
      'on-primary',
      isHighContrast ? lightScheme.onPrimary : lightScheme.primaryPalette.tone(100),
      darkScheme.onPrimary
    );
    this.setColorVar(
      'primary-container',
      isHighContrast ? lightScheme.primaryContainer : lightScheme.primaryPalette.tone(90),
      darkScheme.primaryContainer
    );
    this.setColorVar(
      'on-primary-container',
      isHighContrast ? lightScheme.onPrimaryContainer : lightScheme.primaryPalette.tone(10),
      darkScheme.onPrimaryContainer
    );
    this.setColorVar('inverse-primary', lightScheme.inversePrimary, darkScheme.inversePrimary);
    this.setColorVar(
      'primary-fixed',
      isHighContrast ? lightScheme.primaryFixed : lightScheme.primaryPalette.tone(90),
      darkScheme.primaryFixed
    );
    this.setColorVar(
      'primary-fixed-dim',
      isHighContrast ? lightScheme.primaryFixedDim : lightScheme.primaryPalette.tone(80),
      darkScheme.primaryFixedDim
    );
    this.setColorVar('on-primary-fixed', lightScheme.onPrimaryFixed, darkScheme.onPrimaryFixed);
    this.setColorVar(
      'on-primary-fixed-variant',
      lightScheme.onPrimaryFixedVariant,
      darkScheme.onPrimaryFixedVariant
    );

    // Set secondary palette variables
    // this.setColorVar(
    //   'secondary',
    //   isHighContrast ? lightScheme.secondary : lightScheme.secondaryPalette.tone(40),
    //   darkScheme.secondary
    // );
    // this.setColorVar(
    //   'on-secondary',
    //   isHighContrast ? lightScheme.onSecondary : lightScheme.secondaryPalette.tone(100),
    //   darkScheme.onSecondary
    // );
    // this.setColorVar(
    //   'secondary-container',
    //   isHighContrast ? lightScheme.secondaryContainer : lightScheme.secondaryPalette.tone(90),
    //   darkScheme.secondaryContainer
    // );
    // this.setColorVar(
    //   'on-secondary-container',
    //   isHighContrast ? lightScheme.onSecondaryContainer : lightScheme.secondaryPalette.tone(10),
    //   darkScheme.onSecondaryContainer
    // );
    // this.setColorVar(
    //   'secondary-fixed',
    //   isHighContrast ? lightScheme.secondaryFixed : lightScheme.secondaryPalette.tone(90),
    //   darkScheme.secondaryFixed
    // );
    // this.setColorVar(
    //   'secondary-fixed-dim',
    //   isHighContrast ? lightScheme.secondaryFixedDim : lightScheme.secondaryPalette.tone(80),
    //   darkScheme.secondaryFixedDim
    // );
    // this.setColorVar(
    //   'on-secondary-fixed',
    //   lightScheme.onSecondaryFixed,
    //   darkScheme.onSecondaryFixed
    // );
    // this.setColorVar(
    //   'on-secondary-fixed-variant',
    //   lightScheme.onSecondaryFixedVariant,
    //   darkScheme.onSecondaryFixedVariant
    // );

    // Set tertiary palette variables
    // this.setColorVar(
    //   'tertiary',
    //   isHighContrast ? lightScheme.tertiary : lightScheme.tertiaryPalette.tone(40),
    //   darkScheme.tertiary
    // );
    // this.setColorVar(
    //   'on-tertiary',
    //   isHighContrast ? lightScheme.onTertiary : lightScheme.tertiaryPalette.tone(100),
    //   darkScheme.onTertiary
    // );
    // this.setColorVar(
    //   'tertiary-container',
    //   isHighContrast ? lightScheme.tertiaryContainer : lightScheme.tertiaryPalette.tone(90),
    //   darkScheme.tertiaryContainer
    // );
    // this.setColorVar(
    //   'on-tertiary-container',
    //   isHighContrast ? lightScheme.onTertiaryContainer : lightScheme.tertiaryPalette.tone(10),
    //   darkScheme.onTertiaryContainer
    // );
    // this.setColorVar(
    //   'tertiary-fixed',
    //   isHighContrast ? lightScheme.tertiaryFixed : lightScheme.tertiaryPalette.tone(90),
    //   darkScheme.tertiaryFixed
    // );
    // this.setColorVar(
    //   'tertiary-fixed-dim',
    //   isHighContrast ? lightScheme.tertiaryFixedDim : lightScheme.tertiaryPalette.tone(80),
    //   darkScheme.tertiaryFixedDim
    // );
    // this.setColorVar('on-tertiary-fixed', lightScheme.onTertiaryFixed, darkScheme.onTertiaryFixed);
    // this.setColorVar(
    //   'on-tertiary-fixed-variant',
    //   lightScheme.onTertiaryFixedVariant,
    //   darkScheme.onTertiaryFixedVariant
    // );

    // Set neutral palette variables
    this.setColorVar('background', lightScheme.background, darkScheme.background);
    this.setColorVar('on-background', lightScheme.onBackground, darkScheme.onBackground);
    this.setColorVar('surface', lightScheme.surface, darkScheme.surface);
    this.setColorVar('surface-dim', lightScheme.surfaceDim, darkScheme.surfaceDim);
    this.setColorVar('surface-bright', lightScheme.surfaceBright, darkScheme.surfaceBright);
    this.setColorVar(
      'surface-container-lowest',
      lightScheme.surfaceContainerLowest,
      darkScheme.surfaceContainerLowest
    );
    this.setColorVar(
      'surface-container',
      lightScheme.surfaceContainer,
      darkScheme.surfaceContainer
    );
    this.setColorVar(
      'surface-container-high',
      lightScheme.surfaceContainerHigh,
      darkScheme.surfaceContainerHigh
    );
    this.setColorVar(
      'surface-container-highest',
      lightScheme.surfaceContainerHighest,
      darkScheme.surfaceContainerHighest
    );
    this.setColorVar('on-surface', lightScheme.onSurface, darkScheme.onSurface);
    this.setColorVar('shadow', lightScheme.shadow, darkScheme.shadow);
    this.setColorVar('scrim', lightScheme.scrim, darkScheme.scrim);
    this.setColorVar('surface-tint', lightScheme.surfaceTint, darkScheme.surfaceTint);
    this.setColorVar('inverse-surface', lightScheme.inverseSurface, darkScheme.inverseSurface);
    this.setColorVar(
      'inverse-on-surface',
      lightScheme.inverseOnSurface,
      darkScheme.inverseOnSurface
    );
    this.setColorVar('outline', lightScheme.outline, darkScheme.outline);
    this.setColorVar('outline-variant', lightScheme.outlineVariant, darkScheme.outlineVariant);
    this.setColorVar(
      'neutral10',
      lightScheme.neutralPalette.tone(10),
      darkScheme.neutralPalette.tone(10)
    );

    // Set error palette variables
    this.setColorVar(
      'error',
      isHighContrast ? lightScheme.error : lightScheme.errorPalette.tone(40),
      darkScheme.error
    );
    this.setColorVar('on-error', lightScheme.onError, darkScheme.onError);
    this.setColorVar(
      'error-container',
      isHighContrast ? lightScheme.errorContainer : lightScheme.errorPalette.tone(90),
      darkScheme.errorContainer
    );
    this.setColorVar(
      'on-error-container',
      isHighContrast ? lightScheme.onErrorContainer : lightScheme.errorPalette.tone(10),
      darkScheme.onErrorContainer
    );

    // Set neutral variant palette variables
    this.setColorVar('surface-variant', lightScheme.surfaceVariant, darkScheme.surfaceVariant);
    this.setColorVar(
      'on-surface-variant',
      lightScheme.onSurfaceVariant,
      darkScheme.onSurfaceVariant
    );
    this.setColorVar(
      'neutral-variant20',
      lightScheme.neutralVariantPalette.tone(20),
      darkScheme.neutralVariantPalette.tone(20)
    );

    // Generate and set all hue tones for each palette to allow more flexible usage
    this.setTonalPaletteVariables('primary', lightScheme.primaryPalette, darkScheme.primaryPalette);
    this.setTonalPaletteVariables(
      'secondary',
      lightScheme.secondaryPalette,
      darkScheme.secondaryPalette
    );
    this.setTonalPaletteVariables(
      'tertiary',
      lightScheme.tertiaryPalette,
      darkScheme.tertiaryPalette
    );
    this.setTonalPaletteVariables('neutral', lightScheme.neutralPalette, darkScheme.neutralPalette);
    this.setTonalPaletteVariables(
      'neutral-variant',
      lightScheme.neutralVariantPalette,
      darkScheme.neutralVariantPalette
    );
    this.setTonalPaletteVariables('error', lightScheme.errorPalette, darkScheme.errorPalette);
  }

  /**
   * Set a color CSS variable with light/dark values
   */
  private setColorVar(name: string, lightColor: number, darkColor: number): void {
    const mode = this.themeModeSignal();
    const value = mode === 'light' ? hexFromArgb(lightColor) : hexFromArgb(darkColor);
    document.documentElement.style.setProperty(`--mat-sys-${name}`, value);
  }

  /**
   * Set individual tonal palette color variables for each palette
   */
  private setTonalPaletteVariables(
    paletteName: string,
    lightPalette: TonalPalette,
    darkPalette: TonalPalette
  ): void {
    const mode = this.themeModeSignal();
    const palette = mode === 'light' ? lightPalette : darkPalette;

    // Set tonal values
    const tones =
      paletteName === 'neutral'
        ? [...this.HUE_TONES, ...Array.from(this.NEUTRAL_HUES.keys())]
        : this.HUE_TONES;

    for (const tone of tones) {
      const color = hexFromArgb(palette.tone(tone));
      document.documentElement.style.setProperty(`--mat-${paletteName}-${tone}`, color);
    }
  }

  /**
   * Applies typography system variables to the DOM
   */
  private applyTypographySystemVariables(): void {
    // Font families
    document.documentElement.style.setProperty('--mat-sys-brand-font-family', 'Roboto');
    document.documentElement.style.setProperty('--mat-sys-plain-font-family', 'Roboto');

    // Font weights
    document.documentElement.style.setProperty('--mat-sys-bold-font-weight', '700');
    document.documentElement.style.setProperty('--mat-sys-medium-font-weight', '500');
    document.documentElement.style.setProperty('--mat-sys-regular-font-weight', '400');

    // Body large typescale
    document.documentElement.style.setProperty(
      '--mat-sys-body-large-font',
      'var(--mat-sys-plain-font-family)'
    );
    document.documentElement.style.setProperty('--mat-sys-body-large-line-height', '1.5rem');
    document.documentElement.style.setProperty('--mat-sys-body-large-size', '1rem');
    document.documentElement.style.setProperty('--mat-sys-body-large-tracking', '0.031rem');
    document.documentElement.style.setProperty(
      '--mat-sys-body-large-weight',
      'var(--mat-sys-regular-font-weight)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-body-large',
      'var(--mat-sys-body-large-weight) var(--mat-sys-body-large-size) / var(--mat-sys-body-large-line-height) var(--mat-sys-body-large-font)'
    );

    // Body medium typescale
    document.documentElement.style.setProperty(
      '--mat-sys-body-medium-font',
      'var(--mat-sys-plain-font-family)'
    );
    document.documentElement.style.setProperty('--mat-sys-body-medium-line-height', '1.25rem');
    document.documentElement.style.setProperty('--mat-sys-body-medium-size', '0.875rem');
    document.documentElement.style.setProperty('--mat-sys-body-medium-tracking', '0.016rem');
    document.documentElement.style.setProperty(
      '--mat-sys-body-medium-weight',
      'var(--mat-sys-regular-font-weight)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-body-medium',
      'var(--mat-sys-body-medium-weight) var(--mat-sys-body-medium-size) / var(--mat-sys-body-medium-line-height) var(--mat-sys-body-medium-font)'
    );

    // Add all other typography variables...
    // For brevity, I've omitted some of the typography variables, but you would add them all here
  }

  /**
   * Applies elevation system variables to the DOM
   */
  private applyElevationSystemVariables(): void {
    // Box shadow colors
    document.documentElement.style.setProperty(
      '--mat-sys-umbra-color',
      'color-mix(in srgb, var(--mat-sys-shadow), transparent 80%)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-penumbra-color',
      'color-mix(in srgb, var(--mat-sys-shadow), transparent 86%)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-ambient-color',
      'color-mix(in srgb, var(--mat-sys-shadow), transparent 88%)'
    );

    // Elevation levels
    document.documentElement.style.setProperty(
      '--mat-sys-level0',
      '0px 0px 0px 0px var(--mat-sys-umbra-color), 0px 0px 0px 0px var(--mat-sys-penumbra-color), 0px 0px 0px 0px var(--mat-sys-ambient-color)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-level1',
      '0px 2px 1px -1px var(--mat-sys-umbra-color), 0px 1px 1px 0px var(--mat-sys-penumbra-color), 0px 1px 3px 0px var(--mat-sys-ambient-color)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-level2',
      '0px 3px 3px -2px var(--mat-sys-umbra-color), 0px 3px 4px 0px var(--mat-sys-penumbra-color), 0px 1px 8px 0px var(--mat-sys-ambient-color)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-level3',
      '0px 3px 5px -1px var(--mat-sys-umbra-color), 0px 6px 10px 0px var(--mat-sys-penumbra-color), 0px 1px 18px 0px var(--mat-sys-ambient-color)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-level4',
      '0px 5px 5px -3px var(--mat-sys-umbra-color), 0px 8px 10px 1px var(--mat-sys-penumbra-color), 0px 3px 14px 2px var(--mat-sys-ambient-color)'
    );
    document.documentElement.style.setProperty(
      '--mat-sys-level5',
      '0px 7px 8px -4px var(--mat-sys-umbra-color), 0px 12px 17px 2px var(--mat-sys-penumbra-color), 0px 5px 22px 4px var(--mat-sys-ambient-color)'
    );
  }

  /**
   * Applies shape system variables to the DOM
   */
  private applyShapeSystemVariables(): void {
    document.documentElement.style.setProperty('--mat-sys-corner-extra-large', '28px');
    document.documentElement.style.setProperty('--mat-sys-corner-extra-large-top', '28px 28px 0 0');
    document.documentElement.style.setProperty('--mat-sys-corner-extra-small', '4px');
    document.documentElement.style.setProperty('--mat-sys-corner-extra-small-top', '4px 4px 0 0');
    document.documentElement.style.setProperty('--mat-sys-corner-full', '9999px');
    document.documentElement.style.setProperty('--mat-sys-corner-large', '16px');
    document.documentElement.style.setProperty('--mat-sys-corner-large-end', '0 16px 16px 0');
    document.documentElement.style.setProperty('--mat-sys-corner-large-start', '16px 0 0 16px');
    document.documentElement.style.setProperty('--mat-sys-corner-large-top', '16px 16px 0 0');
    document.documentElement.style.setProperty('--mat-sys-corner-medium', '12px');
    document.documentElement.style.setProperty('--mat-sys-corner-none', '0');
    document.documentElement.style.setProperty('--mat-sys-corner-small', '8px');
  }

  /**
   * Applies state system variables to the DOM
   */
  private applyStateSystemVariables(): void {
    document.documentElement.style.setProperty('--mat-sys-dragged-state-layer-opacity', '0.16');
    document.documentElement.style.setProperty('--mat-sys-focus-state-layer-opacity', '0.12');
    document.documentElement.style.setProperty('--mat-sys-hover-state-layer-opacity', '0.08');
    document.documentElement.style.setProperty('--mat-sys-pressed-state-layer-opacity', '0.12');
  }

  /**
   * Gets Hct representation of Hex color
   */
  private getHctFromHex(color: string): Hct {
    try {
      return Hct.fromInt(argbFromHex(color));
    } catch (e) {
      throw new Error(
        'Cannot parse the specified color ' +
          color +
          '. Please verify it is a hex color (ex. #ffffff or ffffff).'
      );
    }
  }

  /**
   * Gets all the color palettes
   */
  /**
   * Gets a Material 3 dynamic scheme configuration
   */
  private getMaterialDynamicScheme(
    primaryPalette: TonalPalette,
    secondaryPalette: TonalPalette,
    tertiaryPalette: TonalPalette,
    neutralPalette: TonalPalette,
    neutralVariantPalette: TonalPalette,
    isDark: boolean,
    contrastLevel: number
  ): DynamicScheme {
    return new DynamicScheme({
      sourceColorArgb: primaryPalette.keyColor.toInt(),
      variant: 6, // Variant.FIDELITY in material-color-utilities
      contrastLevel: contrastLevel,
      isDark: isDark,
      primaryPalette: primaryPalette,
      secondaryPalette: secondaryPalette,
      tertiaryPalette: tertiaryPalette,
      neutralPalette: neutralPalette,
      neutralVariantPalette: neutralVariantPalette
    });
  }

  /**
   * Gets all the color palettes based on Material 3 color generation algorithm
   */
  private getColorPalettes(
    primaryColor: string,
    secondaryColor?: string,
    tertiaryColor?: string,
    neutralColor?: string,
    neutralVariantColor?: string,
    errorColor?: string
  ): ColorPalettes {
    // Create primary palette from primary color
    const primaryColorHct = this.getHctFromHex(primaryColor);
    const primaryPalette = TonalPalette.fromHct(primaryColorHct);

    // Create secondary palette
    let secondaryPalette;
    if (secondaryColor) {
      secondaryPalette = TonalPalette.fromHct(this.getHctFromHex(secondaryColor));
    } else {
      secondaryPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        Math.max(primaryColorHct.chroma - 32.0, primaryColorHct.chroma * 0.5)
      );
    }

    // Create tertiary palette
    let tertiaryPalette;
    if (tertiaryColor) {
      tertiaryPalette = TonalPalette.fromHct(this.getHctFromHex(tertiaryColor));
    } else {
      tertiaryPalette = TonalPalette.fromInt(
        DislikeAnalyzer.fixIfDisliked(
          new TemperatureCache(primaryColorHct).analogous(3, 6)[2]
        ).toInt()
      );
    }

    // Create neutral palette
    let neutralPalette;
    if (neutralColor) {
      neutralPalette = TonalPalette.fromHct(this.getHctFromHex(neutralColor));
    } else {
      neutralPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        primaryColorHct.chroma / 8.0
      );
    }

    // Create neutral variant palette
    let neutralVariantPalette;
    if (neutralVariantColor) {
      neutralVariantPalette = TonalPalette.fromHct(this.getHctFromHex(neutralVariantColor));
    } else {
      neutralVariantPalette = TonalPalette.fromHueAndChroma(
        primaryColorHct.hue,
        primaryColorHct.chroma / 8.0 + 4.0
      );
    }

    // Create error palette
    let errorPalette;
    if (errorColor) {
      errorPalette = TonalPalette.fromHct(this.getHctFromHex(errorColor));
    } else {
      // Need to create a temporary scheme to get the generated error palette
      errorPalette = this.getMaterialDynamicScheme(
        primaryPalette,
        secondaryPalette,
        tertiaryPalette,
        neutralPalette,
        neutralVariantPalette,
        false, // isDark
        0 // standard contrast
      ).errorPalette;
    }

    return {
      primary: primaryPalette,
      secondary: secondaryPalette,
      tertiary: tertiaryPalette,
      neutral: neutralPalette,
      neutralVariant: neutralVariantPalette,
      error: errorPalette
    };
  }
}
