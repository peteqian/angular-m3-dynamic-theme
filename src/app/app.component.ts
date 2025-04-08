import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Material3ThemeService } from './theme-feature/material3-theme.service';
import { ThemeModule } from './theme-feature/theme.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Material 3 Runtime Theme Demo';

  constructor(private themeService: Material3ThemeService) {
    // Initialize with default theme colors
    this.themeService.setThemeColors('#6750A4'); // Material 3 default primary color
  }
}
