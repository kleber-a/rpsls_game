import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarRef } from '@angular/material/snack-bar';

interface DataSnackBar {
  status: string;
  message: string
}

@Component({
  selector: 'app-snack-bar',
  imports: [MatButtonModule],
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  snackBarRef = inject(MatSnackBarRef);

  data = signal<DataSnackBar>({
    status: 'info',
    message: ''
  })
  icon = signal<string>('')
  color = signal<string>('')

  ngOnInit(): void {
    this.data.set(this.snackBarRef.containerInstance.snackBarConfig.data)
     switch (this.data().status) {
      case 'success':
        this.icon.set('✅');
        this.color.set('green');
        break;
      case 'error':
        this.icon.set('❌');
        this.color.set('red');
        break;
      case 'info':
        this.icon.set('ℹ️');
        this.color.set('blue');
        break;
      default:
        this.icon.set('');
        this.color.set('black');
    }
    console.log('snackBarRef', this.data())
  }

  getIcon(status: string) {
    switch (status) {
      case 'success': return '\u2705';
      case 'error': return '\u274C';
      case 'info': return '\u2139';
      default: return '';
    }
  }


}
