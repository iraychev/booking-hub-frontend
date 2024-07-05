import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { ButtonComponent } from '../button/button.component';

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  booked: boolean;
  selected?: boolean;
}
@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  imports: [CommonModule, ButtonComponent],
})
export class CalendarComponent implements OnInit {
  currentMonth!: number;
  currentYear!: number;
  currentMonthName!: string;
  calendarDates: CalendarDate[] = [];
  weekDays: string[] = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  @Input() bookedDates: Date[] = [];
  selectedDates: Date[] = [];
  isSelectingRange: boolean = false;
  @Input() isRangeSelectionMode: boolean = false;
  @Output() selectedDatesChange: EventEmitter<Date[]> = new EventEmitter<
    Date[]
  >();

  constructor(public bookingService: BookingService) {}

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
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to make Monday the first day of the week
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

    for (let i = startDayOfWeek; i > 0; i--) {
      const date = {
        day: prevMonthDays - i + 1,
        month: this.currentMonth - 1,
        year: this.currentYear,
        booked: false,
      };
      this.calendarDates.push(date);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = {
        day: i,
        month: this.currentMonth,
        year: this.currentYear,
        booked: this.isDateBooked(new Date(this.currentYear, this.currentMonth, i)),
      };
      this.calendarDates.push(date);
    }
  }

  isDateBooked(date: Date): boolean {
    return this.bookedDates.some((bookedDate) =>
      this.isSameDay(bookedDate, date)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
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
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthIndex];
  }

  resetSelectedDates(): void {
    this.selectedDates = [];
    this.calendarDates.forEach((date) => (date.selected = false));
  }
  isDatePast(date: CalendarDate): boolean {
    const today = new Date();
    const calendarDate = new Date(date.year, date.month, date.day);
    return calendarDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  onDateClick(date: CalendarDate): void {
    if (date.booked || this.isDatePast(date) || !this.isRangeSelectionMode) {
      return;
    }

    if (this.selectedDates.length === 1) {
      const startDate = this.selectedDates[0];
      const endDate = new Date(date.year, date.month, date.day);

      if (endDate < startDate) {
        this.selectedDates = [endDate, startDate];
      } else {
        this.selectedDates.push(endDate);
      }
      this.markRangeDates();
    } else {
      this.selectedDates = [new Date(date.year, date.month, date.day)];
      this.calendarDates.forEach((d) => (d.selected = false));
      date.selected = true;
    }
    this.selectedDates = this.selectedDates.filter(
      (date, index, self) =>
        index === self.findIndex((d) => d.getTime() === date.getTime())
    );
    this.selectedDatesChange.emit(this.selectedDates);
  }

  markRangeDates(): void {
    if (this.selectedDates.length !== 2) {
      return;
    }
    const startDate = this.selectedDates[0];
    const endDate = this.selectedDates[1];

    let clearSelection = false;

    this.calendarDates.forEach((date) => {
      const currentDate = new Date(date.year, date.month, date.day);
      date.selected = currentDate >= startDate && currentDate <= endDate;

      if (date.selected && this.isDateBooked(currentDate)) {
        clearSelection = true;
      }

      if (date.selected) this.selectedDates.push(currentDate);
    });

    if (clearSelection) this.resetSelectedDates();

    this.selectedDates = this.selectedDates.filter(
      (date, index, self) =>
        index === self.findIndex((d) => d.getTime() === date.getTime())
    );
    this.selectedDatesChange.emit(this.selectedDates);
  }
}
