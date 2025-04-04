import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolBarService {
  private _isVisible = new BehaviorSubject<boolean>(false);
  isVisible$ = this._isVisible.asObservable();

  show() {
    this._isVisible.next(false);
  }

  hide() {
    this._isVisible.next(true);
  }
}
