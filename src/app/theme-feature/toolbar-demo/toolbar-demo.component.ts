import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar-demo',
  templateUrl: './toolbar-demo.component.html',
  styleUrls: ['./toolbar-demo.component.scss'],
  standalone: false
})
export class ToolbarDemoComponent {
  // Mock navigation items
  navItems = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Profile', icon: 'person', route: '/profile' }
  ];
}
