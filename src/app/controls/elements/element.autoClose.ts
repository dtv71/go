import { NgZone } from '@angular/core';
import { Observable, fromEvent, race } from 'rxjs';
import { filter, takeUntil, tap, withLatestFrom, delay, map } from 'rxjs/operators';

function isContainedIn(element: HTMLElement, array?: HTMLElement[]) {
    return array ? array.some(item => item.contains(element)) : false
}
function matchesSelector(element: HTMLElement, selector?: string) {
    if (!selector) { return null }
    return element.closest(selector);
}

// we have to add a more significant delay to avoid re-opening when handling (click) on a toggling element
// TODO: use proper Angular platform detection when NgbAutoClose becomes a service and we can inject PLATFORM_ID
const isMobile = (() => {
    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    const isAndroid = () => /Android/.test(navigator.userAgent);

    return typeof navigator !== 'undefined' ? !!navigator.userAgent && (isIOS() || isAndroid()) : false;
})();

// setting 'ngbAutoClose' synchronously on mobile results in immediate popup closing
// when tapping on the triggering element
const wrapAsyncForMobile = (fn: any) => isMobile ? () => setTimeout(() => fn(), 100) : fn;

export function autoClose(
    zone: NgZone, document: any,
    type: boolean | 'inside' | 'outside',
    close: () => void,
    closed$: Observable<any>,
    insideElements: HTMLElement[],
    ignoreElements?: HTMLElement[],
    insideSelector?: string
) {
    if (type) { // closing on ESC and outside clicks
        zone.runOutsideAngular(wrapAsyncForMobile(() => {

            const shouldCloseOnClick = (event: MouseEvent) => {
                const element = event.target as HTMLElement;
                if (event.button === 2 || isContainedIn(element, ignoreElements)) {
                    return false
                } else if (type === 'inside') {
                    return isContainedIn(element, insideElements) && matchesSelector(element, insideSelector)
                } else if (type === 'outside') {
                    return !isContainedIn(element, insideElements)
                } else {
                    return matchesSelector(element, insideSelector) || !isContainedIn(element, insideElements)
                }
            };
            
            const escapes$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
                takeUntil(closed$),
                // tslint:disable-next-line:deprecation
                filter(e => e.which === 27), // Esc key
                tap(e => e.preventDefault())
            );
            // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown',
            // because on 'mouseup' DOM nodes might be detached
            const mouseDowns$ = fromEvent<MouseEvent>(document, 'mousedown').pipe(
                map(shouldCloseOnClick),
                takeUntil(closed$)
            );
            const closeableClicks$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
                withLatestFrom(mouseDowns$),
                filter(([_, shouldClose]) => <any>shouldClose),
                delay(0),
                takeUntil(closed$)
            ) as Observable<MouseEvent> | unknown;

            race<any>([escapes$, closeableClicks$]).subscribe(() => zone.run(close));
        }))
    }
}