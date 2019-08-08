import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError, from } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// import fake-database
import { ROOMS } from '../_database/mock-rooms';
import { POSITIONS } from '../_database/mock-positions';
import { EMPLOYEES } from '../_database/mock-employees';

// put data to local storage
localStorage.setItem('rooms', JSON.stringify(ROOMS));
localStorage.setItem('positions', JSON.stringify(POSITIONS));
localStorage.setItem('employees', JSON.stringify(EMPLOYEES));

// load data from local storage
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let positions = JSON.parse(localStorage.getItem('positions')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(100))
            .pipe(dematerialize());

        function handleRoute() {
            switch(true) {
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees();
                case url.endsWith('/rooms') && method === 'GET':
                    return getRooms();
                case url.endsWith('/positions') && method === 'GET':
                    return getPositions();
                case url.match(/\/positions\/\d+$/) && method === 'DELETE':
                    return deletePosition();
                case url.match(/\/rooms\/\d+$/) && method === 'DELETE':
                    return deleteRoom();
                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    return deleteEmployee();
                default:
                    return next.handle(request);
            }
        }

        // GET functions

        function getEmployees() {
            return ok(employees);
        }

        function getRooms() {
            return ok(rooms);
        }

        function getPositions() {
            return ok(positions);
        }

        // DELETE functions

        function deletePosition() {
            positions = positions.filter(x => x.id !== idFromUrl());
            localStorage.setItem('positions', JSON.stringify(positions));
            return ok();
        }

        function deleteRoom() {
            rooms = rooms.filter(x => x.id !== idFromUrl());
            localStorage.setItem('rooms', JSON.stringify(rooms));
            return ok();
        }

        function deleteEmployee() {
            employees = employees.filter(x => x.id !== idFromUrl());
            localStorage.setItem('employees', JSON.stringify(employees));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
}