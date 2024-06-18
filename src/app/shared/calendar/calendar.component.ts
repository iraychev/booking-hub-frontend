import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { ButtonComponent } from "../button/button.component";

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  booked: boolean;
}
@Component({
    selector: 'app-calendar',
    standalone: true,
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: [CommonModule, ButtonComponent]
})
export class CalendarComponent implements OnInit {

  currentMonth!: number;
  currentYear!: number;
  currentMonthName!: string;
  calendarDates: CalendarDate[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  @Input() bookedDates: Date[] = [];

  constructor(public bookingService: BookingService) { }

  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarDates = [];

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Fill previous days from the last month
    const startDayOfWeek = firstDayOfMonth.getDay();
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startDayOfWeek; i > 0; i--) {
      const date = { day: prevMonthDays - i + 1, month: this.currentMonth - 1, year: this.currentYear, booked: false };
      this.calendarDates.push(date);
    }

    // Fill current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = { day: i, month: this.currentMonth, year: this.currentYear, booked: this.isDateBooked(new Date(this.currentYear, this.currentMonth, i)) };
      this.calendarDates.push(date);
    }
  }

  isDateBooked(date: Date): boolean {
    return this.bookedDates.some(bookedDate => this.isSameDay(bookedDate, date));
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.generateCalendar();
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.currentMonthName = this.getMonthName(this.currentMonth);
    this.generateCalendar();
  }

  getMonthName(monthIndex: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  }
}