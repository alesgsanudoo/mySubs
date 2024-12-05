import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import {addMonths, addYears, differenceInMonths, getDate, getYear, isAfter} from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function calculateNextBillingMonthly(date) {
  const [year, month, day] = date.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  const firstBillingDate = new Date(year, month - 1, day);
  let nextBillingDate;

  const currentDate = new Date();

  let monthsOffset = differenceInMonths(currentDate, firstBillingDate);
  nextBillingDate = addMonths(firstBillingDate, monthsOffset);


  if (!isAfter(nextBillingDate, currentDate) && getDate(nextBillingDate) !== getDate(currentDate)) {
    monthsOffset += 1;
    nextBillingDate = addMonths(firstBillingDate, monthsOffset);
  }

  if (getYear(nextBillingDate) < getYear(currentDate)) {
    nextBillingDate = addYears(nextBillingDate, 1);
  }


  return nextBillingDate
}

export function calculateNextBillingYearly(date) {
  const [year, month, day] = date.split('-').map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  const currentDate = new Date();
  let nextBillingDate;
  if (currentDate.getFullYear() >= year) {
    nextBillingDate = new Date(currentDate.getFullYear(), month - 1, day);

    if (nextBillingDate < currentDate && getDate(currentDate) !== getDate(nextBillingDate)) {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }
  } else {
    nextBillingDate = new Date(year, month - 1, day);
  }

  return nextBillingDate;
}