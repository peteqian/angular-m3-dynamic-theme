import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeControlsComponent } from './theme-controls/theme-controls.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { PaletteDemoComponent } from './palette-demo/palette-demo.component';

import { Material3ThemeService } from './material3-theme.service';
import { MaterialComponentsDemoComponent } from './material-components/material-components-demo.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToolbarDemoComponent } from './toolbar-demo/toolbar-demo.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ThemeControlsComponent,
    ColorPickerComponent,
    PaletteDemoComponent,
    MaterialComponentsDemoComponent,
    ToolbarDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatToolbarModule
  ],
  exports: [
    ThemeControlsComponent,
    ColorPickerComponent,
    PaletteDemoComponent,
    MaterialComponentsDemoComponent,
    ToolbarDemoComponent
  ],
  providers: [Material3ThemeService]
})
export class ThemeModule {}
