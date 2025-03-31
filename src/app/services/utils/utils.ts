import { throwError } from 'rxjs';
import { ToastType } from '../../constants/toast-types';
import { Month } from '../../constants/months';
import { ToastrService } from '../toastr.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  constructor(private toastr: ToastrService){
  }

  public buildError(message: string, error: any) {
    this.toastr.showToastTc(ToastType.ERROR, message);
    console.error(error);
    return throwError(() => new Error(message + ', ' + error));
  }

  public buildErrorThrow(message: string, error: any) {
    console.error(error);
    return throwError(() => new Error(message + ', ' + error));
  }

  public buildSuccess(message: string, data: any) {
    this.toastr.showToastTc(ToastType.SUCCESS, message);
    console.info(message +': ', data);
  }

  public buildSuccessLogInfo(message: string, data: any) {
    console.info(message +': ', data);
  }

  public formatChartData(data: { [key: number]: number }): any[] {
    return Object.keys(Month)
      .filter((key) => isNaN(Number(key)))
      .map((month) => ({
        name: month, // Month name as string
        value: data[Month[month as keyof typeof Month]] || 0,
      }));
  }
}
